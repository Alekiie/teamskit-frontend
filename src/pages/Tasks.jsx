import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PenIcon, Filter, X } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reassigningTask, setReassigningTask] = useState(null);
  const [newAssigneeId, setNewAssigneeId] = useState("");

  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const isAdmin = user?.role === "Admin";
  const isManager = user?.role === "Manager";
  const isMember = user?.role === "Member";

  const fetchTasks = async () => {
    try {
      const res = await api.get("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("users/");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const baseFilteredTasks = isMember
    ? tasks.filter((task) => task.assignee?.id === user?.id)
    : tasks;

  const filteredTasks = baseFilteredTasks.filter((task) => {
    const matchesAssignee =
      !assigneeFilter || task.assignee?.id?.toString() === assigneeFilter;
    const matchesStatus = !statusFilter || task.status === statusFilter;
    return matchesAssignee && matchesStatus;
  });

  const statusOptions = ["Todo", "In Progress", "Done"];

  const resetFilters = () => {
    setAssigneeFilter("");
    setStatusFilter("");
  };

  const hasActiveFilters = assigneeFilter || statusFilter;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: form.title,
        description: form.description,
        due_date: form.due_date,
        assignee_id: parseInt(form.assignee_id, 10),
        status: form.status,
      };

      if (isEditing) {
        await api.put(`tasks/${form.id}/`, payload);
      } else {
        await api.post("tasks/", payload);
        console.log(payload)
      }

      setShowForm(false);
      setForm(emptyForm);
      setIsEditing(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReassign = async (taskId) => {
    if (!newAssigneeId) {
      alert("Please select a team member to reassign to");
      return;
    }

    try {
      await api.post(`tasks/${taskId}/assign_task/`, {
        assignee_id: parseInt(newAssigneeId, 10),
      });

      setReassigningTask(null);
      setNewAssigneeId("");
      fetchTasks();
      alert("Task reassigned successfully!");
    } catch (err) {
      console.error("Error reassigning task:", err);
      alert("Failed to reassign task. Please try again.");
    }
  };

  const startReassign = (task) => {
    setReassigningTask(task.id);
    setNewAssigneeId(task.assignee?.id || "");
  };

  const cancelReassign = () => {
    setReassigningTask(null);
    setNewAssigneeId("");
  };

  const handleEdit = (task) => {
    if (isMember && task.assignee?.id !== user?.id) {
      alert("You can only edit tasks assigned to you.");
      return;
    }

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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const task = tasks.find((t) => t.id === taskId);

      if (isMember && task.assignee?.id !== user?.id) {
        alert("You can only update tasks assigned to you.");
        return;
      }

      const payload = {
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        assignee_id: task.assignee?.id,
        status: newStatus,
      };

      await api.put(`tasks/${taskId}/`, payload);
      fetchTasks();
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const teamMembers = users.filter(
    (u) => u.role !== "Admin" && u.role !== "Manager"
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Tasks</h1>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-[#d6cec9] rounded-lg hover:bg-[#faf8f7] cursor-pointer"
        >
          <Filter size={16} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-[#8c6f78] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>
      </div>

      {isMember && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-slate-800 text-sm">
            <strong>Member View:</strong> You can only view and update tasks
            assigned to you.
          </p>
        </div>
      )}

      {showFilters && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">
              Filter Tasks
            </h3>
            <div className="flex space-x-2">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-slate-600 hover:text-slate-800"
                >
                  <X size={14} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isAdmin || isManager) && (
              <div>
                <label className="text-sm text-slate-600 font-medium">
                  Assignee
                </label>
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="w-full p-3 rounded-lg border  mt-1"
                >
                  <option value="">All Assignees</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm text-slate-600 font-medium">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7] mt-1"
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2">
              {assigneeFilter && (
                <span className="inline-flex items-center px-3 py-1 ">
                  Assignee:{" "}
                  {
                    users.find((u) => u.id.toString() === assigneeFilter)
                      ?.username
                  }
                  <button
                    onClick={() => setAssigneeFilter("")}
                    className="ml-1 "
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter && (
                <span className="inline-flex items-center px-3 py-1 rounded-full ">
                  Status: {statusFilter}
                  <button
                    onClick={() => setStatusFilter("")}
                    className="ml-1 hover:text-green-600"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        {(isAdmin || isManager) && (
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
        )}

        <div className="text-sm text-slate-600">
          Showing {filteredTasks.length} of {baseFilteredTasks.length} tasks
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      {showForm && (isAdmin || isManager) && (
        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 cursor-pointer">
            {isEditing ? "Edit Task" : "Add Task"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label className="text-sm text-slate-600">Due Date</label>
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">Assign To</label>
              <select
                value={form.assignee_id}
                onChange={(e) =>
                  setForm({ ...form, assignee_id: e.target.value })
                }
                className="w-full p-3 rounded-lg border border-[#d6cec9] bg-[#faf8f7]"
              >
                <option value="">Select user</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>

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

      <div className="bg-white rounded-2xl shadow mt-4 overflow-hidden">
        <table className="w-full">
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
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-slate-500">
                  {hasActiveFilters
                    ? "No tasks match your filters."
                    : isMember
                    ? "No tasks assigned to you."
                    : "No tasks found."}
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="ml-2 text-[#8c6f78] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-t border-[#e0dcd8] hover:bg-gray-50"
                >
                  <td className="p-3">{task.id}</td>
                  <td className="p-3 font-medium">{task.title}</td>
                  <td className="p-3 max-w-md truncate">{task.description}</td>
                  <td className="p-3">{task.creator?.username || "—"}</td>

                  <td className="p-3">
                    {reassigningTask === task.id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={newAssigneeId}
                          onChange={(e) => setNewAssigneeId(e.target.value)}
                          className="p-2 border rounded text-sm"
                        >
                          <option value="">Select team member</option>
                          {teamMembers.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.username}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleReassign(task.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelReassign}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{task.assignee?.username || "—"}</span>
                        {(isAdmin || isManager) && (
                          <button
                            onClick={() => startReassign(task)}
                            className="px-2 py-1 bg-slate-400 text-white rounded text-sm hover:bg-slate-600 cursor-pointer"
                            title="Reassign task"
                          >
                            <PenIcon size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-3">
                    {isMember && task.assignee?.id === user?.id ? (
                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusUpdate(task.id, e.target.value)
                        }
                        className="p-1 border rouded text-sm capitalize "
                      >
                        <option value="Todo">Todo</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full `}
                      >
                        {task.status}
                      </span>
                    )}
                  </td>

                  <td className="p-3 space-x-2">
                    {(isAdmin ||
                      isManager ||
                      (isMember && task.assignee?.id === user?.id)) && (
                      <button
                        className="px-3 py-1 bg-[#8c6f78] text-white rounded-lg hover:bg-[#7a6068] cursor-pointer text-sm"
                        onClick={() => handleEdit(task)}
                      >
                        {isMember ? "View" : "Edit"}
                      </button>
                    )}

                    {(isAdmin || isManager) && (
                      <button
                        className="px-3 py-1 bg-[#d6cec9] rounded-lg hover:bg-[#c0b5b9] cursor-pointer text-sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
