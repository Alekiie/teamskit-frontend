import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import MainApp from "./MainApp";
import { useAuth } from "./context/AuthContext";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        <Route
          path="/"
          element={user ? <MainApp /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/tasks"
          element={user ? <Tasks /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
