// import { Outlet, Link } from "react-router-dom";

// const HodLayout = () => {
//   return (
//     <div className="flex min-h-screen">

//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-4">

//         <h2 className="text-xl font-bold mb-6">
//           HOD Panel
//         </h2>

//         <nav className="space-y-3">

//           <Link to="/hod/dashboard" className="block hover:text-green-400">
//             Dashboard
//           </Link>

//           <Link to="/hod/manage-events" className="block hover:text-green-400">
//             Manage Events
//           </Link>

//           <Link to="/hod/events/create" className="block hover:text-green-400">
//             Create Event
//           </Link>

//         </nav>

//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 bg-gray-100">
//         <Outlet />
//       </div>

//     </div>
//   );
// };

// export default HodLayout;

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HodLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-blue-700 text-white font-medium"
        : "hover:bg-gray-800 text-gray-200"
    }`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-6 text-white">
            👔 HOD Panel
          </h2>

          {user && (
            <div className="mb-6 pb-4 border-b border-gray-800">
              <p className="text-sm text-gray-400">Welcome,</p>
              <p className="font-medium text-white">{user.fullName}</p>
            </div>
          )}

          <nav className="space-y-2">
            <NavLink to="/hod/dashboard" className={linkStyle}>
              📊 Dashboard
            </NavLink>

            <NavLink to="/hod/manage-events" className={linkStyle}>
              📋 Manage Events
            </NavLink>

            <NavLink to="/hod/events/create" className={linkStyle}>
              ➕ Create Event
            </NavLink>
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 py-2 rounded text-white mt-6 font-medium transition"
        >
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default HodLayout;
