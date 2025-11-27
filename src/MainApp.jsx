import React from "react";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/AuthContext";

const MainApp = () => {
  const {user} = useAuth()
  return (
    <>
      <Dashboard user={user} />
    </>
  );
};

export default MainApp;
