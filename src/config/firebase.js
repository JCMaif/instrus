import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDG9Itw8PXI3YYuESPJCRInLhnIdMcu7-Q",
  authDomain: "instrus-d1d04.firebaseapp.com",
  projectId: "instrus-d1d04",
  storageBucket: "instrus-d1d04.firebasestorage.app",
  messagingSenderId: "897499351518",
  appId: "1:897499351518:web:acf0839627546ad41df54f",
  measurementId: "G-4863MKN00E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);