import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

import { auth, firestore } from "../configs/firebase.config";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const updateAvatarProfile = async (id, avatar) => {
    await updateDoc(doc(firestore, "users", id), {
      avatar,
    });

    setUser({ ...user, avatar });
  };

  const updateUsernameProfile = async (id, username) => {
    await updateDoc(doc(firestore, "users", id), {
      username,
    });

    setUser({ ...user, username });
  };

  const signUp = async (email, password) => {
    const userCreated = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await setDoc(doc(firestore, "users", userCreated.user.uid), {
      username: faker.person.fullName(),
      avatar: faker.image.avatar(),
      win: 0,
      lose: 0,
      draw: 0,
    });
  };

  const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInAnonymous = async () => {
    const userCreated = await signInAnonymously(auth);

    await setDoc(doc(firestore, "users", userCreated.user.uid), {
      username: faker.person.fullName(),
      avatar: faker.image.avatar(),
      win: 0,
      lose: 0,
      draw: 0,
    });
  };

  const logOut = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(
        doc(firestore, "users", user.id),
        async (doc) => {
          try {
            const userData = doc.data();

            setUser({ id: user.id, ...userData });
          } catch (err) {
            throw new Error(err);
          }
        }
      );

      return () => unsub && unsub();
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(firestore, "users", firebaseUser.uid));

        const newUser = { ...userDoc.data(), id: firebaseUser.uid };

        setUser(newUser);
      } else setUser(null);
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
    updateAvatarProfile,
    updateUsernameProfile,
  };
};

export default useAuth;
