import { Router } from "express";
import { db } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { name, email, role, department, active } = req.body;
  const user = await db.user.create({
    data: {
      name,
      email,
      role,
      department,
      active: active ?? true,
    },
  });
  res.status(201).json(user);
});

router.put("/:id", async (req, res) => {
  const { name, email, department, active, avatar, password } = req.body;
  
  const data: any = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (department !== undefined) data.department = department;
  if (active !== undefined) data.active = active;
  if (avatar !== undefined) data.avatar = avatar;
  if (password !== undefined) data.password = password;

  const user = await db.user.update({
    where: { id: req.params.id },
    data,
  });
  res.json(user);
});

export default router;
