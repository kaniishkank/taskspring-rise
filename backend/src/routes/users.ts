import { Router } from "express";
import { db } from "../db.js";
import { authenticate, authorizeManager, AuthRequest } from "../middleware/auth.js";
import bcrypt from "bcrypt";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
  if (req.user?.role !== "manager" && req.user?.role !== "super_admin" && req.user?.id !== req.params.id) {
    return res.status(403).json({ error: "Forbidden: You can only edit your own profile" });
  }

  const { name, email, department, active, avatar, password, notifyAssignments, notifyDeadlines, notifyApprovals, notifyWeekly, role } = req.body;
  
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (department !== undefined) data.department = department;
  // Only managers can change active status or role
  if (active !== undefined && (req.user?.role === "manager" || req.user?.role === "super_admin")) data.active = active;
  if (role !== undefined && (req.user?.role === "manager" || req.user?.role === "super_admin")) data.role = role;
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @route POST /setup-notifier
 * @desc Dynamically writes local configuration and registers startup notifier scheduled task.
 */
router.post("/setup-notifier", async (req: AuthRequest, res) => {
  if (!req.user?.id) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await db.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Since users.ts is in backend/src/routes/ (or dist/routes/), go up 3 folders to get to the workspace root
    const projectRoot = path.resolve(__dirname, "../../..");
    const configPath = path.join(projectRoot, "mgg_config.json");
    const installerPath = path.join(projectRoot, "install_notifier_task.ps1");

    // 1. Write custom mgg_config.json for this active user
    const configData = {
      userId: user.email,
      backendUrl: `http://localhost:${process.env.PORT || 4000}`
    };
    fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), "utf8");

    // 2. Trigger powershell elevated run-as UAC installer for Task Scheduler
    const escapedPath = installerPath.replace(/"/g, '\\"');
    const powershellCmd = `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \\"${escapedPath}\\"' -Verb RunAs"`;
    
    exec(powershellCmd, (err, stdout, stderr) => {
      if (err) {
        console.error("UAC spawn error:", stderr);
        return res.status(500).json({ error: "Failed to trigger installer popup.", details: stderr });
      }
      res.json({ success: true, message: "A Windows Administrator prompt has been sent to your desktop. Please click 'Yes' to register notifications." });
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to trigger automatic setup" });
  }
});

export default router;
