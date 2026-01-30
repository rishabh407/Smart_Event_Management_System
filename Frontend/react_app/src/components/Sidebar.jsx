import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-screen">
      {/* Header */}
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold text-gray-900">🎓 Student Panel</h2>
        {user && (
          <p className="text-sm text-gray-600 mt-1">{user.fullName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 flex-1">
        <NavLink to="/student" className={linkStyle}>
          📊 Dashboard
        </NavLink>

        <NavLink to="/student/events" className={linkStyle}>
          📅 Events
        </NavLink>

        <NavLink to="/student/registrations" className={linkStyle}>
          📋 My Registrations
        </NavLink>

        <NavLink to="/student/certificates" className={linkStyle}>
          🎓 Certificates
        </NavLink>

        <NavLink to="/student/team" className={linkStyle}>
          👥 Teams
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
