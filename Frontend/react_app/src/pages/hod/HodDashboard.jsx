// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getHodDashboardStats,
//   getEventPerformanceRanking
// } from "../../api/event.api";
// import toast from "react-hot-toast";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   Legend
// } from "recharts";

// const HODDashboard = () => {

//   const navigate = useNavigate();

//   // ---------------- STATE ----------------

//   const [dateFilter, setDateFilter] = useState({
//     from: "",
//     to: ""
//   });

//   const [stats, setStats] = useState({
//     total: 0,
//     upcoming: 0,
//     ongoing: 0,
//     completed: 0,
//     charts: {
//       statusChart: [],
//       monthlyChart: []
//     }
//   });

//   const [ranking, setRanking] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ---------------- FETCH DASHBOARD STATS ----------------

//   const fetchStats = async () => {

//     try {

//       setLoading(true);

//       const params = {};

//       if (dateFilter.from && dateFilter.to) {
//         params.from = dateFilter.from;
//         params.to = dateFilter.to;
//       }

//       const res = await getHodDashboardStats(params);

//       setStats(res.data);

//     } catch (error) {

//       console.error("Dashboard Stats Error:", error);
//       toast.error("Failed to load dashboard statistics");

//     } finally {

//       setLoading(false);

//     }

//   };

//   // ---------------- FETCH EVENT RANKING ----------------
  
//   const fetchRanking = async () => {

//     try {

//       const res = await getEventPerformanceRanking();
//       console.log(res.data);
//       setRanking(res.data);

//     } catch (error) {

//       console.error("Ranking Error:", error);
//       // Don't show toast for ranking as it's not critical

//     }

//   };

//   // ---------------- FIRST LOAD ----------------

//   useEffect(() => {
//     fetchStats();
//     fetchRanking();
//   }, []);

//   // ---------------- HANDLE FILTER APPLY ----------------

//   const handleApplyFilter = () => {
//     if (dateFilter.from && dateFilter.to) {
//       if (new Date(dateFilter.from) > new Date(dateFilter.to)) {
//         toast.error("From date must be before To date");
//         return;
//       }
//       fetchStats();
//     }
//   };

//   // ---------------- HANDLE FILTER RESET ----------------

//   const handleResetFilter = () => {
//     setDateFilter({ from: "", to: "" });
//     fetchStats();
//   };

//   // ---------------- LOADING ----------------

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">

//       {/* ================= HEADER ================= */}

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           HOD Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Comprehensive overview of your event management system
//         </p>
//       </div>

//       {/* ================= DATE FILTER ================= */}

//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           📅 Filter by Date Range
//         </h2>
//         <div className="flex flex-wrap gap-4 items-end">
//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={dateFilter.from}
//               onChange={(e) =>
//                 setDateFilter({
//                   ...dateFilter,
//                   from: e.target.value
//                 })
//               }
//             />
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={dateFilter.to}
//               onChange={(e) =>
//                 setDateFilter({
//                   ...dateFilter,
//                   to: e.target.value
//                 })
//               }
//             />
//           </div>

//           <div className="flex gap-3">
//             <button
//               onClick={handleApplyFilter}
//               disabled={!dateFilter.from || !dateFilter.to}
//               className={`px-5 py-2 rounded-lg text-white font-medium transition-colors duration-200
//                 ${
//                   dateFilter.from && dateFilter.to
//                     ? "bg-blue-600 hover:bg-blue-700 shadow-md"
//                     : "bg-gray-400 cursor-not-allowed"
//                 }
//               `}
//             >
//               🔍 Apply Filter
//             </button>
//             {(dateFilter.from || dateFilter.to) && (
//               <button
//                 onClick={handleResetFilter}
//                 className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors duration-200"
//               >
//                 🔄 Reset
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ================= STATS CARDS ================= */}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//         <StatCard 
//           title="Total Events" 
//           value={stats.total} 
//           icon="📊"
//         />

//         <StatCard
//           title="Upcoming Events"
//           value={stats.upcoming}
//           color="text-orange-600"
//           icon="⏳"
//         />

//         <StatCard
//           title="Ongoing Events"
//           value={stats.ongoing}
//           color="text-green-600"
//           icon="🟢"
//         />

//         <StatCard
//           title="Completed Events"
//           value={stats.completed}
//           color="text-gray-600"
//           icon="✅"
//         />

//       </div>

//       {/* ================= QUICK ACTIONS ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">

//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           ⚡ Quick Actions
//         </h2>

//         <div className="flex flex-wrap gap-4">

//           <button
//             onClick={() => navigate("/hod/events/create")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             ➕ Create Event
//           </button>

