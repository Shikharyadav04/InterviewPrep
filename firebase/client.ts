import { getAuth } from "firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSpJzfijw1B65NQcRg2dvoGiYNU8ZFMu0",
  authDomain: "interviewprep-306fc.firebaseapp.com",
  projectId: "interviewprep-306fc",
  storageBucket: "interviewprep-306fc.firebasestorage.app",
  messagingSenderId: "838083266103",
  appId: "1:838083266103:web:6292fea4cf2b6576e721b2",
  measurementId: "G-KB1BJ6JVP9",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
