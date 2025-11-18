import React, { useState, useEffect } from "react";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    try {
      if (stored) {
        const userObj = JSON.parse(stored);
        setRole(userObj.role || null);
      }
    } catch (err) {
      console.error("Invalid user JSON, clearing...");
      localStorage.removeItem("user");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <h2 className="text-2xl font-bold text-slate-900">TeamsKit</h2>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">

            {/* Everyone sees Dashboard */}
            <a className="text-gray-700 hover:text-green-400 font-medium" href="/">
              Dashboard
            </a>

            {/* Admin only */}
            {role === "admin" && (
              <a className="text-gray-700 hover:text-green-400 font-medium" href="/users">
                Users
              </a>
            )}

            {/* Admin + Manager */}
            {(role === "admin" || role === "manager") && (
              <a className="text-gray-700 hover:text-green-400 font-medium" href="/tasks">
                Tasks
              </a>
            )}

          </div>

          <button
            onClick={logout}
            className="hidden md:flex text-white bg-slate-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 shadow-md">

          <a href="/" className="block px-3 py-2">Dashboard</a>

          {role === "admin" && (
            <a href="/users" className="block px-3 py-2">Users</a>
          )}

          {(role === "admin" || role === "manager") && (
            <a href="/tasks" className="block px-3 py-2">Tasks</a>
          )}

          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-white bg-slate-600 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
