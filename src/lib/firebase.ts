import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWQLXJNZhnPeLymSrZDwpqmVmQiaWfmpU",
  authDomain: "portifolio-shdiv190.firebaseapp.com",
  projectId: "portifolio-shdiv190",
  storageBucket: "portifolio-shdiv190.firebasestorage.app",
  messagingSenderId: "379007402466",
  appId: "1:379007402466:web:406e7e9121349659d3f9bb",
  measurementId: "G-TWD41E57GH"
};

// Initialize Firebase (Safeguard for Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
