import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPn2QyQ5DnMx1U-C7KwNTFiOtcJEIYGDk",
  authDomain: "resume-ai-a2edc.firebaseapp.com",
  projectId: "resume-ai-a2edc",
  storageBucket: "resume-ai-a2edc.firebasestorage.app",
  messagingSenderId: "586252933726",
  appId: "1:586252933726:web:27f7f55621a4be6b9cb2cf",
  measurementId: "G-JEGZS2F39K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
