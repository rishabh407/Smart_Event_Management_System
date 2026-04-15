import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const TeacherLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-indigo-700 text-white font-medium"
        : "hover:bg-indigo-800 text-indigo-100"
    }`;

  return (
    <div className="flex min-h-screen bg-gray-50">

      <div className="md:hidden fixed top-0 left-0 right-0 bg-indigo-900 text-white flex items-center justify-between px-4 py-3 z-50 shadow">
        <h2 className="font-bold">👨‍🏫 Teacher Panel</h2>

        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="text-2xl">
            ☰
          </button>
        </div>
      </div>


      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-indigo-900 text-white p-5 flex flex-col justify-between z-50 transform transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          <h2 className="text-xl font-bold mb-6 hidden md:block">
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
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📊 Dashboard
            </NavLink>
            <NavLink
              to="/teacher/events"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📅 Events
            </NavLink>
            <NavLink
              to="/teacher/attendance"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📝 Attendance
            </NavLink>

            <NavLink
              to="/teacher/results"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              🏆 Results
            </NavLink>

            <NavLink
              to="/teacher/certificates"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              🎓 Certificates
            </NavLink>

            <NavLink
              to="/teacher/certificates/upload"
              onClick={() => setOpen(false)}
              className={linkStyle}
            >
              📤 Upload Templates
            </NavLink>
            <NavLink to="/teacher/export"
            onClick={() => setOpen(false)}
              className={linkStyle}>
 📤 Export Reports
</NavLink>
          </nav>
        </div>


        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-white font-medium transition"
        >
          🚪 Logout
        </button>
      </aside>


      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        />
      )}


      <main className="flex-1 min-h-screen bg-gray-50 p-4 md:p-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
