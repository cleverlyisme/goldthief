import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, firestore } from "../configs/firebase.config";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateProfile = (id, username, avatar) => {
    const docRef = doc(firestore, "users", id);

    updateDoc(docRef, {
      username,
      avatar,
    });
  };

  const signUp = async (email, password) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInAnonymous = async () => {
    await signInAnonymously(auth);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

        const newUser = { ...userDoc.data(), id: firebaseUser.uid };

        setUser(newUser);
      } else {
        setUser(null);
      }
      setIsInitialized(true);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  return {
    signUp,
    signIn,
    signInAnonymous,
    logOut,
    user,
    isInitialized,
    updateProfile,
  };
};

export default useAuth;
