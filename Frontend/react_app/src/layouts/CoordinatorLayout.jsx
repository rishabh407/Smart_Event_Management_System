import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CoordinatorLayout = () => {
  const { user, logout } = useAuth();

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-green-600 text-white font-medium"
        : "hover:bg-gray-800 text-gray-200"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6 text-white">
            🎯 Coordinator Panel
          </h2>

          {user && (
            <div className="mb-6 pb-4 border-b border-gray-800">
              <p className="text-sm text-gray-400">Welcome,</p>
              <p className="font-medium text-white">{user.fullName}</p>
            </div>
          )}

          <nav className="space-y-2">
            <NavLink to="/coordinator/dashboard" className={linkStyle}>
              📊 Dashboard
            </NavLink>

            <NavLink to="/coordinator/events" className={linkStyle}>
              📅 My Events
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="w-full mt-6 bg-red-600 hover:bg-red-700 py-2 rounded text-white font-medium transition"
        >
          🚪 Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default CoordinatorLayout;
