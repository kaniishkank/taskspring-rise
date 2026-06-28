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

  // Create ONLY the Admin user for a clean slate
  await db.user.create({ 
    data: { 
      id: "m1", 
      name: "Dr. R. Kapoor", 
      email: "principal@mgg.edu.in", 
      role: "manager", 
      department: "Executive", 
      active: true, 
      password: hashedPassword 
    } 
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
