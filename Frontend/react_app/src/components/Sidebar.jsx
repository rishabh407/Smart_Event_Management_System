import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg">

      <div className="p-5 text-xl font-bold border-b">
        Student Panel
      </div>

      <nav className="p-4 space-y-2">

        <NavLink to="/student" className="block p-2 rounded hover:bg-gray-200">
          Dashboard
        </NavLink>

        <NavLink to="/student/events" className="block p-2 rounded hover:bg-gray-200">
          Events
        </NavLink>

        <NavLink to="/student/registrations" className="block p-2 rounded hover:bg-gray-200">
          My Registrations
        </NavLink>

        <NavLink to="/student/certificates" className="block p-2 rounded hover:bg-gray-200">
          Certificates
        </NavLink>

        <NavLink to="/student/team" className="block p-2 rounded hover:bg-gray-200">
          Team
        </NavLink>
        <NavLink to="/student/scan/:id" className="block p-2 rounded hover:bg-gray-200">
          Scan attendance
        </NavLink>
      </nav>

    </div>
  );
};

export default Sidebar;
