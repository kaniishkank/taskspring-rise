import { db } from "./db.js";

const passwords = ["Admin@2026", "password123"];

async function runAuthCheck() {
  console.log("=== STARTING AUTOMATED DATABASE AUTH & SESSION CHECK ===");
  let failed = false;

  try {
    const users = await db.user.findMany();
    console.log(`Found ${users.length} active database profiles to cycle login verification.`);

    for (const dbUser of users) {
      let success = false;
      let authData: any = null;
      let usedPassword = "";

      for (const pwd of passwords) {
        try {
          const response = await fetch("http://localhost:4000/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              loginId: dbUser.email,
              password: pwd
            })
          });

          if (response.ok) {
            authData = await response.json();
            success = true;
            usedPassword = pwd;
            break;
          }
        } catch (err) {
          // fetch network error fallback
        }
      }

      if (!success) {
        console.error(`❌ Authentication failed for profile: ${dbUser.name} (${dbUser.email})`);
        failed = true;
        continue;
      }

      // Assert Payload Integrity
      const { user, token } = authData || {};
      if (!token || typeof token !== "string" || token.length < 10) {
        console.error(`❌ Payload Integrity Error: Missing or invalid token for ${dbUser.email}`);
        failed = true;
        continue;
      }

      if (!user || typeof user !== "object") {
        console.error(`❌ Payload Integrity Error: Missing user object for ${dbUser.email}`);
        failed = true;
        continue;
      }

      const { id, name, role, email: userEmail } = user;
      if (!id || !name || !role || !userEmail) {
        console.error(`❌ Payload Integrity Error: User object fields missing for ${dbUser.email} -> ${JSON.stringify(user)}`);
        failed = true;
        continue;
      }

      if (role !== "MANAGER" && role !== "STAFF") {
        console.error(`❌ Payload Integrity Error: Invalid role ${role} for ${dbUser.email}`);
        failed = true;
        continue;
      }

      console.log(`✅ [SUCCESS] Authenticated ${name} (${role}) via ${dbUser.email} [pwd: ${usedPassword}]`);
    }

    if (failed) {
      console.error("=== AUTHENTICATION CHECK FAILED ===");
      process.exit(1);
    } else {
      console.log("=== ALL ACTIVE ACCOUNTS PASSED AUTH & SESSION CHECK SUCCESSFULLY ===");
      process.exit(0);
    }
  } catch (err: any) {
    console.error("Error reading database or connecting to backend server:", err);
    process.exit(1);
  }
}

runAuthCheck();
