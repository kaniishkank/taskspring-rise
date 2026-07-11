import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

async function main() {
  await db.notification.deleteMany();
  await db.submission.deleteMany();
  await db.comment.deleteMany();
  await db.task.deleteMany();
  await db.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Admin@2026", 10);

  // Baseline Admin user (retained to ensure E2E tests pass)
  await db.user.create({
    data: {
      id: "m1",
      name: "Dr. R. Kapoor",
      email: "principal@mgg.edu.in",
      role: "MANAGER",
      department: "Executive",
      active: true,
      password: hashedPassword
    }
  });

  // 1. Create 3 Distinct MANAGER Accounts
  const managers = [
    {
      id: "m2",
      name: "Principal S. Ramanathan",
      email: "principal.ramanathan@mggschool.edu",
      role: "MANAGER" as const,
      department: "Administration",
      active: true,
      password: hashedPassword
    },
    {
      id: "m3",
      name: "Vice Principal M. Thillaivanan",
      email: "viceprincipal.t@mggschool.edu",
      role: "MANAGER" as const,
      department: "Administration",
      active: true,
      password: hashedPassword
    },
    {
      id: "m4",
      name: "Academic Coordinator S. Meenakshi",
      email: "coordinator.m@mggschool.edu",
      role: "MANAGER" as const,
      department: "Academics",
      active: true,
      password: hashedPassword
    }
  ];

  for (const m of managers) {
    await db.user.create({ data: m });
  }

  // 2. Create 6 Distinct STAFF Accounts
  const staff = [
    {
      id: "s1",
      name: "K. Rajesh (Mathematics Senior)",
      email: "rajesh.math@mggschool.edu",
      role: "STAFF" as const,
      department: "Mathematics",
      active: true,
      password: hashedPassword
    },
    {
      id: "s2",
      name: "A. Lakshmi (Physics Department)",
      email: "lakshmi.phys@mggschool.edu",
      role: "STAFF" as const,
      department: "Physics",
      active: true,
      password: hashedPassword
    },
    {
      id: "s3",
      name: "P. Kumar (Chemistry Department)",
      email: "kumar.chem@mggschool.edu",
      role: "STAFF" as const,
      department: "Chemistry",
      active: true,
      password: hashedPassword
    },
    {
      id: "s4",
      name: "S. Divya (Computer Science)",
      email: "divya.cs@mggschool.edu",
      role: "STAFF" as const,
      department: "Computer Science",
      active: true,
      password: hashedPassword
    },
    {
      id: "s5",
      name: "V. Anand (English Department)",
      email: "anand.eng@mggschool.edu",
      role: "STAFF" as const,
      department: "English",
      active: true,
      password: hashedPassword
    },
    {
      id: "s6",
      name: "R. Priya (Social Sciences)",
      email: "priya.social@mggschool.edu",
      role: "STAFF" as const,
      department: "Social Sciences",
      active: true,
      password: hashedPassword
    }
  ];

  for (const s of staff) {
    await db.user.create({ data: s });
  }

  console.log(`Seed completed successfully!`);
  console.log(`Created 3 new Managers (plus 1 baseline Manager) and 6 Staff users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
