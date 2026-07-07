import { Router } from "express";
import crypto from "crypto";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import { sendNotificationToUser } from "./notifications.js";

const router = Router();

/**
 * @route GET /ical/:userId
 * @desc Generates an iCalendar (.ics) feed for a user's assigned tasks to sync with OS Calendars.
 */
router.get("/ical/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userId },
        ],
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Retrieve active tasks assigned to this user
    const tasks = await db.task.findMany({
      where: {
        assignedToId: user.id,
        status: { notIn: ["completed", "approved"] },
      },
    });

    const formatDate = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const year = date.getUTCFullYear();
      const month = pad(date.getUTCMonth() + 1);
      const day = pad(date.getUTCDate());
      const hours = pad(date.getUTCHours());
      const minutes = pad(date.getUTCMinutes());
      const seconds = pad(date.getUTCSeconds());
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const formatDateDay = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      const year = date.getUTCFullYear();
      const month = pad(date.getUTCMonth() + 1);
      const day = pad(date.getUTCDate());
      return `${year}${month}${day}`;
    };

    const baseDomain = req.headers.host?.includes('localhost') 
      ? 'YOUR_TUNNEL_URL_HERE_IF_USING_NGROK_OR_LOCAL_IP' 
      : `https://${req.headers.host}`;
    
    const frontendDomain = baseDomain.includes('YOUR_TUNNEL_URL')
      ? baseDomain
      : baseDomain.replace(':4000', ':8080');

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mahatma Global Gateway//TaskFlow//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:TaskFlow - ${user.name}`,
      `X-WR-TIMEZONE:Asia/Kolkata`,
      "X-PUBLISHED-TTL:PT1M",
      "REFRESH-INTERVAL;VALUE=DURATION:PT1M",
      "Cache-Control: no-cache, no-store, must-revalidate",
    ];

    tasks.forEach((task) => {
      const taskUrl = `${frontendDomain}/tasks/${task.id}`;
      const dtstamp = formatDate(new Date(task.createdAt));
      const dtstart = formatDateDay(new Date(task.dueDate));
      
      const nextDay = new Date(task.dueDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const dtend = formatDateDay(nextDay);

      const cleanSummary = task.title.replace(/[,;]/g, "\\$&");
      const cleanDesc = (task.description || "").replace(/[\r\n]+/g, " ").replace(/[,;]/g, "\\$&");

      icsContent.push(
        "BEGIN:VEVENT",
        `UID:${task.id}@mgg.edu.in`,
        `DTSTAMP:${dtstamp}`,
        `DTSTART;VALUE=DATE:${dtstart}`,
        `DTEND;VALUE=DATE:${dtend}`,
        `SUMMARY:${cleanSummary}`,
        `DESCRIPTION:Priority: ${task.priority.toUpperCase()}\\n\\n${cleanDesc}\\n\\nLink: ${taskUrl}`,
        `URL:${taskUrl}`,
        "STATUS:CONFIRMED",
        "END:VEVENT"
      );
    });

    icsContent.push("END:VCALENDAR");

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Content-Disposition", `attachment; filename="tasks_${user.id}.ics"`);
    res.send(icsContent.join("\r\n"));

  } catch (error: any) {
    res.status(500).send("Failed to generate iCalendar feed");
  }
});

router.use(authenticate as any);

/**
 * Extracts and returns the authenticated user from the JWT payload.
 */
async function getAuthUser(req: AuthRequest) {
  if (!req.user?.id) return null;
  return await db.user.findUnique({ where: { id: req.user.id } });
}

/**
 * Parses a raw database task object, safely transforming JSON strings 
 * (like attachments, files, links) into parsed arrays.
 */
export function parseTask(task: any) {
  const assignedTo = task.assignedTo?.id ?? task.assignedToId;
  const assignedBy = task.assignedBy?.id ?? task.assignedById;

  return {
    ...task,
    assignedTo,
    assignedBy,
    attachments: JSON.parse(task.attachments ?? "[]"),
    comments: task.comments ?? [],
    submissions: (task.submissions ?? []).map((submission: any) => ({
      ...submission,
      files: JSON.parse(submission.files ?? "[]"),
      links: JSON.parse(submission.links ?? "[]"),
    })),
  };
}