//           <button
//             onClick={() => navigate("/hod/manage-events")}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             📋 Manage Events
//           </button>

//         </div>

//       </div>

//       {/* ================= STATUS CHART ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">

//         <h2 className="text-lg font-semibold text-gray-800 mb-6">
//           📊 Event Status Overview
//         </h2>

//         {stats.charts.statusChart.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No chart data available
//           </p>

//         ) : (

//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={stats.charts.statusChart}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="value" fill="#3b82f6" name="Events" />
//             </BarChart>
//           </ResponsiveContainer>

//         )}

//       </div>

//       {/* ================= MONTHLY TREND ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">

//         <h2 className="text-lg font-semibold text-gray-800 mb-6">
//           📈 Monthly Event Creation Trend
//         </h2>

//         {stats.charts.monthlyChart.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No trend data available
//           </p>

//         ) : (

//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={stats.charts.monthlyChart}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line 
//                 type="monotone" 
//                 dataKey="count" 
//                 stroke="#10b981" 
//                 strokeWidth={2}
//                 name="Events Created"
//               />
//             </LineChart>
//           </ResponsiveContainer>

//         )}

//       </div>

//       {/* ================= EVENT PERFORMANCE RANKING ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6">

//         <h2 className="text-lg font-semibold text-gray-800 mb-6">
//           🔥 Top Performing Events
//         </h2>

//         {ranking.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No ranking data available
//           </p>

//         ) : (

//           <div className="space-y-4">

//             {ranking.map((event, index) => (

//               <div
//                 key={event._id}
//                 className="flex items-center justify-between border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 mb-3"
//               >

//                 <div className="flex items-center gap-4 flex-1">

//                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
//                     index === 0 ? "bg-yellow-500" :
//                     index === 1 ? "bg-gray-400" :
//                     index === 2 ? "bg-orange-600" :
//                     "bg-blue-500"
//                   }`}>
//                     {index + 1}
//                   </div>

//                   {event.banner && (
//                     <img
//                       src={`http://localhost:5000${event.banner}`}
//                       alt="banner"
//                       className="h-16 w-24 object-cover rounded-lg border border-gray-200"
//                     />
//                   )}

//                   <div className="flex-1">
//                     <p className="font-semibold text-gray-900 text-lg">
//                       {event.title}
//                     </p>

//                     <p className="text-sm text-gray-600 mt-1">
//                       📝 {event.registrations || 0} Registrations
//                     </p>
//                   </div>

//                 </div>

//                 <span className="text-green-600 font-semibold px-3 py-1 bg-green-50 rounded-full">
//                   🔥 Popular
//                 </span>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// };

// // ---------------- REUSABLE STAT CARD ----------------

// const StatCard = ({ title, value, color, icon }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-gray-600 text-sm font-medium mb-1">
//             {title}
//           </p>
//           <h2 className={`text-4xl font-bold ${color || "text-gray-800"}`}>
//             {value}
//           </h2>
//         </div>
//         {icon && (
//           <div className={`text-4xl ${color || "text-gray-400"}`}>
//             {icon}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HODDashboard;


// **********************************************************************

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHodDashboardStats,
  getEventPerformanceRanking
} from "../../api/event.api";
import toast from "react-hot-toast";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";

