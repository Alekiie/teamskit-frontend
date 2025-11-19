import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f5f2f0] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-semibold text-[#5a4a4f] mb-6">Profile</h1>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#6c5f63]">Username</label>
            <p className="text-lg">{user?.username}</p>
          </div>
          <div>
            <label className="text-sm text-[#6c5f63]">Email</label>
            <p className="text-lg">{user?.email}</p>
          </div>
          
          <div>
            <label className="text-sm text-[#6c5f63]">Role</label>
            <p className="text-lg capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;