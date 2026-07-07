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

  // 3. Programmatic Cross-Assignment Task Loop (Total 18 Tasks)
  const now = new Date();
  let taskCounter = 1;

  for (const m of managers) {
    for (const s of staff) {
      // Alternate status, priority, and due times for variety
      const status = taskCounter % 2 === 0 ? "IN_PROGRESS" : "ASSIGNED";
      
      // Ensure at least 6 tasks are marked as "HIGH" priority (e.g., taskCounter % 3 === 0)
      const priority = taskCounter % 3 === 0 ? "HIGH" : (taskCounter % 3 === 1 ? "MEDIUM" : "LOW");
      
      // Due date set within the next 48 hours (e.g., alternating between 24 and 36 hours from now)
      const dueOffsetHours = taskCounter % 2 === 0 ? 24 : 36;
      const dueDate = new Date(now.getTime() + dueOffsetHours * 60 * 60 * 1000);

      const mShortName = m.name.split(" ").slice(-1)[0];
      const sShortName = s.name.split(" ")[1];

      await db.task.create({
        data: {
          title: `Q1 Curriculum Audit Review ${taskCounter}`,
          description: `Collaborative academic review of lesson plans and assessments assigned by ${m.name} to ${s.name}. Please complete within the allocated timeline.`,
          status,
          priority,
          dueDate,
          assignedToId: s.id,
          assignedById: m.id
        }
      });

      taskCounter++;
    }
  }

  console.log(`Seed completed successfully!`);
  console.log(`Created 3 new Managers (plus 1 baseline Manager) and 6 Staff users.`);
  console.log(`Created 18 cross-assigned tasks with varied priorities.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
