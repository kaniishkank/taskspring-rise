import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import jwt from "jsonwebtoken";
import { app } from "../server.js";
import { db } from "../db.js";

describe("iCalendar API Endpoint Tests", () => {
  beforeAll(async () => {
    // Perform cleanup once at the beginning of the test suite
    try {
      await db.comment.deleteMany({});
      await db.submission.deleteMany({});
      await db.task.deleteMany({});
      await db.user.deleteMany({});
    } catch (err) {
      console.warn("Cleanup failed (could be due to transient pooler rate-limits), proceeding...", err);
    }
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("should return a valid iCalendar stream for a user's tasks", async () => {
    // Generate unique ID to prevent database collisions
    const randomSuffix = Math.floor(Math.random() * 100000);
    const userId = `user-qa-${randomSuffix}`;
    const taskId = `task-qa-${randomSuffix}`;

    // Create a mock user
    const user = await db.user.create({
      data: {
        id: userId,
        name: "QA Sync User",
        email: `qa_tester_${randomSuffix}@mgg.edu.in`,
        role: "STAFF",
        department: "Testing",
      },
    });

    // Create a task due in 24 hours
    await db.task.create({
      data: {
        id: taskId,
        title: "Verify Test Pipeline",
        description: "Automated test description",
        priority: "high",
        status: "assigned",
        assignedToId: user.id,
        assignedById: user.id,
        dueDate: new Date(Date.now() + 86400000), // 24 hours
      },
    });

    // Query iCal endpoint using Supertest
    const res = await request(app)
      .get(`/api/calendar/feed/${user.calendarToken}`)
      .expect(200);

    // Verify content type and iCalendar structure
    expect(res.headers["content-type"]).toContain("text/calendar");
    expect(res.text).toContain("BEGIN:VCALENDAR");
    expect(res.text).toContain("SUMMARY:Verify Test Pipeline");
    expect(res.text).toContain("Automated test description");
    expect(res.text).toContain("END:VCALENDAR");
  });

  it("should return an empty valid iCalendar feed if user has no pending tasks", async () => {
    const randomSuffix = Math.floor(Math.random() * 100000);
    const userId = `user-empty-${randomSuffix}`;

    const user = await db.user.create({
      data: {
        id: userId,
        name: "Empty Calendar User",
        email: `empty_cal_${randomSuffix}@mgg.edu.in`,
        role: "STAFF",
      },
    });

    const res = await request(app)
      .get(`/api/calendar/feed/${user.calendarToken}`)
      .expect(200);

    expect(res.headers["content-type"]).toContain("text/calendar");
    expect(res.text).toContain("BEGIN:VCALENDAR");
    expect(res.text).not.toContain("BEGIN:VEVENT");
    expect(res.text).toContain("END:VCALENDAR");
  });
});

describe("REQ-008: Real-Time Notification Alerts on Task Changes", () => {
  let staffUser: any;
  let managerUser: any;
  let task: any;
  let staffToken: string;

  beforeAll(async () => {
    const suffix = Math.floor(Math.random() * 100000);
    
    // Create staff user
    staffUser = await db.user.create({
      data: {
        id: `staff-${suffix}`,
        name: `Staff Member ${suffix}`,
        email: `staff_${suffix}@mgg.edu.in`,
        role: "STAFF",
        department: "Operations",
      },
    });

    // Create manager user
    managerUser = await db.user.create({
      data: {
        id: `manager-${suffix}`,
        name: `Manager User ${suffix}`,
        email: `manager_${suffix}@mgg.edu.in`,
        role: "MANAGER",
        department: "Executive",
      },
    });

    // Sign staff token
    staffToken = jwt.sign(
      { id: staffUser.id, role: staffUser.role },
      process.env.JWT_SECRET || "fallback-secret-for-dev"
    );

    // Create a task assigned by manager to staff
    task = await db.task.create({
      data: {
        id: `task-${suffix}`,
        title: "Test REQ-008 Alerting",
        description: "Test description",
        priority: "medium",
        status: "assigned",
        assignedToId: staffUser.id,
        assignedById: managerUser.id,
        dueDate: new Date(),
      },
    });
  });

  it("should trigger manager notification when staff updates task status", async () => {
    // Clear notifications for manager first
    await db.notification.deleteMany({ where: { userId: managerUser.id } });

    await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "in_progress" })
      .expect(200);

    // Check notification queue of manager
    const notifications = await db.notification.findMany({
      where: { userId: managerUser.id },
    });

    expect(notifications.length).toBeGreaterThan(0);
    const updateNotification = notifications.find((n) => n.title === "Task Status Updated");
    expect(updateNotification).toBeDefined();
    expect(updateNotification?.message).toContain("in_progress");
  });

  it("should trigger manager notification when staff comments on the task", async () => {
    // Clear notifications for manager first
    await db.notification.deleteMany({ where: { userId: managerUser.id } });

    await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ userId: staffUser.id, text: "Adding a comments updates manager" })
      .expect(201);

    // Check notification queue of manager
    const notifications = await db.notification.findMany({
      where: { userId: managerUser.id },
    });

    expect(notifications.length).toBeGreaterThan(0);
    const commentNotification = notifications.find((n) => n.title === "New Task Comment");
    expect(commentNotification).toBeDefined();
    expect(commentNotification?.message).toContain("commented on task");
  });
});

