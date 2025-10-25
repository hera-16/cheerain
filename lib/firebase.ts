import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Only initialize auth on the client. Calling getAuth() on a server-initialized
// Firebase app can create a FirebaseServerApp which does not support client
// auth operations like signInWithEmailAndPassword and can lead to
// auth/invalid-credential or similar errors during runtime.
let auth: ReturnType<typeof getAuth> | null = null;
if (typeof window !== 'undefined') {
  try {
    auth = getAuth(app);
  } catch (e) {
    // If initialization fails for any reason, keep auth null and log for debug
    // The consuming client code should only call auth methods when running in browser.
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase Auth on client:', e);
    auth = null;
  }
}

const db = getFirestore(app);
const storage = getStorage(app);
let functions: ReturnType<typeof getFunctions> | null = null;
// Initialize Functions client with explicit region to ensure correct endpoint
// (deployed functions in this project use us-central1)
if (typeof window !== 'undefined') {
  try {
    functions = getFunctions(app, 'us-central1');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Firebase Functions on client:', e);
    functions = null;
  }
}

export { app, auth, db, storage, functions };
