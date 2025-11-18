import React from "react";

const AdminPanel = () => {
  return (
    <div className="m-16 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-semibold text-gray-800">Admin Panel</h2>
      <p className="mt-2 text-gray-600">Only Admins can see this page.</p>
    </div>
  );
};

export default AdminPanel;
