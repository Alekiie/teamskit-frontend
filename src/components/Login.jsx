import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to login.");
    }

    setLoading(false);
  };

  const submitOnEnter = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f2f0] px-4">
      <div className="flex flex-col gap-4 border border-[#e0dcd8] rounded-2xl p-10 bg-white shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-center font-semibold text-[#5a4a4f]">
          Login
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <label className="text-sm text-[#6c5f63]">Username</label>
        <input
          type="text"
          value={username}
          onKeyDown={submitOnEnter}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-lg border border-[#d6cec9] focus:outline-none focus:ring-2 focus:ring-[#bba4ad] bg-[#faf8f7]"
          placeholder="Enter your username"
        />

        <label className="text-sm text-[#6c5f63] mt-2">Password</label>
        <input
          type="password"
          value={password}
          onKeyDown={submitOnEnter}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg border border-[#d6cec9] focus:outline-none focus:ring-2 focus:ring-[#bba4ad] bg-[#faf8f7]"
          placeholder="••••••••"
        />

        <button
          className={`mt-4 w-full p-3 rounded-lg bg-[#8c6f78] text-white font-medium transition-all hover:cursor-pointer 
            ${
              loading ? "opacity-60 pointer-events-none" : "hover:bg-[#7a6068]"
            }`}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;
