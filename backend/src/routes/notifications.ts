import { Router } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { sendPushNotification } from "../services/push.js";

const router = Router();

// Store active SSE connections
export const sseClients = new Map<string, any[]>();

export function sendNotificationToUser(userId: string, notification: any) {
  console.log(`[Backend SSE] Attempting to send notification to user ${userId}`);
  const clients = sseClients.get(userId);
  if (clients && clients.length > 0) {
    console.log(`[Backend SSE] Found ${clients.length} active connection(s) for user ${userId}. Emitting event.`);
    const message = `data: ${JSON.stringify(notification)}\n\n`;
    clients.forEach(client => {
      client.write(message);
      if (typeof client.flush === 'function') client.flush();
    });
  } else {
    console.log(`[Backend SSE] No active connections found for user ${userId}. Notification saved in DB only.`);
  }
  
  // Also trigger Firebase Push
  console.log(`[Backend Firebase] Triggering push for user ${userId}`);
  sendPushNotification(userId, notification.title, notification.message).catch(err => {
    console.error(`[Backend Firebase] Push failed for ${userId}:`, err);
  });
}

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

/**
 * @route GET /stream
 * @desc Server-Sent Events (SSE) stream for real-time notifications
 * NOTE: This route MUST be before router.use(authenticate) because
 * the browser's EventSource API cannot send Authorization headers.
 * Token auth is done manually via query param.
 */
router.get("/stream", (req, res) => {
  const token = req.query.token as string;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-for-dev") as { id: string };
    const userId = decoded.id;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    // Send initial heartbeat to confirm connection
    res.write(":\n\n");
    if (typeof (res as any).flush === 'function') (res as any).flush();

    // Add this client to the map
    if (!sseClients.has(userId)) {
      sseClients.set(userId, []);
    }
    sseClients.get(userId)!.push(res);
    console.log(`[Backend SSE] ✅ Client connected! User: ${userId}. Total: ${sseClients.get(userId)!.length}`);

    // Remove client when connection closes
    req.on("close", () => {
      const clients = sseClients.get(userId);
      if (clients) {
        const index = clients.indexOf(res);
        if (index !== -1) clients.splice(index, 1);
        if (clients.length === 0) sseClients.delete(userId);
      }
      console.log(`[Backend SSE] ❌ Client disconnected! User: ${userId}. Remaining: ${sseClients.get(userId)?.length || 0}`);
    });
  } catch (error) {
    console.error("[Backend SSE] Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.use(authenticate as any);

async function getAuthUser(req: AuthRequest) {
  if (!req.user?.id) return null;
  return await db.user.findUnique({ where: { id: req.user.id } });
}

/**
 * @route GET /stream (moved above authenticate middleware)
 * @desc (see above)
 */

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

/**
 * @route POST /subscribe
 * @desc Saves the Firebase FCM token for the user
 */
router.post("/subscribe", async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return res.status(400).json({ error: "fcmToken is required" });

  const user = await getAuthUser(req as AuthRequest);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await db.user.update({
    where: { id: user.id },
    data: { fcmToken },
  });

  res.json({ success: true });
});

export default router;
