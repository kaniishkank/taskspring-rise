import { Router } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
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
function parseTask(task: any) {
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
  if (user && user.role === "staff") {
    where.assignedToId = user.id;
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
  if (user && user.role === "staff" && task.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You do not have permission to view this task." });
  }

  res.json(parseTask(task));
});

router.post("/", async (req, res) => {
  const { title, description, priority, assignedToId, assignedById, dueDate, attachments } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "staff") {
    return res.status(403).json({ error: "Access denied. Only managers can create/assign tasks." });
  }

  const task = await db.task.create({
    data: {
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
    await db.notification.create({
      data: {
        userId: assignedToId,
        title: "New Task Assigned",
        message: `You have been assigned a new task: "${title}". Due date: ${new Date(dueDate).toLocaleDateString()}.`,
        category: "assignment",
      },
    });
  } catch (err) {
    console.error("Failed to create task notification", err);
  }

  res.status(201).json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.put("/:id", async (req, res) => {
  const { title, description, priority, status, dueDate, assignedToId, attachments } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "staff") {
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
  if (user && user.role === "staff" && task.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You can only comment on tasks assigned to you." });
  }

  const comment = await db.comment.create({
    data: {
      taskId: req.params.id,
      userId,
      text,
    },
  });
  res.status(201).json(comment);
});

router.post("/:id/submissions", async (req, res) => {
  const { userId, notes, files, links, status } = req.body;

  const task = await db.task.findUnique({ where: { id: req.params.id } });
  if (!task) return res.status(404).json({ error: "Task not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "staff" && task.assignedToId !== user.id) {
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
    await db.notification.create({
      data: {
        userId: updatedTask.assignedById,
        title: "Task Submission Received",
        message: `Task "${updatedTask.title}" has been submitted for review.`,
        category: "approval",
      },
    });
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
  if (user && user.role === "staff" && existingTask.assignedToId !== user.id) {
    return res.status(403).json({ error: "Access denied. You can only update the status of your own tasks." });
  }

  const task = await db.task.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.patch("/:id/submissions/:submissionId", async (req, res) => {
  const { status, commentText, managerId } = req.body;

  const user = await getAuthUser(req);
  if (!user || user.role === "staff") {
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
    await db.notification.create({
      data: {
        userId: task.assignedToId,
        title: notificationTitle,
        message: `${notificationMsg} (Task: "${task.title}").`,
        category: notificationCategory,
      },
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

export default router;
