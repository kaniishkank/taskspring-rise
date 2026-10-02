import "express-async-errors";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import notificationsRouter from "./routes/notifications.js";
import calendarRouter from "./routes/calendar.js";
import { initializeCronJobs } from "./jobs/cron.js";
import { initWhatsAppAutomation } from "./services/whatsapp-automation.js";
import path from "path";
import { authenticate } from "./middleware/auth.js";

dotenv.config();

// Initialize background jobs
try {
  initializeCronJobs();
} catch (err) {
  console.warn('[Cron] Failed to initialize cron jobs:', err);
}

try {
  initWhatsAppAutomation();
} catch (err) {
  console.warn('[WhatsApp] Automation init skipped/deferred:', err);
}

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Root & Health check routes for UptimeRobot and load balancers
app.get("/", (_, res) => res.json({ status: "online", message: "TaskSpring Rise API is running 🚀", timestamp: new Date().toISOString() }));
app.get("/health", (_, res) => res.json({ ok: true, status: "healthy" }));
app.get("/api/health", (_, res) => res.json({ ok: true, status: "healthy" }));

app.use("/api/calendar", calendarRouter);
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/notifications", notificationsRouter);

import { getWhatsAppStatus, sendWhatsAppAutomationMessage } from "./services/whatsapp-automation.js";

app.get("/api/whatsapp/status", authenticate, (req, res) => {
  res.json(getWhatsAppStatus());
});

import { globalErrorHandler } from "./middleware/errorHandler.js";
app.use(globalErrorHandler as any);

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });
}

export { app };
