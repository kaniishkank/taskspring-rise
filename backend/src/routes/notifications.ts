import { Router } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /startup
 * @desc Retrieves unnotified notifications and upcoming/overdue tasks for desktop client startup
 */
router.get("/startup", async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.status(400).json({ error: "userId query parameter is required" });
  }

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
      return res.status(404).json({ error: "User not found" });
    }

    // Get notifications that haven't been popped up on OS startup
    const notifications = await db.notification.findMany({
      where: {
        userId: user.id,
        read: false,
        notifiedOnStartup: false,
      },
      orderBy: { at: "desc" },
    });

    // Get active tasks (overdue or due within 48 hours)
    const tasks = await db.task.findMany({
      where: {
        assignedToId: user.id,
        status: { notIn: ["completed", "approved"] },
      },
    });

    const now = new Date();
    const upcomingLimit = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const urgentTasks = tasks.filter((t) => {
      const d = new Date(t.dueDate);
      return d < now || (d >= now && d <= upcomingLimit);
    });

    // Mark retrieved notifications as notifiedOnStartup = true
    if (notifications.length > 0) {
      await db.notification.updateMany({
        where: {
          id: { in: notifications.map((n) => n.id) },
        },
        data: {
          notifiedOnStartup: true,
        },
      });
    }

    res.json({
      notifications,
      urgentTasks: urgentTasks.map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        status: t.status,
        priority: t.priority,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to process startup check" });
  }
});

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
