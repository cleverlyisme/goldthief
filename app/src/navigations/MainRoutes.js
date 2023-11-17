import { Routes, Route, Navigate } from "react-router-dom";

import HomeRoute from "./HomeRoute";
import GameRoute from "./GameRoute";
import ProfileRoute from "./ProfileRoute";
import Create from "../pages/Waiting/Create";
import Join from "../pages/Waiting/Join";
import Waiting from "../pages/Waiting/Waiting";
import GuideRoute from "./GuideRoute";
import PrepareRoute from "./PrepareRoute";
import useAppContext from "../hooks/useAppContext";

const MainRoutes = () => {
  const {
    authState: { user },
    gameState: { game, isInitializedGame },
  } = useAppContext();

  if (!isInitializedGame) return null;

  return game?.status === "waiting" ? (
    <Routes>
      <Route path="/waiting/*" element={<Waiting />} />
      <Route path="*" element={<Navigate to={`/waiting/${game?.id}`} />} />
    </Routes>
  ) : game?.status === "preparing" ? (
    <Routes>
      <Route
        path="/preparing/*"
        element={<PrepareRoute user={user} game={game} />}
      />
      <Route path="*" element={<Navigate to={`/preparing/${game?.id}`} />} />
    </Routes>
  ) : game?.status === "in-progress" ? (
    <Routes>
      <Route path="/game/*" element={<GameRoute />} />
      <Route path="*" element={<Navigate to={`/game/${game?.id}`} />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/profile/*" element={<ProfileRoute />} />
      <Route path="/create" element={<Create />} />
      <Route path="/join" element={<Join />} />
      <Route path="/guide" element={<GuideRoute />} />
      <Route path="*" element={<HomeRoute />} />
    </Routes>
  );
};

export default MainRoutes;
