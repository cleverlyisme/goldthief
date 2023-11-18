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

  await updateDoc(doc(firestore, "games", activeGameId), {
    joiner: { id, username, missingTurnCount: 0 },
    status: "preparing",
  });

  const gameSnap = await getDoc(doc(firestore, "games", activeGameId));
  const game = { id: activeGameId, ...gameSnap.data() };

  await updateDoc(doc(firestore, "users", id), {
    activeGameId,
  });

  return game;
};

export const play = async (user, game, coordinate) => {
  const { id, activeGameId } = user;
  const { host, joiner } = game;
  const steps = game.steps || [];

  if (steps.find((step) => step.coordinates.includes(coordinate)))
    throw new Error("You already check this coordinate");

  await updateDoc(doc(firestore, "games", activeGameId), {
    steps: [...steps, { userId: id, coordinates: [coordinate] }],
    turn: host.id === id ? joiner.id : host.id,
  });

  const gameSnap = await getDoc(doc(firestore, "games", activeGameId));
  const gameData = { id: activeGameId, ...gameSnap.data() };

  return gameData;
};

export const setCurrentPlayerWin = async (user, game) => {
  const { id, activeGameId, win } = user;

  await updateDoc(doc(firestore, "games", activeGameId), {
    status: "done",
    winner: id,
  });

  await updateDoc(doc(firestore, "users", id), {
    activeGameId: null,
    win: win + 1,
  });
};
