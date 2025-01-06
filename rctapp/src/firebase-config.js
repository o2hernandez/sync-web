// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZSMVN_LjZznb7-GSKfiztTfGRoWyqPtY",
  authDomain: "sync-5f0db.firebaseapp.com",
  projectId: "sync-5f0db",
  storageBucket: "sync-5f0db.firebasestorage.app",
  messagingSenderId: "161595213937",
  appId: "1:161595213937:web:5ba7f91e8bca1cf249b3d0",
  measurementId: "G-BSV4JRBP62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);