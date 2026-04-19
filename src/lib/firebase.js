import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDjgf1jAuoWJ5GrjJBWb7yslo-Xrnjeoxc",
  authDomain: "munees-ed613.firebaseapp.com",
  projectId: "munees-ed613",
  storageBucket: "munees-ed613.firebasestorage.app",
  messagingSenderId: "61722437820",
  appId: "1:61722437820:web:539446792791d55b42c8b9",
  measurementId: "G-21VMXWF5N3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
