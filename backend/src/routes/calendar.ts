import { Router } from "express";
import { db } from "../db.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

/**
 * @route GET /feed/:userId
 * @desc Generates an iCalendar (.ics) feed for a user's tasks to sync with OS Calendars.
 */
router.get("/feed/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userId },
          { calendarToken: userId }
        ]
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Retrieve active tasks
    // If they are a STAFF member, generate the feed containing ONLY tasks assigned to them (assignedToId).
    // If they are a MANAGER, generate the feed containing ONLY tasks created/assigned by them (assignedById).
    const where: any = {
      status: { notIn: ["completed", "approved"] },
    };
    if (user.role === "STAFF") {
      where.assignedToId = user.id;
    } else if (user.role === "MANAGER") {
      where.assignedById = user.id;
    }

    const tasks = await db.task.findMany({
      where,
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
    res.setHeader("Content-Disposition", 'attachment; filename="calendar.ics"');
    res.send(icsContent.join("\r\n"));

  } catch (error: any) {
    res.status(500).send("Failed to generate iCalendar feed");
  }
});

router.post("/sync-task", authenticate, async (req: AuthRequest, res) => {
  const { taskId, title, dueDate } = req.body;

  if (!taskId || !title || !dueDate) {
    return res.status(400).json({ error: "Missing required fields: taskId, title, or dueDate" });
  }

  try {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format for dueDate" });
    }

    // Google specifications require start.dateTime and end.dateTime in ISO 8601 format.
    const startDateTime = parsedDate.toISOString();
    
    // Set end date to 1 hour after the start date
    const endDate = new Date(parsedDate);
    endDate.setHours(endDate.getHours() + 1);
    const endDateTime = endDate.toISOString();

    const googleEventPayload = {
      summary: title,
      start: {
        dateTime: startDateTime,
        timeZone: "UTC"
      },
      end: {
        dateTime: endDateTime,
        timeZone: "UTC"
      }
    };

    console.log(`[Google Calendar Sync] Syncing task ${taskId} for user ${req.user?.id}`);
    console.log('[Google Calendar Sync] Generated Google Calendar Event Payload:', JSON.stringify(googleEventPayload, null, 2));

    return res.json({
      success: true,
      message: "📅 Successfully synchronized with Google Calendar!",
      event: googleEventPayload
    });
  } catch (error: any) {
    console.error("[Google Calendar Sync] Error during task synchronization:", error);
    return res.status(500).json({ error: "Failed to synchronize task with Google Calendar" });
  }
});

export default router;
