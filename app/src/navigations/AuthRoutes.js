import { Routes, Route } from "react-router-dom";

import SignInRoute from "./SignInRoute";
import SignUpRoute from "./SignUpRoute";
import GuideRoute from "./GuideRoute";
import Home from "../pages/Home/index";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/signup/*" element={<SignUpRoute />} />
      <Route path="/signin/*" element={<SignInRoute />} />
      <Route path="/guide" element={<GuideRoute />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AuthRoutes;
