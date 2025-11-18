import React from "react";
import NavBar from "./components/NavBar";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./context/AuthContext";

const MainApp = () => {
  const {user} = useAuth()
  return (
    <>
      <NavBar />
      <Dashboard user={user} />
    </>
  );
};

export default MainApp;
