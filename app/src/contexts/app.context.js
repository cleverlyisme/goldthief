import { createContext } from "react";

import Loading from "../components/Loading";
import useLoading from "../hooks/useLoading";
import useAuth from "../hooks/useAuth";
import useGame from "../hooks/useGame";
import useStorage from "../hooks/useStorage";
import usePrepare from "../hooks/usePrepare";
import useNoti from "../hooks/useNoti";
import Noti from "../components/Noti";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const loadingState = useLoading();
  const authState = useAuth();
  const gameState = useGame();
  const prepareState = usePrepare();
  const storageState = useStorage();
  const notiState = useNoti();

  return (
    <AppContext.Provider
      value={{
        authState,
        loadingState,
        gameState,
        storageState,
        prepareState,
        notiState,
      }}
    >
      {children}
      <Loading isLoading={loadingState.isLoading} />
      <Noti
        noti={notiState.noti}
        setNoti={notiState.setNoti}
        setGame={gameState.setGame}
      />
    </AppContext.Provider>
  );
};
