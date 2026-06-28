import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  const user = await db.user.findUnique({ where: { email: loginId } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const expectedPassword = user.password ?? "123";
  if (password !== expectedPassword) {
    return res.status(401).json({ error: "Invalid password" });
  }

  return res.json({ user, token: "demo-token" });
});

router.get("/me", async (req, res) => {
  const userId = req.headers["x-user-id"];
  const userEmail = req.headers["x-user-email"];

  if (typeof userId === "string" && userId) {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (user) {
      return res.json({ user });
    }
  }
  if (typeof userEmail === "string" && userEmail) {
    const user = await db.user.findUnique({ where: { email: userEmail } });
    if (user) {
      return res.json({ user });
    }
  }
  
  res.json({ user: null });
});

export default router;
