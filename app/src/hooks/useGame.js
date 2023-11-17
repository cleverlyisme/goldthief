import { useEffect, useState } from "react";

import { create, join } from "../services/game.service";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../configs/firebase.config";
import useAuth from "./useAuth";

const useGame = () => {
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [isInitializedGame, setIsInitializedGame] = useState(false);

  const createGame = async (user, password) => {
    const gameCreated = await create(user, password);

    setGame(gameCreated);

    return gameCreated;
  };

  const joinGame = async (user, code, password) => {
    const gameJoined = await join(user, code, password);

    setGame(gameJoined);

    return gameJoined;
  };

  useEffect(() => {
    if (user) {
      const checkInGame = async () => {
        if (user.activeGameId) {
          const gameDoc = await getDoc(
            doc(firestore, "games", user.activeGameId)
          );

          const newGame = { ...gameDoc.data(), id: user.activeGameId };

          setGame(newGame);
        } else setGame(null);

        setIsInitializedGame(true);
      };

      checkInGame();
    }
  }, [user]);

  useEffect(() => {
    if (game) {
      const unsub = onSnapshot(doc(firestore, "games", game.id), (doc) => {
        try {
          const gameData = doc.data();

          setGame({ id: game.id, ...gameData });
        } catch (err) {
          throw new Error(err);
        }
      });

      return () => unsub && unsub();
    }
  }, [game]);

  return {
    game,
    setGame,
    isInitializedGame,
    setIsInitializedGame,
    createGame,
    joinGame,
  };
};

export default useGame;
