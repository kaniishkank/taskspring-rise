import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { api } from "./api";

const firebaseConfig = {
  apiKey: "AIzaSyDcOinAjm1suBn-vQ_IlhKoenMc17psx_E",
  authDomain: "mgg-dashboard.firebaseapp.com",
  projectId: "mgg-dashboard",
  storageBucket: "mgg-dashboard.firebasestorage.app",
  messagingSenderId: "914318799661",
  appId: "1:914318799661:web:1700fb8950522800ab99a4"
};

export const app = initializeApp(firebaseConfig);
export const messaging = typeof window !== "undefined" && "serviceWorker" in navigator ? getMessaging(app) : null;

export const requestFirebaseNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.warn("[Firebase] Messaging object is null! ServiceWorker not supported or Firebase failed to init.");
      return;
    }
    
    console.log("[Firebase] Requesting Notification.requestPermission()...");
    const permission = await Notification.requestPermission();
    console.log("[Firebase] Permission result:", permission);
    
    if (permission === "granted") {
      console.log("[Firebase] Notification permission granted. Requesting token from FCM servers...");
      
      const currentToken = await getToken(messaging, { 
        vapidKey: "BNQV_Ikcmo3y1zIa1ynGN7fhp1ESdaXCYa7qQwJHIvSchDGm7p4ZpKoIWz5WBPn0ak2T63lhyjl5x-56bww9YNU" 
      }).catch(err => {
         console.warn("[Firebase] getToken with VAPID key failed, trying without...", err);
         return getToken(messaging);
      });
      
      if (currentToken) {
        console.log("[Firebase] FCM Token successfully generated! Sending to backend:", currentToken.substring(0, 15) + "...");
        await api.subscribeToPush(currentToken);
        console.log("[Firebase] Backend successfully saved FCM token.");
      } else {
        console.warn("[Firebase] No registration token available.");
      }
    } else {
      console.warn("[Firebase] Unable to get permission to notify (status: " + permission + ").");
    }
  } catch (err) {
    console.error("[Firebase] An error occurred while retrieving token. ", err);
  }
};

if (messaging) {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    // The SSE already handles foreground, so we might not need to do anything here, 
    // or we can trigger a toast if SSE fails.
  });
}
