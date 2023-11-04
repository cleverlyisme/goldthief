import { Routes, Route, Navigate } from "react-router-dom";

import Game from "../pages/Game/Game";

const GameRoute = () => {
  return (
    <Routes>
      <Route path="/:id" element={<Game />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default GameRoute;
