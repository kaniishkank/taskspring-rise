import { Router } from "express";
import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";

/**
 * @route POST /login
 * @desc Authenticates a user with bcrypt and returns a JWT
 * @returns { user, token }
 */
router.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  const user = await db.user.findUnique({ where: { email: loginId } });
  
  if (!user || !user.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ user, token });
});

/**
 * @route GET /me
 * @desc Retrieves the current user via JWT token
 * @returns { user }
 */
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({ user });
});

export default router;
