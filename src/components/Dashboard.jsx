import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useApi } from "../context/ActionContext";

export default function DashboardPage({ user }) {
  const [taskCount, setTaskCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [activity, setActivity] = useState([]);
  const { getTasks, getUsers } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
        setTaskCount(tasks.length);
        setUserCount(users.length);
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/tasks/recent/");
        setActivity(res.data);
      } catch (err) {
        console.log("Error fetching activity:", err);
      }
    };

    fetchActivity();
  }, []);
  const stats = [
    { label: "Active Users", value: userCount, icon: Users, route: "/users" },
    { label: "Tasks Today", value: taskCount, icon: Activity, route: "/tasks" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-800"
      >
        {`Welcome back ${user ? user.username : "User"}`}
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 w-full sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.route)}
              className="bg-white rounded-2xl shadow p-4 flex items-center 
                         space-x-4 cursor-pointer hover:shadow-md 
                         transition-shadow"
            >
              <div className="p-3 rounded-full bg-slate-100">
                <Icon className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="text-xl font-semibold text-slate-800">
                  {item.value}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Activity
        </h2>

        <div className="space-y-3">
          {activity.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent activity.</p>
          ) : (
            activity.map((task) => (
              <div key={task.id} className="flex justify-between border-b pb-2">
                <p className="text-slate-600">
                  <b>{task.title}</b> updated by{" "}
                  {task.creator?.username || "Unknown"}
                </p>

                <span className="text-slate-400 text-sm">
                  {new Date(task.last_updated_on).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
