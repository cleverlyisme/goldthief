import { Routes, Route } from "react-router-dom";

import Tools from "../pages/Prepare/Tools";
import Treasures from "../pages/Prepare/Treasures";
import BeforeStart from "../pages/Prepare/BeforeStart";

const PrepareRoute = ({ prepare }) => {
  return (
    <Routes>
      <Route
        path="/:id"
        element={
          prepare.tools ? (
            <BeforeStart />
          ) : prepare.map ? (
            <Tools />
          ) : (
            <Treasures />
          )
        }
      />
    </Routes>
  );
};

export default PrepareRoute;