router.get("/", async (req, res) => {
  const { status, priority, search } = req.query;
  const where: any = {};

  const user = await getAuthUser(req);
  if (user) {
    if (user.role === "STAFF") {
      where.assignedToId = user.id;
    } else if (user.role === "MANAGER") {
      where.assignedById = user.id;
    }
  }

  if (status && status !== "all") where.status = status;
  if (priority && priority !== "all") where.priority = priority;
  if (search && typeof search === "string") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { id: { contains: search, mode: "insensitive" } },
    ];
  }

  const tasks = await db.task.findMany({
    where,
    include: {
      assignedTo: true,
      assignedBy: true,
      comments: true,
      submissions: true,
    },
  });

  res.json(tasks.map(parseTask));
});

router.get("/:id", async (req, res) => {
  const task = await db.task.findUnique({
    where: { id: req.params.id },
    include: {
      assignedTo: true,
      assignedBy: true,
      comments: true,
      submissions: true,
    },
  });

  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await getAuthUser(req);
  if (user) {
    if (user.role === "STAFF" && task.assignedToId !== user.id) {
      return res.status(403).json({ error: "Access denied. You do not have permission to view this task." });
    }
    if (user.role === "MANAGER" && task.assignedById !== user.id) {
      return res.status(403).json({ error: "Access denied. You do not have permission to view this task." });
    }
  }

  res.json(parseTask(task));
});

