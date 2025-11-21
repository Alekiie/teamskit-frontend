import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Activity, UserCheck, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useApi } from "../context/ActionContext";
import { useAuth } from "../context/AuthContext"; 

export default function DashboardPage() {
  const [taskCount, setTaskCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [myTaskCount, setMyTaskCount] = useState(0); 
  const [activity, setActivity] = useState([]);
  const { getTasks, getUsers } = useApi();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  // Check user roles
  const isAdmin = user?.role === "Admin";
  const isManager = user?.role === "Manager";
  const isMember = user?.role === "Member";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin || isManager) {
          const [tasks, users] = await Promise.all([getTasks(), getUsers()]);
          setTaskCount(tasks.length);
          setUserCount(users.length);
        } else if (isMember) {
          const tasks = await getTasks();
          const myTasks = tasks.filter(
            (task) => task.assignee?.id === user?.id
          );
          setMyTaskCount(myTasks.length);
          setTaskCount(tasks.length); 
        }
      } catch (error) {
        console.log("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [user, isAdmin, isManager, isMember]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("tasks/recent/");
        setActivity(res.data);
      } catch (err) {
        console.log("Error fetching activity:", err);
      }
    };

    fetchActivity();
  }, []);

  // Conditionally set stats by user role
  const getStats = () => {
    if (isAdmin || isManager) {
      return [
        {
          label: "Active Users",
          value: userCount,
          icon: Users,
          route: "/users",
          description: "Total registered users",
        },
        {
          label: "Total Tasks",
          value: taskCount,
          icon: Activity,
          route: "/tasks",
          description: "All tasks in the system",
        },
      ];
    } else if (isMember) {
      return [
        {
          label: "My Tasks",
          value: myTaskCount,
          icon: UserCheck,
          route: "/tasks",
          description: "Tasks assigned to me",
        },
        {
          label: "Task Status",
          value: `${myTaskCount} assigned`,
          icon: Activity,
          route: "/tasks",
          description: "Your current workload",
        },
      ];
    }
    return [];
  };

  const stats = getStats();

  return (
    <div className="p-6 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-slate-800"
      >
        {`Welcome back ${user ? user.username : "User"}`}
        {user?.role && (
          <span className="text-lg font-normal text-slate-600 ml-2">
            ({user.role})
          </span>
        )}
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
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
              className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md 
                         transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-800 mt-2">
                    {item.value}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
               
              </div>
            </motion.div>
          );
        })}
      </div>
      {isMember && myTaskCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 p-6"
        >
          <div className="flex items-start space-x-3">
          
            <div>
              <p className="text-red-700 mt-1">
                You don't have any tasks assigned yet. When a Teamskit staff assigns
                tasks to you, they will appear here.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Recent Activity
        </h2>

        <div className="space-y-3">
          {activity.length === 0 ? (
            <p className="text-slate-500 text-sm">No recent activity.</p>
          ) : (
            activity.map((task) => (
              <motion.div
                key={task.id}
                className="flex justify-between items-center border-b border-gray-100 pb-3 hover:bg-gray-50 px-2 rounded-lg"
                whileHover={{ x: 4 }}
              >
                <div className="flex-1">
                  <p className="text-slate-700">
                    <span className="font-semibold text-slate-800">
                      {task.title}
                    </span>
                    <span className="text-slate-500"> was updated</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                    <span>By: {task.creator?.username || "System"}</span>
                    <span>
                      Assignee: {task.assignee?.username || "Unassigned"}
                    </span>
                   
                  </div>
                </div>
                <span className="text-slate-400 text-sm whitespace-nowrap">
                  {new Date(task.last_updated_on).toLocaleDateString()} at{" "}
                  {new Date(task.last_updated_on).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
