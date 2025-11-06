import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAmBaydMwJERbAkKZMw_eQUaJmYY9cSP_s",
  authDomain: "buddy-split.firebaseapp.com",
  projectId: "buddy-split",
  storageBucket: "buddy-split.firebasestorage.app",
  messagingSenderId: "623285496365",
  appId: "1:623285496365:web:0375434e18769fc44266a4",
  measurementId: "G-80C2RMXYGZ",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      console.log("device token: ", token);
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };
