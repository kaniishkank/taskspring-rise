import { Router } from "express";
import { db } from "../db.js";
import { authenticate, authorizeManager, AuthRequest } from "../middleware/auth.js";
import bcrypt from "bcrypt";

const router = Router();
router.use(authenticate as any);

/**
 * @route GET /
 * @desc Fetches all users in the system.
 */
router.get("/", async (_req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

/**
 * @route GET /:id
 * @desc Fetches a specific user by ID.
 */
router.get("/:id", async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

/**
 * @route POST /
 * @desc Creates a new user.
 */
router.post("/", authorizeManager as any, async (req, res) => {
  const { name, email, role, department, active, password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      role,
      department,
      active: active ?? true,
      password: hashedPassword,
    },
  });
  res.status(201).json(user);
});

/**
 * @route PUT /:id
 * @desc Updates an existing user's details, including notification preferences.
 */
router.put("/:id", async (req: AuthRequest, res) => {
  if (req.user?.role !== "MANAGER" && req.user?.role !== "OPERATION" && req.user?.id !== req.params.id) {
    return res.status(403).json({ error: "Forbidden: You can only edit your own profile" });
  }

  const { name, email, department, active, avatar, password, notifyAssignments, notifyDeadlines, notifyApprovals, notifyWeekly, role } = req.body;
  
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (department !== undefined) data.department = department;
  // Only managers can change active status or role
  if (active !== undefined && (req.user?.role === "MANAGER" || req.user?.role === "OPERATION")) data.active = active;
  if (role !== undefined && (req.user?.role === "MANAGER" || req.user?.role === "OPERATION")) data.role = role;
  if (avatar !== undefined) data.avatar = avatar;
  
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  if (notifyAssignments !== undefined) data.notifyAssignments = notifyAssignments;
  if (notifyDeadlines !== undefined) data.notifyDeadlines = notifyDeadlines;
  if (notifyApprovals !== undefined) data.notifyApprovals = notifyApprovals;
  if (notifyWeekly !== undefined) data.notifyWeekly = notifyWeekly;

  const user = await db.user.update({
    where: { id: req.params.id },
    data,
  });
  res.json(user);
});



export default router;
