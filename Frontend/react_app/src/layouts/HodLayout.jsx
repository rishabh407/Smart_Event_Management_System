import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
const HodLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ================= ROLE PROTECTION ================= */
  useEffect(() => {
    if (!user || user.role !== "HOD") {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  /* ================= CLOSE SIDEBAR ON ROUTE CHANGE (MOBILE) ================= */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded text-sm transition ${
      isActive
        ? "bg-blue-700 text-white font-medium"
        : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <div className="flex h-screen">
      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`bg-gray-900 text-white z-40
        fixed md:fixed inset-y-0 left-0 w-64
        transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-screen justify-between">
          <div>
            {/* HEADER */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-lg">👔 HOD Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden"
              >
                ✕
              </button>
            </div>

            {/* USER INFO */}
            {user && (
              <div className="p-4 border-b border-gray-800">
                <p className="text-xs text-gray-400">Welcome</p>
                <p className="font-medium truncate">{user.fullName}</p>
                <span className="inline-block mt-2 text-xs bg-blue-600 px-2 py-1 rounded">
                  HOD
                </span>
              </div>
            )}

            {/* NAV */}
            <nav className="p-3 space-y-1">
              <NavLink to="/hod/dashboard" className={linkStyle}>
                📊 Dashboard
              </NavLink>

              <NavLink to="/hod/manage-events" className={linkStyle}>
                📋 Manage Events
              </NavLink>

              <NavLink to="/hod/events/create" className={linkStyle}>
                ➕ Create Event
              </NavLink>

              <NavLink to="/hod/results" className={linkStyle}>
                🏆 Department Results
              </NavLink>
            </nav>
          </div>

          {/* LOGOUT */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm font-medium"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col bg-gray-50 md:ml-64 min-w-0">
        {/* TOP BAR */}
        <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden bg-gray-200 px-3 py-2 rounded"
            >
              ☰
            </button>
            <h2 className="font-semibold text-gray-700 text-sm sm:text-base">
              HOD Dashboard Panel
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full max-w-[160px] truncate">
              {user?.fullName}
            </span>
          </div>
        </header>

        {/* ONLY SCROLLABLE AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HodLayout;
