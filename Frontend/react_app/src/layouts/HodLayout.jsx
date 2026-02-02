import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const HodLayout = () => {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ================= ROLE PROTECTION =================

  useEffect(() => {
    if (!user || user.role !== "HOD") {
      navigate("/unauthorized");
    }
  }, [user]);

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition flex items-center gap-2 ${
      isActive
        ? "bg-blue-700 text-white font-medium border-l-4 border-white"
        : "hover:bg-gray-800 text-gray-200"
    }`;

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div
        className={`bg-gray-900 text-white p-5 flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >

        <div>

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-lg font-bold">
              {sidebarOpen ? "👔 HOD Panel" : "👔"}
            </h2>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-sm bg-gray-700 px-2 rounded"
            >
              ☰
            </button>

          </div>

          {/* USER INFO */}
          {user && sidebarOpen && (
            <div className="mb-6 pb-4 border-b border-gray-800">
              <p className="text-sm text-gray-400">Welcome</p>
              <p className="font-medium">{user.fullName}</p>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                HOD
              </span>
            </div>
          )}

          {/* NAVIGATION */}
          <nav className="space-y-2">

            <NavLink to="/hod/dashboard" className={linkStyle}>
              📊 {sidebarOpen && "Dashboard"}
            </NavLink>

            <NavLink to="/hod/manage-events" className={linkStyle}>
              📋 {sidebarOpen && "Manage Events"}
            </NavLink>

            <NavLink to="/hod/events/create" className={linkStyle}>
              ➕ {sidebarOpen && "Create Event"}
            </NavLink>

          </nav>

        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="bg-red-600 hover:bg-red-700 py-2 rounded text-white mt-6 font-medium transition"
        >
          🚪 {sidebarOpen && "Logout"}
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-50 min-h-screen">

        {/* TOP BAR */}
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

          <h2 className="font-semibold text-gray-700">
            HOD Dashboard Panel
          </h2>

          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
            {user?.fullName}
          </span>

        </div>

        <div className="p-6">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default HodLayout;
