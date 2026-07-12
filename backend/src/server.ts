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

dotenv.config();

// Initialize background jobs
initializeCronJobs();
initWhatsAppAutomation();

const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use("/api/calendar", calendarRouter);
app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/notifications", notificationsRouter);


app.get("/api/health", (_, res) => res.json({ ok: true }));

import { sendWhatsAppAutomationMessage } from "./services/whatsapp-automation.js";

if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend listening on http://localhost:${port}`);
  });


}

export { app };
