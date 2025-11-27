import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MenuIcon, PersonStanding, XCircleIcon } from "lucide-react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <h2 className="text-2xl font-bold text-slate-900">TeamsKit</h2>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <a
              className="text-gray-700 hover:text-slate-400 font-medium cursor-pointer"
              onClick={() => navigate("/")}
            >
              Dashboard
            </a>

            {/* Admin only */}
            {role === "Admin" && (
              <a
                className="text-gray-700 hover:text-slate-400 font-medium cursor-pointer"
                onClick={() => navigate("/users")}
              >
                Users
              </a>
            )}

            {/* Admin + Manager */}
            {(role === "Admin" || role === "Manager") && (
              <a
                className="text-gray-700 hover:text-slate-400 font-medium cursor-pointer"
                onClick={() => navigate("/tasks")}
              >
                Tasks
              </a>
            )}
          </div>

          {/* User info and logout */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={handleProfileClick}
              >
                <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <PersonStanding />
                </div>
                <div className="text-left">
                  <p className="text-gray-700 text-sm font-medium group-hover:text-slate-600">
                    {user.username}
                  </p>
                  <p className="text-gray-500 text-xs group-hover:text-slate-500">
                    {role}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-white bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XCircleIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 shadow-md">
          {user && (
            <div
              className="flex items-center space-x-3 px-3 py-2 border-b cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={handleProfileClick}
            >
              <div className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                <PersonStanding />
              </div>
              <div>
                <p className="text-gray-700 font-medium">{user.username}</p>
                <p className="text-gray-500 text-sm">{role}</p>
              </div>
            </div>
          )}

          <a
            className="block px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md"
            onClick={() => {
              navigate("/");
              setMenuOpen(false);
            }}
          >
            Dashboard
          </a>

          {role === "Admin" && (
            <a
              className="block px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={() => {
                navigate("/users");
                setMenuOpen(false);
              }}
            >
              Users
            </a>
          )}

          {(role === "Admin" || role === "Manager") && (
            <a
              className="block px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={() => {
                navigate("/tasks");
                setMenuOpen(false);
              }}
            >
              Tasks
            </a>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-white bg-slate-600 rounded-md hover:bg-slate-700 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
