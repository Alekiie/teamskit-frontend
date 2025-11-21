import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  const emptyForm = {
    id: null,
    username: "",
    email: "",
    role: "Member",
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Check if current user is Admin (only Admin can manage users)
  const isAdmin = currentUser?.role === "Admin";
  const isManager = currentUser?.role === "Manager";

  /** Fetch all users **/
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create / Update User
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: form.username,
        email: form.email,
        role: form.role,
        is_active: form.is_active,
      };

      if (isEditing) {
        await api.put(`users/${form.id}/`, payload);
      } else {
        await api.post(`users/`, payload);
      }

      setForm(emptyForm);
      setIsEditing(false);
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    });

    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`users/${id}/`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Users</h1>

      {isAdmin && (
        <button
          className="px-4 py-2 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068]"
          onClick={() => {
            setForm(emptyForm);
            setIsEditing(false);
            setShowForm(true);
          }}
        >
          Add User
        </button>
      )}

      {isManager && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>Manager View:</strong> You can view users to assign tasks,
            but user management is restricted to Administrators.
          </p>
        </div>
      )}

      {showForm && isAdmin && (
        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {isEditing ? "Edit User" : "Add User"}
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-slate-600">Username</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
                value={form.username}
                required
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Role</label>
              <select
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Member">Member</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <label className="text-sm text-slate-600">Active</label>
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068]"
              >
                {isEditing ? "Update User" : "Create User"}
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-[#d6cec9] rounded-lg hover:bg-[#c0b5b9]"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(false);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="w-full bg-white rounded-2xl shadow mt-4">
        <thead className="bg-[#faf8f7] text-slate-700">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Active</th>
            {isAdmin && <th className="p-3 text-left">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td className="p-3 text-center" colSpan={isAdmin ? 6 : 5}>
                Loading...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td
                className="p-3 text-center text-slate-500"
                colSpan={isAdmin ? 6 : 5}
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-t border-[#e0dcd8]">
                <td className="p-3">{u.id}</td>
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.is_active ? "Yes" : "No"}</td>

                {isAdmin && (
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="px-3 py-1 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-3 py-1 bg-[#d6cec9] rounded-lg hover:bg-[#c0b5b9]"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
