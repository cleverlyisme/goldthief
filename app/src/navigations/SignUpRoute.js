import { Routes, Route, Navigate } from "react-router-dom";

import SignUp from "../pages/SignUp/SignUp";

const LoginRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LoginRoute;
