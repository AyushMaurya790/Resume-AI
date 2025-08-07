import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
const db = getFirestore(app);
const storage = getStorage(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const linkedinProvider = new OAuthProvider('oidc.linkedin');

export { auth, db, storage, googleProvider, linkedinProvider };