const HODDashboard = () => {

  const navigate = useNavigate();

  // ================= FILTER STATES =================

  // Input only (NO API)
  const [tempFilter, setTempFilter] = useState({
    from: "",
    to: ""
  });

  // Actual applied filter (API trigger)
  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: ""
  });

  // Save original dashboard snapshot
  const originalStatsRef = useRef(null);

  // ================= DASHBOARD STATE =================

  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    ongoing: 0,
    completed: 0,
    charts: {
      statusChart: [],
      monthlyChart: []
    }
  });

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH STATS =================

  const fetchStats = async () => {

    try {

      setLoading(true);

      const params = {};

      if (dateFilter.from && dateFilter.to) {
        params.from = dateFilter.from;
        params.to = dateFilter.to;
      }

      const res = await getHodDashboardStats(params);

      // Save original data only first time
      if (
        !dateFilter.from &&
        !dateFilter.to &&
        !originalStatsRef.current
      ) {
        originalStatsRef.current = res.data;
      }

      setStats(res.data);

    } catch (error) {

      console.error("Dashboard Stats Error:", error);
      toast.error("Failed to load dashboard statistics");

    } finally {

      setLoading(false);

    }

  };

  // ================= FETCH RANKING =================

  const fetchRanking = async () => {

    try {

      const res = await getEventPerformanceRanking();
      setRanking(res.data);

    } catch (error) {

      console.error("Ranking Error:", error);

    }

  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchStats();
  }, [dateFilter]);

  useEffect(() => {
    fetchRanking();
  }, []);

  // ================= APPLY FILTER =================

  const handleApplyFilter = () => {

    if (!tempFilter.from || !tempFilter.to) return;

    if (new Date(tempFilter.from) > new Date(tempFilter.to)) {
      toast.error("From date must be before To date");
      return;
    }

    // Trigger API
    setDateFilter(tempFilter);

  };

  // ================= RESET FILTER =================

  const handleResetFilter = () => {

    const empty = { from: "", to: "" };

    setTempFilter(empty);
    setDateFilter(empty);

    // Restore previous dashboard instantly
    if (originalStatsRef.current) {
      setStats(originalStatsRef.current);
    }

  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          HOD Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive overview of your event management system
        </p>
      </div>

      {/* ================= DATE FILTER ================= */}

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📅 Filter by Date Range
        </h2>

        <div className="flex flex-wrap gap-4 items-end">

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Date
            </label>

            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={tempFilter.from}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  from: e.target.value
                })
              }
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Date
            </label>

            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              value={tempFilter.to}
              onChange={(e) =>
                setTempFilter({
                  ...tempFilter,
                  to: e.target.value
                })
              }
            />
          </div>

          <div className="flex gap-3">

            <button
              onClick={handleApplyFilter}
              disabled={!tempFilter.from || !tempFilter.to}
              className={`px-5 py-2 rounded-lg text-white font-medium
                ${
                  tempFilter.from && tempFilter.to
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              🔍 Apply Filter
            </button>

            {(tempFilter.from || tempFilter.to) && (
              <button
                onClick={handleResetFilter}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                🔄 Reset
              </button>
            )}

          </div>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard title="Total Events" value={stats.total} icon="📊" />
        <StatCard title="Upcoming Events" value={stats.upcoming} icon="⏳" />
        <StatCard title="Ongoing Events" value={stats.ongoing} icon="🟢" />
        <StatCard title="Completed Events" value={stats.completed} icon="✅" />

      </div>

      {/* ================= STATUS CHART ================= */}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.charts.statusChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* ================= MONTHLY TREND ================= */}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.charts.monthlyChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="count" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

// ================= STAT CARD =================

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <p className="text-gray-600">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
      <span className="text-2xl">{icon}</span>
    </div>
  );
};

export default HODDashboard;


// **********************************************************************

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   getHodDashboardStats,
//   getEventPerformanceRanking
// } from "../../api/event.api";
// import toast from "react-hot-toast";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid,
//   Legend
// } from "recharts";

// const HODDashboard = () => {

//   const navigate = useNavigate();

//   // ---------------- STATE ----------------

  // // TEMP INPUT STATE (no API call)
  // const [tempFilter, setTempFilter] = useState({
  //   from: "",
  //   to: ""
  // });

//   // APPLIED FILTER (API trigger)
//   const [dateFilter, setDateFilter] = useState({
//     from: "",
//     to: ""
//   });

//   const [stats, setStats] = useState({
//     total: 0,
//     upcoming: 0,
//     ongoing: 0,
//     completed: 0,
//     charts: {
//       statusChart: [],
//       monthlyChart: []
//     }
//   });

//   const [ranking, setRanking] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ---------------- FETCH DASHBOARD STATS ----------------

//   const fetchStats = async () => {

//     try {

//       setLoading(true);

//       const params = {};

//       if (dateFilter.from && dateFilter.to) {
//         params.from = dateFilter.from;
//         params.to = dateFilter.to;
//       }

//       const res = await getHodDashboardStats(params);
//       setStats(res.data);

//     } catch (error) {

//       console.error("Dashboard Stats Error:", error);
//       toast.error("Failed to load dashboard statistics");

//     } finally {

//       setLoading(false);

//     }

//   };

//   // ---------------- FETCH EVENT RANKING ----------------

//   const fetchRanking = async () => {

//     try {

//       const res = await getEventPerformanceRanking();
//       setRanking(res.data);

//     } catch (error) {

//       console.error("Ranking Error:", error);

//     }

//   };

//   // ---------------- FETCH STATS ONLY WHEN APPLY CLICKED ----------------

//   useEffect(() => {

//     fetchStats();

//   }, [dateFilter]);

//   // ---------------- FETCH RANKING ON FIRST LOAD ----------------

//   useEffect(() => {

//     fetchRanking();

//   }, []);

//   // ---------------- APPLY FILTER ----------------

//   const handleApplyFilter = () => {

//     if (tempFilter.from && tempFilter.to) {

//       if (new Date(tempFilter.from) > new Date(tempFilter.to)) {
//         toast.error("From date must be before To date");
//         return;
//       }

//       // APPLY FILTER ONLY ON BUTTON CLICK
      // setDateFilter(tempFilter);

//     }

//   };

//   // ---------------- RESET FILTER ----------------

  // const handleResetFilter = () => {

  //   const empty = { from: "", to: "" };

  //   setTempFilter(empty);
  //   setDateFilter(empty);

  // };

//   // ---------------- LOADING ----------------

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">

//       {/* ================= HEADER ================= */}

//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//           HOD Dashboard
//         </h1>
//         <p className="text-gray-600">
//           Comprehensive overview of your event management system
//         </p>
//       </div>

//       {/* ================= DATE FILTER ================= */}

//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           📅 Filter by Date Range
//         </h2>

//         <div className="flex flex-wrap gap-4 items-end">

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               From Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2"
//               value={tempFilter.from}
//               onChange={(e) =>
//                 setTempFilter({
//                   ...tempFilter,
//                   from: e.target.value
//                 })
//               }
//             />
//           </div>

//           <div className="flex-1 min-w-[200px]">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               To Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 rounded-lg px-4 py-2"
//               value={tempFilter.to}
//               onChange={(e) =>
//                 setTempFilter({
//                   ...tempFilter,
//                   to: e.target.value
//                 })
//               }
//             />
//           </div>

//           <div className="flex gap-3">

//             <button
//               onClick={handleApplyFilter}
//               disabled={!tempFilter.from || !tempFilter.to}
//               className={`px-5 py-2 rounded-lg text-white font-medium transition-colors duration-200
//                 ${
//                   tempFilter.from && tempFilter.to
//                     ? "bg-blue-600 hover:bg-blue-700 shadow-md"
//                     : "bg-gray-400 cursor-not-allowed"
//                 }
//               `}
//             >
//               🔍 Apply Filter
//             </button>

//             {(tempFilter.from || tempFilter.to) && (

//               <button
//                 onClick={handleResetFilter}
//                 className="px-5 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium transition-colors duration-200"
//               >
//                 🔄 Reset
//               </button>

//             )}

//           </div>

//         </div>
//       </div>

//       {/* ================= STATS CARDS ================= */}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

//         <StatCard title="Total Events" value={stats.total} icon="📊" />
//         <StatCard title="Upcoming Events" value={stats.upcoming} icon="⏳" />
//         <StatCard title="Ongoing Events" value={stats.ongoing} icon="🟢" />
//         <StatCard title="Completed Events" value={stats.completed} icon="✅" />

//       </div>

//       {/* ================= QUICK ACTIONS ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6 mb-8">

//         <h2 className="text-lg font-semibold text-gray-800 mb-4">
//           ⚡ Quick Actions
//         </h2>

//         <div className="flex flex-wrap gap-4">

//           <button
//             onClick={() => navigate("/hod/events/create")}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             ➕ Create Event
//           </button>

//           <button
//             onClick={() => navigate("/hod/manage-events")}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
//           >
//             📋 Manage Events
//           </button>

//         </div>

//       </div>

//       {/* ================= EVENT PERFORMANCE RANKING ================= */}

//       <div className="bg-white shadow-md rounded-lg p-6">

//         <h2 className="text-lg font-semibold text-gray-800 mb-6">
//           🔥 Top Performing Events
//         </h2>

//         {ranking.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No ranking data available
//           </p>

//         ) : (

//           <div className="space-y-4">

//             {ranking.map((event, index) => (

//               <div
//                 key={event._id}
//                 className="flex items-center justify-between border border-gray-200 p-4 rounded-lg mb-3"
//               >

//                 <div>
//                   <p className="font-semibold text-gray-900">
//                     #{index + 1} {event.title}
//                   </p>

//                   <p className="text-sm text-gray-600">
//                     📝 {event.registrations} Registrations
//                   </p>
//                 </div>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// };

// // ---------------- REUSABLE STAT CARD ----------------

// const StatCard = ({ title, value, icon }) => {

//   return (
//     <div className="bg-white shadow-md rounded-lg p-6">

//       <p className="text-gray-600 text-sm font-medium mb-1">
//         {title}
//       </p>

//       <div className="flex justify-between items-center">

//         <h2 className="text-3xl font-bold">
//           {value}
//         </h2>

//         <span className="text-3xl">
//           {icon}
//         </span>

//       </div>

//     </div>
//   );

// };

// export default HODDashboard;
