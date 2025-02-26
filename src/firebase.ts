import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyADnNUCIY2tWNTvfPnDhYVVV4JPcsDbCm0",
  authDomain: "swiftqweb.firebaseapp.com",
  projectId: "swiftqweb",
  storageBucket: "swiftqweb.firebasestorage.app",
  messagingSenderId: "656723973728",
  appId: "1:656723973728:web:23efc5a7edb142d34fd505"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase()

