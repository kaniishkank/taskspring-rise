import { Router } from "express";
import { db } from "../db.js";

const router = Router();

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
  res.json(parseTask(task));
});

router.post("/", async (req, res) => {
  const { title, description, priority, assignedToId, assignedById, dueDate, attachments } = req.body;

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

  res.status(201).json(parseTask({ ...task, comments: [], submissions: [] }));
});

router.put("/:id", async (req, res) => {
  const { title, description, priority, status, dueDate, assignedToId, attachments } = req.body;
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

  res.status(201).json({
    ...submission,
    files: JSON.parse(submission.files),
    links: JSON.parse(submission.links),
  });
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const task = await db.task.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json(parseTask({ ...task, comments: [], submissions: [] }));
});

export default router;
