import { db } from "./db";

async function main() {
  const user = await db.user.findUnique({
    where: { email: "principal@mgg.edu.in" }
  });
  console.log("=== PRINCIPAL ACCOUNT ===");
  console.log(user);
}

main().catch(console.error).finally(() => db.$disconnect());
