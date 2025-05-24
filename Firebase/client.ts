
import { getApp, getApps, initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBunZ_bVzdqa3htESa0GqCzwCC4rxwS-dw",
  authDomain: "prepwise-87930.firebaseapp.com",
  projectId: "prepwise-87930",
  storageBucket: "prepwise-87930.firebasestorage.app",
  messagingSenderId: "224489743919",
  appId: "1:224489743919:web:560d1fa74fd89d917c88da",
  measurementId: "G-0NGHC88566"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);