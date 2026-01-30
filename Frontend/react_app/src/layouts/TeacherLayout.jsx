import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-indigo-700 text-white font-medium"
        : "hover:bg-indigo-800 text-indigo-100"
    }`;

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-indigo-900 text-white p-5 flex flex-col justify-between">

        <div>
          <h2 className="text-xl font-bold mb-6 text-white">
            👨‍🏫 Teacher Panel
          </h2>

          {user && (
            <div className="mb-6 pb-4 border-b border-indigo-800">
              <p className="text-sm text-indigo-200">Welcome,</p>
              <p className="font-medium text-white">{user.fullName}</p>
            </div>
          )}

          <nav className="space-y-2">

            <NavLink
              to="/teacher/dashboard"
              className={linkStyle}
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/teacher/competitions"
              className={linkStyle}
            >
              📋 Assigned Competitions
            </NavLink>

            <NavLink
              to="/teacher/attendance"
              className={linkStyle}
            >
              📝 Attendance
            </NavLink>

            <NavLink
              to="/teacher/results"
              className={linkStyle}
            >
              🏆 Results
            </NavLink>

            <NavLink
              to="/teacher/certificates"
              className={linkStyle}
            >
              🎓 Certificates
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

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
};

export default TeacherLayout;
