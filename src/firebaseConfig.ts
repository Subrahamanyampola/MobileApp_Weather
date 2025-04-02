import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiAirOti06SnkCIhgi0klkcl9Pxvbk-50",
  authDomain: "weatherapp-6e8f9.firebaseapp.com",
  projectId: "weatherapp-6e8f9",
  storageBucket: "weatherapp-6e8f9.appspot.com",
  messagingSenderId: "817459642565",
  appId: "1:817459642565:web:2e9d0d9f55294ff542b0ac",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); // ✅ Firestore export
