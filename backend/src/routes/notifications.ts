import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const notifications = await db.notification.findMany({ orderBy: { at: "desc" } });
  res.json(notifications);
});

router.patch("/:id", async (req, res) => {
  const { read } = req.body;
  const notification = await db.notification.update({
    where: { id: req.params.id },
    data: { read },
  });
  res.json(notification);
});

router.patch("/read-all", async (_req, res) => {
  await db.notification.updateMany({ data: { read: true } });
  res.json({ success: true });
});

export default router;
