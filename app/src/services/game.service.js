import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { nanoid } from "nanoid";

import { firestore } from "../configs/firebase.config";

export const create = async (user, password) => {
  const { id, username, activeGameId } = user;

  const newGame = {
    code: nanoid(6).toLowerCase(),
    password: password.trim() || "",
    status: "waiting",
    host: {
      id,
      username,
      missingTurnCount: 0,
    },
    createdAt: Date.now(),
  };

  const gameRef = await addDoc(collection(firestore, "games"), newGame);
  const gameSnap = await getDoc(doc(firestore, "games", gameRef.id));
  const game = { id: gameRef.id, ...gameSnap.data() };

  await updateDoc(doc(firestore, "users", id), {
    activeGameId: game.id,
  });

  return game;
};

export const join = async (user, code, password) => {
  const { id, username, activeGameId } = user;

  if (!code.trim()) throw new Error("Invalid room code");

  const gameQuery = query(
    collection(firestore, "games"),
    where("code", "==", code)
  );
  const gameSnaps = await getDocs(gameQuery);

  if (gameSnaps.empty) throw new Error("No matching game found");

  const gameDoc = gameSnaps.docs[0];

  const gameData = gameDoc.data();

  if (gameData.joiner) throw new Error("Game is already begin");

  if (gameData.password !== password.toLowerCase())
    throw new Error("Invalid room password");

  await updateDoc(doc(firestore, "games", gameDoc.id), {
    joiner: { id, username, missingTurnCount: 0 },
    status: "preparing",
  });

  const gameSnap = await getDoc(doc(firestore, "games", gameDoc.id));
  const game = { id: gameDoc.id, ...gameSnap.data() };

  await updateDoc(doc(firestore, "users", id), {
    activeGameId: gameDoc.id,
  });

  return game;
};
