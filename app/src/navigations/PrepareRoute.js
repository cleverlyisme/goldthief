import { Routes, Route } from "react-router-dom";

// import Tools from "../pages/Prepare/Tools";
import Treasures from "../pages/Prepare/Treasures";
import BeforeStart from "../pages/Prepare/BeforeStart";

const PrepareRoute = ({ user, game }) => {
  const prepare = user.id === game.host.id ? game.host : game.joiner;

  return (
    <Routes>
      <Route
        path="/:id"
        element={prepare.map ? <BeforeStart /> : <Treasures />}
      />
    </Routes>
  );
};

export default PrepareRoute;
