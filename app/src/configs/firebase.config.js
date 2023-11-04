import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

import environments from "../utils/environments";

const firebaseConfig = {
  apiKey: environments.FIREBASE_API,
  authDomain: environments.FIREBASE_AUTH_DOMAIN,
  projectId: environments.FIREBASE_PROJECT_ID,
  storageBucket: environments.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environments.FIREBASE_MESSAGING_SENDER_ID,
  appId: environments.FIREBASE_APP_ID,
  measurementId: environments.FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);

export const functions = getFunctions(app);

export const storage = getStorage(app);

export const auth = getAuth(app);
