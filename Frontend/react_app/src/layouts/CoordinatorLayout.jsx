import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CoordinatorLayout = () => {
  const { user, logout } = useAuth();
//  const navigate = useNavigate();

//  const handleLogout = () => {

//   Cookies.remove("accessToken");
//   Cookies.remove("refreshToken");

//   navigate("/");
//  };

 const linkStyle = ({ isActive }) =>
  `block px-4 py-2 rounded transition ${
   isActive
    ? "bg-green-600 text-white"
    : "hover:bg-gray-800"
  }`;

 return (

  <div className="flex min-h-screen">

   {/* SIDEBAR */}
   <aside className="w-64 bg-gray-900 text-white p-5">

    <h2 className="text-xl font-bold mb-6">
     Coordinator Panel
    </h2>

    <nav className="space-y-3">

     <NavLink
      to="/coordinator/dashboard"
      className={linkStyle}
     >
      Dashboard
     </NavLink>

     <button
      onClick={logout}
      className="w-full mt-6 bg-red-600 hover:bg-red-700 py-2 rounded"
     >
      Logout
     </button>

    </nav>

   </aside>

   {/* CONTENT */}
   <main className="flex-1 p-6 bg-gray-100">
    <Outlet />
   </main>

  </div>

 );
};

export default CoordinatorLayout;
