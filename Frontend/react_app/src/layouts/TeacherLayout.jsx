import { Outlet, NavLink } from "react-router-dom";

const TeacherLayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-indigo-900 text-white p-5">

        <h2 className="text-xl font-bold mb-6">
          Teacher Panel
        </h2>

        <nav className="space-y-3">

          <NavLink
            to="/teacher/dashboard"
            className="block p-2 rounded hover:bg-indigo-700"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/teacher/competitions"
            className="block p-2 rounded hover:bg-indigo-700"
          >
            Assigned Competitions
          </NavLink>

          <NavLink
            to="/teacher/attendance"
            className="block p-2 rounded hover:bg-indigo-700"
          >
            Attendance
          </NavLink>

          <NavLink
            to="/teacher/results"
            className="block p-2 rounded hover:bg-indigo-700"
          >
            Results
          </NavLink>

          <NavLink
            to="/teacher/certificates"
            className="block p-2 rounded hover:bg-indigo-700"
          >
            Certificates
          </NavLink>

        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
};

export default TeacherLayout;
