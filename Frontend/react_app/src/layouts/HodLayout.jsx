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

import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const HodLayout = () => {
    const { user, logout } = useAuth();
  const navigate = useNavigate();

  // const handleLogout = async () => {

  //   const confirm = window.confirm("Are you sure you want to logout?");

  //   if (!confirm) return;

  //   try {

  //     await logoutUser();

  //     navigate("/", { replace: true });

  //   } catch (error) {

  //     console.error(error);
  //     alert("Logout failed");

  //   }

  // };

  return (

    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">

        <div>

          <h2 className="text-xl font-bold mb-6">
            HOD Panel
          </h2>

          <nav className="space-y-3">

            <Link to="/hod/dashboard" className="block hover:text-green-400">
              Dashboard
            </Link>

            <Link to="/hod/manage-events" className="block hover:text-green-400">
              Manage Events
            </Link>

            <Link to="/hod/events/create" className="block hover:text-green-400">
              Create Event
            </Link>

          </nav>

        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 py-2 rounded text-white mt-6"
        >
          Logout
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>

    </div>

  );
};

export default HodLayout;
