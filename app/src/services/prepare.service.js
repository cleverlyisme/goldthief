import { doc, getDoc, updateDoc } from "firebase/firestore";
import _ from "lodash";

import { firestore } from "../configs/firebase.config";

export const prepareGameMap = async (user, game, map) => {
  const { id, activeGameId } = user;
  const { host, joiner, status } = game;

  if (host.id === id)
    await updateDoc(doc(firestore, "games", activeGameId), {
      host: { map, ...host },
      status: joiner?.map ? "in-progress" : status,
      turn: joiner?.map ? _.sample([host.id, joiner.id]) : null,
    });
  else
    await updateDoc(doc(firestore, "games", activeGameId), {
      joiner: { map, ...joiner },
      status: host?.map ? "in-progress" : status,
      turn: host?.map ? _.sample([host.id, joiner.id]) : null,
    });

  const gameSnap = await getDoc(doc(firestore, "games", activeGameId));
  const gameData = { id: activeGameId, ...gameSnap.data() };

  return gameData;
};

export const prepareGameTools = async () => {};
