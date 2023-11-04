import { Routes, Route, Navigate } from "react-router-dom";

import SignIn from "../pages/SignIn/SignIn";

const SignInRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default SignInRoute;