router.post("/", async (req, res) => {
  const { title, description, priority, assignedToId, assignedById, dueDate, attachments } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "STAFF") {
    return res.status(403).json({ error: "Access denied. Only managers can create/assign tasks." });
  }

  const task = await db.task.create({
    data: {
      id: `TSK-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      title,
      description,
      priority,
      status: "assigned",
      assignedToId,
      assignedById,
      dueDate: new Date(dueDate),
      attachments: JSON.stringify(attachments ?? []),
    },
  });

  try {
    const notification = await db.notification.create({
      data: {
        userId: assignedToId,
        taskId: task.id,
        title: "New Task Assigned",
        message: `You have been assigned a new task: "${title}". Due date: ${new Date(dueDate).toLocaleDateString()}.`,
        category: "assignment",
      },
      include: {
        task: {
          include: {
            assignedBy: true,
            assignedTo: true,
            comments: true,
            submissions: true,
          },
        },
      },
    });
    sendNotificationToUser(assignedToId, {
      ...notification,
      task: notification.task ? parseTask(notification.task) : null,
    });
  } catch (err) {
    console.error("Failed to create task notification", err);
  }

  res.status(201).json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.put("/:id", async (req, res) => {
  const { title, description, priority, status, dueDate, assignedToId, attachments } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "STAFF") {
    return res.status(403).json({ error: "Access denied. Only managers can update tasks." });
  }

  const task = await db.task.update({
    where: { id: req.params.id },
    data: {
      title,
      description,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedToId,
      attachments: JSON.stringify(attachments ?? []),
    },
  });
  res.json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.post("/:id/comments", async (req, res) => {
  const { userId, text } = req.body;

  const task = await db.task.findUnique({ where: { id: req.params.id } });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "STAFF" && task.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You can only comment on tasks assigned to you." });
  }

  const comment = await db.comment.create({
    data: {
      taskId: req.params.id,
      userId,
      text,
    },
  });

  if (user && user.role === "STAFF" && task.assignedById) {
    try {
      const notification = await db.notification.create({
        data: {
          userId: task.assignedById,
          taskId: task.id,
          title: "New Task Comment",
          message: `Staff member ${user.name} commented on task "${task.title}".`,
          category: "update",
        },
        include: {
          task: {
            include: {
              assignedBy: true,
              assignedTo: true,
              comments: true,
              submissions: true,
            },
          },
        },
      });
      sendNotificationToUser(task.assignedById, {
      ...notification,
      task: notification.task ? parseTask(notification.task) : null,
    });
    } catch (err) {
      console.error("Failed to create comment notification", err);
    }
  }

  res.status(201).json(comment);
});

router.post("/:id/submissions", async (req, res) => {
  const { userId, notes, files, links, status } = req.body;

  const task = await db.task.findUnique({ where: { id: req.params.id } });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "STAFF" && task.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You can only submit proof for tasks assigned to you." });
  }

  const submission = await db.submission.create({
    data: {
      taskId: req.params.id,
      userId,
      notes,
      files: JSON.stringify(files ?? []),
      links: JSON.stringify(links ?? []),
      status,
    },
  });

  const updatedTask = await db.task.update({
    where: { id: req.params.id },
    data: { status: "submitted" },
  });

  try {
    console.log(`[Tasks] Submission created. Task assignedById: ${updatedTask.assignedById}, assignedToId: ${updatedTask.assignedToId}`);
    if (!updatedTask.assignedById) {
      console.warn("[Tasks] Cannot send submission notification: assignedById is null on this task!");
    } else {
      const notification = await db.notification.create({
        data: {
          userId: updatedTask.assignedById,
          taskId: updatedTask.id,
          title: "Task Submission Received",
          message: `Staff has submitted task "${updatedTask.title}" for your review.`,
          category: "approval",
        },
        include: {
          task: {
            include: {
              assignedBy: true,
              assignedTo: true,
              comments: true,
              submissions: true,
            },
          },
        },
      });
      sendNotificationToUser(updatedTask.assignedById, {
      ...notification,
      task: notification.task ? parseTask(notification.task) : null,
    });
      console.log(`[Tasks] Submission notification sent to manager ${updatedTask.assignedById}`);
    }
  } catch (err) {
    console.error("Failed to create submission notification", err);
  }

  res.status(201).json({
    ...submission,
    files: JSON.parse(submission.files),
    links: JSON.parse(submission.links),
  });
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  
  const existingTask = await db.task.findUnique({ where: { id: req.params.id } });
  if (!existingTask) return res.status(404).json({ error: "Task not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "STAFF" && existingTask.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You can only update the status of your own tasks." });
  }

  const task = await db.task.update({
    where: { id: req.params.id },
    data: { status },
  });

  if (user && user.role === "STAFF" && task.assignedById) {
    try {
      const notification = await db.notification.create({
        data: {
          userId: task.assignedById,
          taskId: task.id,
          title: "Task Status Updated",
          message: `Staff member ${user.name} has updated the status of task "${task.title}" to "${status}".`,
          category: "update",
        },
        include: {
          task: {
            include: {
              assignedBy: true,
              assignedTo: true,
              comments: true,
              submissions: true,
            },
          },
        },
      });
      sendNotificationToUser(task.assignedById, {
      ...notification,
      task: notification.task ? parseTask(notification.task) : null,
    });
    } catch (err) {
      console.error("Failed to create task status update notification", err);
    }
  }

  res.json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.patch("/:id/submissions/:submissionId", async (req, res) => {
  const { status, commentText, managerId } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "STAFF") {
    return res.status(403).json({ error: "Access denied. Only managers can approve/reject submissions." });
  }
  
  const sub = await db.submission.update({
    where: { id: req.params.submissionId },
    data: { status },
  });

  let taskStatus = "assigned";
  let notificationTitle = "";
  let notificationMsg = "";
  let notificationCategory = "approval";

  if (status === "approved") {
    taskStatus = "approved";
    notificationTitle = "Task Approved";
    notificationMsg = "Your submission has been approved.";
    notificationCategory = "approval";
  } else if (status === "rejected") {
    taskStatus = "rejected";
    notificationTitle = "Task Rejected";
    notificationMsg = "Your submission has been rejected.";
    notificationCategory = "rejection";
  } else if (status === "changes_requested") {
    taskStatus = "in_progress";
    notificationTitle = "Changes Requested";
    notificationMsg = "Your manager has requested changes.";
    notificationCategory = "rejection";
  }

  const task = await db.task.update({
    where: { id: req.params.id },
    data: { status: taskStatus },
  });

  if (commentText && managerId) {
    await db.comment.create({
      data: {
        taskId: req.params.id,
        userId: managerId,
        text: commentText,
      },
    });
  }

  try {
    const notification = await db.notification.create({
      data: {
        userId: task.assignedToId,
        taskId: task.id,
        title: notificationTitle,
        message: `${notificationMsg} (Task: "${task.title}").`,
        category: notificationCategory,
      },
      include: {
        task: {
          include: {
            assignedBy: true,
            assignedTo: true,
            comments: true,
            submissions: true,
          },
        },
      },
    });
    sendNotificationToUser(task.assignedToId, {
      ...notification,
      task: notification.task ? parseTask(notification.task) : null,
    });
  } catch (err) {
    console.error("Failed to create review notification", err);
  }

  res.json({
    submission: {
      ...sub,
      files: JSON.parse(sub.files),
      links: JSON.parse(sub.links),
    },
    task,
  });
});

/**
 * @route DELETE /:id
 * @desc Deletes a task and its associated comments and submissions.
 */
router.delete("/:id", async (req: AuthRequest, res) => {
  const user = await getAuthUser(req);
  if (!user || user.role === "STAFF") {
    return res.status(403).json({ error: "Access denied. Only managers can delete tasks." });
  }

  try {
    await db.$transaction([
      db.comment.deleteMany({ where: { taskId: req.params.id } }),
      db.submission.deleteMany({ where: { taskId: req.params.id } }),
      db.task.delete({ where: { id: req.params.id } }),
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
