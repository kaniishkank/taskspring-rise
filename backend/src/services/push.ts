import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "fs";
import path from "path";
import { db } from "../db.js";

const serviceAccountPath = path.resolve(process.cwd(), "firebase-service-account.json");

let initialized = false;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));
    initializeApp({
      credential: cert(serviceAccount),
    });
    initialized = true;
    console.log("Firebase Admin initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
  }
} else {
  console.warn("firebase-service-account.json not found. Push notifications will be disabled.");
}

export async function sendPushNotification(userId: string, title: string, body: string) {
  if (!initialized) return;

  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || !user.fcmToken) return;

    const message = {
      notification: { title, body },
      token: user.fcmToken,
    };

    await getMessaging().send(message);
    console.log(`Push notification sent to user ${userId}`);
  } catch (error) {
    console.error(`Failed to send push notification to user ${userId}:`, error);
  }
}
