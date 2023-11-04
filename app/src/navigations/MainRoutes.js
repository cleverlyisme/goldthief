import React from "react";
import useAppContext from "../hooks/useAppContext";

const MainRoutes = () => {
  const {
    authState: { logOut },
  } = useAppContext();

  return <div onClick={async () => logOut()}>MainRoutes</div>;
};

export default MainRoutes;
