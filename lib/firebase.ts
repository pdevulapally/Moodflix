import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAAmi6ovITMP8HtNQFLTHhVYSGkUwh0Jzw",
  authDomain: "moodflix-682e5.firebaseapp.com",
  projectId: "moodflix-682e5",
  storageBucket: "moodflix-682e5.appspot.com", // Ensure this matches your Firebase storage bucket
  messagingSenderId: "593455524793",
  appId: "1:593455524793:web:d11a968c4328256db32468",
  measurementId: "G-NKP0TQRKZG",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
const auth = getAuth(app)

// Initialize Firestore
const db = getFirestore(app)

export { auth, db }
