import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "../configs/firebase.config";
import {
  defaultPrepareMapTime,
  defaultTurnTime,
  nanoid,
} from "../utils/constants";

export const create = async (user, password) => {
  const { id, username } = user;

  if (user?.activeGameId) throw new Error("User already in a game");

  const newGame = {
    code: nanoid().toLowerCase(),
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

  console.log({ codeHost: game.code });

  await updateDoc(doc(firestore, "users", id), {
    activeGameId: game.id,
  });

  return game;
};

export const join = async (user, code, password) => {
  const { id, username } = user;

  if (user?.activeGameId) throw new Error("User already in a game");

  if (!code.trim()) throw new Error("Invalid room code");

  console.log({ code: code.toLowerCase() });

  const gameQuery = query(
    collection(firestore, "games"),
    where("code", "==", code.toLowerCase())
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
    prepareMapTime: {
      seconds: defaultPrepareMapTime,
      start: serverTimestamp(),
    },
  });

  const gameSnap = await getDoc(doc(firestore, "games", gameDoc.id));
  const game = { id: gameDoc.id, ...gameSnap.data() };

  await updateDoc(doc(firestore, "users", id), {
    activeGameId: gameDoc.id,
  });

  return game;
};

export const play = async (user, game, coordinate) => {
  const { id } = user;
  const { host, joiner } = game;
  const steps = game.steps || [];

  if (
    steps.find(
      (step) => step.coordinates.includes(coordinate) && step.userId === user.id
    )
  )
    throw new Error("You already check this coordinate");

  await updateDoc(doc(firestore, "games", game.id), {
    steps: [...steps, { userId: id, coordinates: [coordinate] }],
    turn: host.id === id ? joiner.id : host.id,
    countdownTimeTurn: {
      seconds: defaultTurnTime,
      start: serverTimestamp(),
    },
  });

  const gameSnap = await getDoc(doc(firestore, "games", game.id));
  const gameData = { id: game.id, ...gameSnap.data() };

  return gameData;
};

export const setTurn = async (userId, game) => {
  const missingHost =
    game.host.id === userId
      ? game.host.missingTurnCount
      : parseInt(game.host.missingTurnCount) + 1;
  const missingJoiner =
    game.joiner.id === userId
      ? game.joiner.missingTurnCount
      : parseInt(game.joiner.missingTurnCount) + 1;

  const host = { ...game.host, missingTurnCount: missingHost };
  const joiner = { ...game.joiner, missingTurnCount: missingJoiner };

  await updateDoc(doc(firestore, "games", game.id), {
    host,
    joiner,
    turn: userId,
    countdownTimeTurn: {
      seconds: defaultTurnTime,
      start: serverTimestamp(),
    },
  });
};

export const setWinner = async (winner, loser, game) => {
  const { id } = game;

  await updateDoc(doc(firestore, "games", id), {
    status: "done",
    winner: winner.id,
  });

  await updateDoc(doc(firestore, "users", winner.id), {
    activeGameId: null,
    win: winner.win + 1,
    lose: winner.lose,
  });

  await updateDoc(doc(firestore, "users", loser.id), {
    activeGameId: null,
    win: loser.win,
    lose: loser.lose + 1,
  });
};

export const setDraw = async (user, opponent, game) => {
  await updateDoc(doc(firestore, "games", game.id), {
    status: "done",
    winner: null,
  });

  await updateDoc(doc(firestore, "users", user.id), {
    activeGameId: null,
    draw: user.draw + 1,
  });

  await updateDoc(doc(firestore, "users", opponent.id), {
    activeGameId: null,
    draw: opponent.draw + 1,
  });
};

export const clear = async (userId) => {
  await updateDoc(doc(firestore, "users", userId), {
    activeGameId: null,
  });
};
