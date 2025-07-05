"use client";
import "dotenv/config";
import {
  initializeApp as initClient,
  getApps as getClientApps,
  FirebaseApp,
} from "firebase/app";
import { getAuth as getClientAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FB_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FB_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FB_MEASURMENT_ID,
};

export const clientApp: FirebaseApp =
  getClientApps().length === 0
    ? initClient(firebaseConfig)
    : (getClientApps()[0] as FirebaseApp);

export const clientAuth = getClientAuth(clientApp);
