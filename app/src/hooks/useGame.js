import { useEffect, useState } from "react";

import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { firestore } from "../configs/firebase.config";
import { cancel } from "../services/prepare.service";
import {
  create,
  join,
  play,
  setTurn,
  setWinner,
  setDraw,
} from "../services/game.service";
import useAuth from "./useAuth";

const useGame = () => {
  const { user } = useAuth();

  const [game, setGame] = useState(null);
  const [opponent, setOpponent] = useState(null);
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

  const cancelGame = async () => {
    await cancel(game);
  };

  const chooseCoordinate = async (user, game, coordinate) => {
    const gameData = await play(user, game, coordinate);

    setGame(gameData);
  };

  const setUserTurn = async (userId, game) => {
    await setTurn(userId, game);
  };

  const setWinnerGame = async (winner, loser, game) => {
    await setWinner(winner, loser, game);

    setGame(null);
  };

  const setDrawGame = async (userData, opponentData, game) => {
    await setDraw(userData, opponentData, game);

    setGame(null);
  };

  const setOpponentData = async () => {
    if (game?.host && game?.joiner) {
      const opponentId =
        game.host.id === user.id ? game.joiner.id : game.host.id;
      const opponentDoc = await getDoc(doc(firestore, "users", opponentId));

      setOpponent({ id: opponentId, ...opponentDoc.data() });
    }
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
        }

        setIsInitializedGame(true);
      };

      checkInGame();
    }
  }, [user]);

  useEffect(() => {
    if (game) {
      const unsub = onSnapshot(
        doc(firestore, "games", game.id),
        async (doc) => {
          try {
            const gameData = doc.data();

            setGame({ id: game.id, ...gameData });
          } catch (err) {
            throw new Error(err);
          }
        }
      );

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
    cancelGame,
    chooseCoordinate,
    setUserTurn,
    setWinnerGame,
    setDrawGame,
    opponent,
    setOpponentData,
  };
};

export default useGame;
