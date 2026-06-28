import { Router } from "express";
import { db } from "../db.js";

const router = Router();

async function getAuthUser(req: any) {
  const userId = req.headers["x-user-id"];
  const userEmail = req.headers["x-user-email"];

  if (typeof userId === "string" && userId) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (user) return user;
  }
  if (typeof userEmail === "string" && userEmail) {
    const user = await db.user.findUnique({ where: { email: userEmail } });
    if (user) return user;
  }
  return null;
}

router.get("/", async (req, res) => {
  const where: any = {};

  const user = await getAuthUser(req);
  if (user && user.role === "staff") {
    where.userId = user.id;
  }

  const notifications = await db.notification.findMany({
    where,
    orderBy: { at: "desc" },
  });
  res.json(notifications);
});

router.patch("/read-all", async (req, res) => {
  const where: any = {};

  const user = await getAuthUser(req);
  if (user && user.role === "staff") {
    where.userId = user.id;
  }

  await db.notification.updateMany({
    where,
    data: { read: true },
  });
  res.json({ success: true });
});

router.patch("/:id", async (req, res) => {
  const { read } = req.body;

  const existingNotification = await db.notification.findUnique({
    where: { id: req.params.id },
  });
  if (!existingNotification) return res.status(404).json({ error: "Notification not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "staff" && existingNotification.userId !== user.id) {
    return res.status(403).json({ error: "Access denied. You do not own this notification." });
  }

  const notification = await db.notification.update({
    where: { id: req.params.id },
    data: { read },
  });
  res.json(notification);
});

router.delete("/:id", async (req, res) => {
  const existingNotification = await db.notification.findUnique({
    where: { id: req.params.id },
  });
  if (!existingNotification) return res.status(404).json({ error: "Notification not found" });

  const user = await getAuthUser(req);
  if (user && user.role === "staff" && existingNotification.userId !== user.id) {
    return res.status(403).json({ error: "Access denied. You do not own this notification." });
  }

  await db.notification.delete({
    where: { id: req.params.id },
  });
  res.json({ success: true });
});

export default router;
