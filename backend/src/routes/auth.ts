import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  const user = await db.user.findUnique({ where: { email: loginId } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ user, token: "demo-token" });
});

router.get("/me", async (_req, res) => {
  const user = await db.user.findFirst();
  res.json({ user });
});

export default router;
