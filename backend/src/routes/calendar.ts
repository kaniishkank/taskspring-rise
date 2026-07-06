import { Router } from "express";
import { db } from "../db.js";

const router = Router();

/**
 * @route GET /feed/:feedToken
 * @desc Generates an iCalendar (.ics) feed for a user's tasks to sync with OS Calendars.
 */
router.get("/feed/:feedToken", async (req, res) => {
  const { feedToken } = req.params;

  try {
    const user = await db.user.findUnique({
      where: {
        calendarToken: feedToken,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Retrieve active tasks
    // If they are a STAFF member, generate the feed containing ONLY tasks assigned to them (assignedToId).
    // If they are a MANAGER or OPERATION user, generate the feed with all tasks they oversee/manage (all tasks).
    const where: any = {
      status: { notIn: ["completed", "approved"] },
    };
    if (user.role === "STAFF") {
      where.assignedToId = user.id;
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

    let icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Mahatma Global Gateway//TaskFlow//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      `X-WR-CALNAME:TaskFlow - ${user.name}`,
      `X-WR-TIMEZONE:Asia/Kolkata`,
    ];

    tasks.forEach((task) => {
      const taskUrl = `http://localhost:8080/tasks/${task.id}`;
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
    res.setHeader("Content-Disposition", 'attachment; filename="calendar.ics"');
    res.send(icsContent.join("\r\n"));

  } catch (error: any) {
    res.status(500).send("Failed to generate iCalendar feed");
  }
});

export default router;
