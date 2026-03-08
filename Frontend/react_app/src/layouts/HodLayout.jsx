// import {
//   Outlet,
//   NavLink,
//   useNavigate,
//   useLocation
// } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";
// const HodLayout = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* ================= ROLE PROTECTION ================= */
//   useEffect(() => {
//     if (!user || user.role !== "HOD") {
//       navigate("/unauthorized");
//     }
//   }, [user, navigate]);

//   /* ================= CLOSE SIDEBAR ON ROUTE CHANGE (MOBILE) ================= */
//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [location.pathname]);

//   const linkStyle = ({ isActive }) =>
//     `flex items-center gap-2 px-4 py-2 rounded text-sm transition ${
//       isActive
//         ? "bg-blue-700 text-white font-medium"
//         : "text-gray-300 hover:bg-gray-800"
//     }`;

//   return (
//     <div className="flex h-screen">
//       {/* ================= MOBILE OVERLAY ================= */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//         />
//       )}

//       {/* ================= SIDEBAR ================= */}
//       <aside
//         className={`bg-gray-900 text-white z-40
//         fixed md:fixed inset-y-0 left-0 w-64
//         transform transition-transform duration-300
//         ${
//           sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full md:translate-x-0"
//         }`}
//       >
//         <div className="flex flex-col h-screen justify-between">
//           <div>
//             {/* HEADER */}
//             <div className="p-4 border-b border-gray-800 flex justify-between items-center">
//               <h2 className="font-bold text-lg">👔 HOD Panel</h2>
//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="md:hidden"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* USER INFO */}
//             {user && (
//               <div className="p-4 border-b border-gray-800">
//                 <p className="text-xs text-gray-400">Welcome</p>
//                 <p className="font-medium truncate">{user.fullName}</p>
//                 <span className="inline-block mt-2 text-xs bg-blue-600 px-2 py-1 rounded">
//                   HOD
//                 </span>
//               </div>
//             )}

//             {/* NAV */}
//             <nav className="p-3 space-y-1">
//               <NavLink to="/hod/dashboard" className={linkStyle}>
//                 📊 Dashboard
//               </NavLink>

//               <NavLink to="/hod/manage-events" className={linkStyle}>
//                 📋 Manage Events
//               </NavLink>

//               <NavLink to="/hod/events/create" className={linkStyle}>
//                 ➕ Create Event
//               </NavLink>

//               <NavLink to="/hod/results" className={linkStyle}>
//                 🏆 Department Results
//               </NavLink>
//             </nav>
//           </div>

//           {/* LOGOUT */}
//           <div className="p-4 border-t border-gray-800">
//             <button
//               onClick={logout}
//               className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm font-medium"
//             >
//               🚪 Logout
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <div className="flex-1 flex flex-col bg-gray-50 md:ml-64 min-w-0">
//         {/* TOP BAR */}
//         <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="md:hidden bg-gray-200 px-3 py-2 rounded"
//             >
//               ☰
//             </button>
//             <h2 className="font-semibold text-gray-700 text-sm sm:text-base">
//               HOD Dashboard Panel
//             </h2>
//           </div>

//           <div className="flex items-center gap-3">
//             <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full max-w-[160px] truncate">
//               {user?.fullName}
//             </span>
//           </div>
//         </header>

//         {/* ONLY SCROLLABLE AREA */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default HodLayout;

// import {
//   Outlet,
//   NavLink,
//   useNavigate,
//   useLocation
// } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";
// import { useEffect, useState } from "react";

// const HodLayout = () => {

//   const { user, logout, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   /* ================= ROLE PROTECTION ================= */

//   useEffect(() => {

//     if (!loading && (!user || user.role !== "HOD")) {
//       navigate("/unauthorized");
//     }

//   }, [user, loading, navigate]);


//   /* ================= CLOSE SIDEBAR ON ROUTE CHANGE ================= */

//   useEffect(() => {
//     setSidebarOpen(false);
//   }, [location.pathname]);


//   /* ================= LOGOUT ================= */

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };


//   /* ================= NAV LINK STYLE ================= */

//   const linkStyle = ({ isActive }) =>
//     `flex items-center gap-2 px-4 py-2 rounded text-sm transition ${
//       isActive
//         ? "bg-blue-700 text-white font-medium"
//         : "text-gray-300 hover:bg-gray-800"
//     }`;


//   /* ================= LOADING STATE ================= */

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }


//   return (
//     <div className="flex h-screen overflow-hidden">

//       {/* ================= MOBILE OVERLAY ================= */}

//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//         />
//       )}


//       {/* ================= SIDEBAR ================= */}

//       <aside
//         className={`bg-gray-900 text-white z-40
//         fixed inset-y-0 left-0 w-64
//         transform transition-transform duration-300
//         ${
//           sidebarOpen
//             ? "translate-x-0"
//             : "-translate-x-full md:translate-x-0"
//         }`}
//       >

//         <div className="flex flex-col h-full justify-between">

//           {/* TOP SECTION */}

//           <div>

//             {/* HEADER */}

//             <div className="p-4 border-b border-gray-800 flex justify-between items-center">
//               <h2 className="font-bold text-lg">👔 HOD Panel</h2>

//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="md:hidden text-gray-300"
//               >
//                 ✕
//               </button>
//             </div>


//             {/* USER INFO */}

//             {user && (
//               <div className="p-4 border-b border-gray-800">
//                 <p className="text-xs text-gray-400">Welcome</p>
//                 <p className="font-medium truncate">{user.fullName}</p>

