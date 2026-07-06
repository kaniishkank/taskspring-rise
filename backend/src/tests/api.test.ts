import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
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
      .get(`/api/tasks/ical/${user.id}`)
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
      .get(`/api/tasks/ical/${user.id}`)
      .expect(200);

    expect(res.headers["content-type"]).toContain("text/calendar");
    expect(res.text).toContain("BEGIN:VCALENDAR");
    expect(res.text).not.toContain("BEGIN:VEVENT");
    expect(res.text).toContain("END:VCALENDAR");
  });
});
