import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import NotificationBell from "../components/NotificationBell";

const CoordinatorLayout = () => {

  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-green-600 text-white font-medium"
        : "hover:bg-gray-800 text-gray-200"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================= MOBILE TOP BAR ================= */}

      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 text-white flex items-center justify-between px-4 py-3 z-50 shadow">

        <h2 className="font-bold">
          🎯 Coordinator Panel
        </h2>

        <div className="flex items-center gap-3">
          <NotificationBell variant="dark" />
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
        </div>

      </div>

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-gray-900 text-white p-5 flex flex-col justify-between z-50 transform transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div>

          <h2 className="text-xl font-bold mb-6 hidden md:block">
            🎯 Coordinator Panel
          </h2>

          {user && (
            <div className="mb-6 pb-4 border-b border-gray-800">
              <p className="text-sm text-gray-400">
                Welcome,
              </p>
              <p className="font-medium">
                {user.fullName}
              </p>
            </div>
          )}

          <nav className="space-y-2">

            <NavLink
              to="/coordinator/dashboard"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/coordinator/events"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📅 My Events
            </NavLink>

          </nav>

        </div>

        {/* LOGOUT BUTTON */}

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-medium transition"
        >
          🚪 Logout
        </button>

      </aside>

      {/* ================= OVERLAY ================= */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      {/* ================= MAIN CONTENT ================= */}

      <main className="flex-1 min-h-screen bg-gray-50 p-4 md:p-6 pt-20 md:pt-6">

        <Outlet />

      </main>

    </div>
  );
};

export default CoordinatorLayout;
