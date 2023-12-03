import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import _ from "lodash";

import { firestore } from "../configs/firebase.config";
import { defaultGameTime, defaultTurnTime } from "../utils/constants";

export const prepareGameMap = async (user, game, map) => {
  const { id } = user;
  const { host, joiner, status } = game;

  if (host.id === id)
    await updateDoc(doc(firestore, "games", game.id), {
      host: { map, ...host },
      status: joiner?.map ? "in-progress" : status,
      turn: joiner?.map ? _.sample([host.id, joiner.id]) : null,
      countdownTimeTurn: joiner?.map
        ? { seconds: defaultTurnTime, start: serverTimestamp() }
        : null,
      countdownTimeGame: joiner?.map
        ? { seconds: defaultGameTime, start: serverTimestamp() }
        : null,
    });
  else
    await updateDoc(doc(firestore, "games", game.id), {
      joiner: { map, ...joiner },
      status: host?.map ? "in-progress" : status,
      turn: host?.map ? _.sample([host.id, joiner.id]) : null,
      countdownTimeTurn: host?.map
        ? { seconds: defaultTurnTime, start: serverTimestamp() }
        : null,
      countdownTimeGame: host?.map
        ? { seconds: defaultGameTime, start: serverTimestamp() }
        : null,
    });

  const gameSnap = await getDoc(doc(firestore, "games", game.id));
  const gameData = { id: game.id, ...gameSnap.data() };

  return gameData;
};

export const cancel = async (game) => {
  const { id, host, joiner } = game;

  await deleteDoc(doc(firestore, "games", id));

  await updateDoc(doc(firestore, "users", host.id), {
    activeGameId: null,
  });

  await updateDoc(doc(firestore, "users", joiner.id), {
    activeGameId: null,
  });
};

export const prepareGameTools = async () => {};
