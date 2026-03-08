import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import {
  FaCalendarAlt,
  FaPlus,
  FaTrophy,
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaClipboardList,
  FaChartBar
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const HODLayout = () => {

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= ROLE PROTECTION ================= */

  useEffect(() => {

    if (!loading && (!user || user.role !== "HOD")) {
      navigate("/unauthorized");
    }

  }, [user, loading, navigate]);

  /* ================= CLOSE SIDEBAR ON ROUTE CHANGE ================= */

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      logout();
      navigate("/");
    }, 500);

  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
    ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (

    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed lg:static z-40 top-0 left-0
        h-screen w-64 bg-slate-900 text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 flex flex-col`}
      >

        {/* HEADER */}

        <div className="p-4 border-b border-slate-700 flex justify-between items-center">

          <h2 className="font-bold text-lg">🎓 HOD Panel</h2>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>

        </div>

        {/* MENU */}

        <div className="flex-1 p-4 space-y-6 overflow-y-auto hide-scrollbar">

          {/* USER INFO */}

          <div>

            <p className="text-gray-400 text-sm">Welcome</p>

            <p className="font-semibold text-lg truncate">
              {user?.fullName}
            </p>

            <span className="inline-block mt-2 bg-blue-600 text-sm px-3 py-1 rounded">
              HOD
            </span>

          </div>

          {/* DASHBOARD */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">
              Dashboard
            </p>

            <NavLink to="/hod/dashboard" className={navClass}>
              <FaChartBar />
              Dashboard
            </NavLink>

          </div>

          {/* EVENTS */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">
              Events
            </p>

            <div className="space-y-1">

              <NavLink to="/hod/manage-events" className={navClass}>
                <FaCalendarAlt />
                Manage Events
              </NavLink>

              <NavLink to="/hod/events/create" className={navClass}>
                <FaPlus />
                Create Event
              </NavLink>

            </div>

          </div>

          {/* PEOPLE */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">
              People
            </p>

            <div className="space-y-1">

              <NavLink to="/hod/teachers" className={navClass}>
                <FaUserTie />
                Teachers
              </NavLink>

              <NavLink to="/hod/students" className={navClass}>
                <FaUserGraduate />
                Students
              </NavLink>

              <NavLink to="/hod/coordinators" className={navClass}>
                <FaUsers />
                Coordinators
              </NavLink>

            </div>

          </div>

          {/* PARTICIPATION */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">
              Participation
            </p>

            <div className="space-y-1">

              <NavLink to="/hod/registrations" className={navClass}>
                <FaClipboardList />
                Registrations
              </NavLink>

              <NavLink to="/hod/participants" className={navClass}>
                <FaUsers />
                Participants
              </NavLink>

            </div>

          </div>

          {/* RESULTS */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">
              Results
            </p>

            <div className="space-y-1">

              <NavLink to="/hod/results" className={navClass}>
                <FaTrophy />
                Department Results
              </NavLink>

              <NavLink to="/hod/publish-results" className={navClass}>
                <FaClipboardList />
                Publish Results
              </NavLink>

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <div className="p-4 border-t border-slate-700">

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition"
          >
            <FiLogOut />
            Logout
          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}

        <header className="bg-white shadow px-4 py-3 flex items-center gap-4">

          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <h1 className="font-semibold text-lg">
            HOD Dashboard
          </h1>

        </header>

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>

  );

};

export default HODLayout;