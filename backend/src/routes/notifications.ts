import { Router } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
router.use(authenticate as any);

async function getAuthUser(req: AuthRequest) {
  if (!req.user?.id) return null;
  return await db.user.findUnique({ where: { id: req.user.id } });
}

/**
 * @route GET /
 * @desc Fetches notifications. Managers/Admins see all notifications. Staff only see their own.
 */
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
