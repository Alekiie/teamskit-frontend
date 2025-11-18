import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    id: null,
    title: "",
    description: "",
    due_date: "",
    assignee_id: "",
    status: "Todo",
  };

  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  //GET TASKS & USERS
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // CREATE / UPDATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        due_date: form.due_date,
        assignee_id: parseInt(form.assignee, 10),
        status: form.status,
      };

      if (isEditing) {
        await api.put(`/tasks/${form.id}/`, payload);
      } else {
        await api.post("/tasks/", payload);
      }

      setShowForm(false);
      setForm(emptyForm);
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  //EDIT
  const handleEdit = (task) => {
    setForm({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date || "",
      assignee_id: task.assignee?.id || "",
      status: task.status,
    });

    setIsEditing(true);
    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>

      <button
        className="px-4 py-2 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068] cursor-pointer"
        onClick={() => {
          setShowForm(true);
          setIsEditing(false);
          setForm(emptyForm);
        }}
      >
        Add Task
      </button>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            {isEditing ? "Edit Task" : "Add Task"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TITLE */}
            <div>
              <label className="text-sm text-slate-600">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-sm text-slate-600">Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label className="text-sm text-slate-600">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              />
            </div>

            {/* ASSIGNEE */}
            <div>
              <label className="text-sm text-slate-600">Assign To</label>
              <select
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="text-sm text-slate-600">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Completed</option>
              </select>
            </div>

            {/* FORM BUTTONS */}
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068] cursor-pointer"
              >
                {isEditing ? "Update Task" : "Create Task"}
              </button>

              <button
                type="button"
                className="px-4 py-2 bg-[#d6cec9] rounded-lg hover:bg-[#c0b5b9]"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TASK TABLE */}
      <table className="w-full bg-white rounded-2xl shadow mt-4">
        <thead className="bg-[#faf8f7] text-slate-700">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Description</th>
            <th className="p-3 text-left">Creator</th>
            <th className="p-3 text-left">Assignee</th>
            <th className="p-3 text-left">Due Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-3 text-center text-slate-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="border-t border-[#e0dcd8]">
                <td className="p-3">{task.id}</td>
                <td className="p-3">{task.title}</td>
                <td className="p-3">{task.description}</td>
                <td className="p-3">{task.creator?.username || "—"}</td>
                <td className="p-3">{task.assignee?.username || "—"}</td>
                <td className="p-3">{task.due_date || "—"}</td>
                <td className="p-3 capitalize">{task.status}</td>

                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068] cursor-pointer"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="px-3 py-1 bg-[#d6cec9] rounded-lg hover:bg-[#c0b5b9] cursor-pointer"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tasks;