//                 <span className="inline-block mt-2 text-xs bg-blue-600 px-2 py-1 rounded">
//                   HOD
//                 </span>
//               </div>
//             )}


//             {/* NAVIGATION */}

//             <nav className="p-3 space-y-1">

//               <NavLink to="/hod/dashboard" className={linkStyle}>
//                 📊 Dashboard
//               </NavLink>

//               <NavLink to="/hod/manage-events" className={linkStyle}>
//                 📋 Manage Events
//               </NavLink>

//               <NavLink to="/hod/events/create" className={linkStyle}>
//                 ➕ Create Event
//               </NavLink>

//               <NavLink to="/hod/results" className={linkStyle}>
//                 🏆 Department Results
//               </NavLink>

//             </nav>

//           </div>


//           {/* LOGOUT BUTTON */}

//           <div className="p-4 border-t border-gray-800">

//             <button
//               onClick={handleLogout}
//               className="w-full bg-red-600 hover:bg-red-700 py-2 rounded text-sm font-medium"
//             >
//               🚪 Logout
//             </button>

//           </div>

//         </div>

//       </aside>


//       {/* ================= MAIN CONTENT ================= */}

//       <div className="flex-1 flex flex-col bg-gray-50 md:ml-64 min-w-0">

//         {/* TOP BAR */}

//         <header className="bg-white shadow px-4 py-3 flex justify-between items-center">

//           <div className="flex items-center gap-3">

//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="md:hidden bg-gray-200 px-3 py-2 rounded"
//             >
//               ☰
//             </button>

//             <h2 className="font-semibold text-gray-700 text-sm sm:text-base">
//               HOD Dashboard Panel
//             </h2>

//           </div>


//           {/* USER BADGE */}

//           <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full max-w-[160px] truncate">
//             {user?.fullName}
//           </span>

//         </header>


//         {/* PAGE CONTENT */}

//         <main className="flex-1 overflow-y-auto p-4 sm:p-6">

//           <Outlet />

//         </main>

//       </div>

//     </div>
//   );
// };

// export default HodLayout;

import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi";
import {
  FaCalendarAlt,
  FaPlus,
  FaTrophy,
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaClipboardList,
  FaChartBar
} from "react-icons/fa";

const HODLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition
    ${isActive
      ? "bg-blue-600 text-white"
      : "text-gray-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (

    <div className="flex h-screen overflow-hidden bg-gray-100">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
        fixed lg:static z-40 top-0 left-0
        h-screen w-64 bg-slate-900 text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        flex flex-col
      `}
      >

        {/* HEADER */}

        <div className="p-4 border-b border-slate-700 flex justify-between items-center">

          <h2 className="font-bold text-lg">🎓 HOD Panel</h2>

          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>

        </div>

        {/* MENU */}
<div className="flex-1 p-4 spacex-y-6 overflow-y-auto hide-scrollbar">
          <div>

            <p className="text-gray-400 text-sm">Welcome</p>
            <p className="font-semibold text-lg">Dr. John Smith</p>

            <span className="inline-block mt-2 bg-blue-600 text-sm px-3 py-1 rounded">
              HOD
            </span>

          </div>

          {/* DASHBOARD */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">Dashboard</p>

            <NavLink to="/hod/dashboard" className={navClass}>
              <FaChartBar />
              Dashboard
            </NavLink>

          </div>

          {/* EVENTS */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">Events</p>

            <div className="space-y-1">

              <NavLink to="/hod/manage-events" className={navClass}>
                <FaCalendarAlt />
                Manage Events
              </NavLink>

              <NavLink to="/hod/events/create" className={navClass}>
                <FaPlus />
                Create Event
              </NavLink>


            </div>

          </div>

          {/* PEOPLE */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">People</p>

            <div className="space-y-1">

              <NavLink to="/hod/teachers" className={navClass}>
                <FaUserTie />
                Teachers
              </NavLink>

              <NavLink to="/hod/students" className={navClass}>
                <FaUserGraduate />
                Students
              </NavLink>

              <NavLink to="/hod/coordinators" className={navClass}>
                <FaUsers />
                Coordinators
              </NavLink>

            </div>

          </div>

          {/* PARTICIPATION */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">Participation</p>

            <div className="space-y-1">

              <NavLink to="/hod/registrations" className={navClass}>
                <FaClipboardList />
                Registrations
              </NavLink>

              <NavLink to="/hod/participants" className={navClass}>
                <FaUsers />
                Participants
              </NavLink>

            </div>

          </div>

          {/* RESULTS */}

          <div>

            <p className="text-gray-400 text-xs mb-2 uppercase">Results</p>

            <div className="space-y-1">

              <NavLink to="/hod/results" className={navClass}>
                <FaTrophy />
                Department Results
              </NavLink>

              <NavLink to="/hod/publish-results" className={navClass}>
                <FaClipboardList />
                Publish Results
              </NavLink>

            </div>

          </div>

        </div>

        {/* LOGOUT */}

        <div className="p-4 border-t border-slate-700">

          <button className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg transition">

            <FiLogOut />
            Logout

          </button>

        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}

        <header className="bg-white shadow px-4 py-3 flex items-center gap-4">

          <button
            className="lg:hidden text-xl"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <h1 className="font-semibold text-lg">
            HOD Dashboard
          </h1>

        </header>

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>

  );

};

export default HODLayout;