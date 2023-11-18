import { useEffect, useState } from "react";

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../configs/firebase.config";
import {
  create,
  join,
  play,
  setCurrentPlayerWin,
} from "../services/game.service";
import useAuth from "./useAuth";
import useNoti from "./useNoti";

const useGame = () => {
  const { user } = useAuth();
  const { setNoti } = useNoti();

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

  const chooseCoordinate = async (user, game, coordinate) => {
    const gameData = await play(user, game, coordinate);

    setGame(gameData);
  };

  const setCurrentWin = async (user, game) => {
    await setCurrentPlayerWin(user, game);
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

          if (gameData.status === "done") {
            if (user.id === gameData.winner) setNoti({ variant: "win" });
            else setNoti({ variant: "lose" });

            setGame(null);
          } else setGame({ id: game.id, ...gameData });
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
    chooseCoordinate,
    setCurrentWin,
  };
};

export default useGame;
