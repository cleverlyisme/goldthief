import { useEffect, useState } from "react";
import { defaultCoordinates, defaultTreasures } from "../utils/constants";
import { prepareGameMap } from "../services/prepare.service";

import useGame from "./useGame";
import useAuth from "./useAuth";

const usePrepare = () => {
  const { user } = useAuth();
  const { setGame } = useGame();

  const [coors, setCoors] = useState(defaultCoordinates);
  const [opponentCoors, setOpponentCoors] = useState(defaultCoordinates);
  const [treasures, setTreasures] = useState(defaultTreasures);
  const [opponentTreasures, setOpponentTreasures] = useState(defaultTreasures);

  const prepareMap = async (user, game, map) => {
    const gameData = await prepareGameMap(user, game, map);

    setTreasures(defaultTreasures);
    setGame(gameData);

    return gameData;
  };

  const reset = () => {
    setCoors(defaultCoordinates);
    setOpponentCoors(defaultCoordinates);
    setTreasures(defaultTreasures);
    setOpponentTreasures(defaultTreasures);
    setGame(null);
  };

  useEffect(() => {
    if (!user?.activeGameId) reset();
  }, [user]);

  return {
    coors,
    setCoors,
    opponentCoors,
    setOpponentCoors,
    treasures,
    setTreasures,
    opponentTreasures,
    setOpponentTreasures,
    prepareMap,
    reset,
  };
};

export default usePrepare;
