import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (username, password) => {
    const res = await api.post("/auth/login/", { username, password });

    if (!res.data) throw new Error("Invalid response from server");

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user); 
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null)
  };
useEffect(() => {
  const handleForceLogout = () => {
    logout();
  };

  window.addEventListener("force-logout", handleForceLogout);

  return () => {
    window.removeEventListener("force-logout", handleForceLogout);
  };
}, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
