import { db } from "./db.js";
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword = await bcrypt.hash("123", 10);
  
  const users = await db.user.findMany();
  console.log(`Found ${users.length} users in the database.`);
  
  for (const user of users) {
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    console.log(`Updated password for: ${user.name} (${user.email})`);
  }
  
  console.log("All user passwords have been successfully updated to '123' (hashed)!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
