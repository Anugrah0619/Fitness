// firebaseClient.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNOLjrZz5pmjCOLxl4pcgweJM0mPGcFq4",
  authDomain: "sem6-proj.firebaseapp.com",
  databaseURL: "https://sem6-proj-default-rtdb.firebaseio.com",
  projectId: "sem6-proj",
  storageBucket: "sem6-proj.appspot.com", // Updated bucket format
  messagingSenderId: "1092171898004",
  appId: "1:1092171898004:web:e9dd10b05961a406746881"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app)
const db = getFirestore(app)
/*const storage = getStorage(app)*/
const rtdb = getDatabase(app)

export { auth, db, /*storage*/ rtdb }