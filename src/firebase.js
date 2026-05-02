import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAefuPBxzMZhviJ2Sfht9_rysSx41hiztk",
  authDomain: "xdyu-ef963.firebaseapp.com",
  projectId: "xdyu-ef963",
  storageBucket: "xdyu-ef963.firebasestorage.app",
  messagingSenderId: "732156706206",
  appId: "1:732156706206:web:5dce2189999791b9016a8f",
  measurementId: "G-YY72YXY5E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Set persistence
import { setPersistence, browserLocalPersistence } from "firebase/auth";
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

export default app;