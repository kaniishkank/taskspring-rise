import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import notificationsRouter from "./routes/notifications.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/notifications", notificationsRouter);

app.get("/api/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
