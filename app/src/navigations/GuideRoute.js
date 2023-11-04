import { Routes, Route, Navigate } from "react-router-dom";

import Guide from "../pages/Guide/Guide";

const LoginRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Guide />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default LoginRoute;
