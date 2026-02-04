import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {

  const { user, logout } = useAuth();

  const linkStyle = ({ isActive }) =>
    `block px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-blue-600 text-white font-medium"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <>
      {/* BACKDROP FOR MOBILE */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:shadow-none`}
      >

        {/* HEADER */}
        <div className="p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">🎓 Student Panel</h2>
          <p className="text-sm text-gray-500 truncate">
            {user?.fullName}
          </p>
        </div>

        {/* MENU */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">

          <NavLink to="/student" onClick={() => setOpen(false)} className={linkStyle}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/student/events" onClick={() => setOpen(false)} className={linkStyle}>
            📅 Events
          </NavLink>

          <NavLink to="/student/registrations" onClick={() => setOpen(false)} className={linkStyle}>
            📋 My Registrations
          </NavLink>

          <NavLink to="/student/certificates" onClick={() => setOpen(false)} className={linkStyle}>
            🎓 Certificates
          </NavLink>

          <NavLink to="/student/results" onClick={() => setOpen(false)} className={linkStyle}>
            🏆 My Results
          </NavLink>

          <NavLink to="/student/team" onClick={() => setOpen(false)} className={linkStyle}>
            👥 Teams
          </NavLink>

        </nav>

        {/* LOGOUT FIXED BOTTOM */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            🚪 Logout
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
