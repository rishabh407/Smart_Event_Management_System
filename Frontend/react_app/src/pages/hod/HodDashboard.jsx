// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getEventPerformanceRanking, getHodDashboardStats } from "../../api/event.api";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   CartesianGrid
// } from "recharts";

// const HODDashboard = () => {

//   const navigate = useNavigate();
//    const [ranking, setRanking] = useState([]);
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

//   const [loading, setLoading] = useState(true);

//   // ---------------- FETCH STATS ----------------

//   const fetchStats = async () => {

//     try {

//       setLoading(true);

//       let query = "";

//       if (dateFilter.from && dateFilter.to) {
//         query = `?from=${dateFilter.from}&to=${dateFilter.to}`;
//       }

//       const res = await getHodDashboardStats(query);

//       setStats(res.data);

//     } catch (error) {

//       console.error(error);

//     } finally {

//       setLoading(false);

//     }

//   };

// const fetchRanking = async () => {

//   try {

//     const res = await getEventPerformanceRanking();
//     setRanking(res.data);

//   } catch (error) {

//     console.error(error);

//   }

// };


//   // ---------------- FIRST LOAD ----------------

//   useEffect(() => {
//     fetchStats();
//     fetchRanking();
//   }, []);

//   // ---------------- UI ----------------

//   if (loading) {
//     return (
//       <p className="text-center mt-10">
//         Loading dashboard...
//       </p>
//     );
//   }

//   return (
//     <div className="p-6">

//       {/* HEADER */}

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold">
//           HOD Dashboard
//         </h1>

//         <p className="text-gray-500 text-sm">
//           Event management overview
//         </p>
//       </div>

//       {/* DATE FILTER */}

//       <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end">

//         <div>
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             className="border p-2 rounded"
//             onChange={(e) =>
//               setDateFilter({ ...dateFilter, from: e.target.value })
//             }
//           />
//         </div>

//         <div>
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             className="border p-2 rounded"
//             onChange={(e) =>
//               setDateFilter({ ...dateFilter, to: e.target.value })
//             }
//           />
//         </div>

//         <button
//           disabled={!dateFilter.from || !dateFilter.to}
//           onClick={fetchStats}
//           className={`px-4 py-2 rounded text-white
//             ${
//               dateFilter.from && dateFilter.to
//                 ? "bg-blue-600 hover:bg-blue-700"
//                 : "bg-gray-400 cursor-not-allowed"
//             }
//           `}
//         >
//           Apply Filter
//         </button>

//       </div>

//       {/* STATS CARDS */}

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

//         <StatCard title="Total Events" value={stats.total} />

//         <StatCard
//           title="Upcoming Events"
//           value={stats.upcoming}
//           color="text-orange-500"
//         />

//         <StatCard
//           title="Ongoing Events"
//           value={stats.ongoing}
//           color="text-green-600"
//         />

//         <StatCard
//           title="Completed Events"
//           value={stats.completed}
//           color="text-red-500"
//         />

//       </div>

//       {/* QUICK ACTIONS */}

//       <div className="bg-white shadow rounded p-6">

//         <h2 className="text-lg font-semibold mb-4">
//           Quick Actions
//         </h2>

//         <div className="flex flex-wrap gap-4">

//           <button
//             onClick={() => navigate("/hod/events/create")}
//             className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
//           >
//             ➕ Create Event
//           </button>

//           <button
//             onClick={() => navigate("/hod/manage-events")}
//             className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
//           >
//             📋 Manage Events
//           </button>

//         </div>

//       </div>

//       {/* STATUS BAR CHART */}

//       <div className="bg-white shadow rounded p-6 mt-8">

//         <h2 className="text-lg font-semibold mb-4">
//           Event Status Overview
//         </h2>

//         {stats.charts.statusChart.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No chart data available
//           </p>

//         ) : (

//           <ResponsiveContainer width="100%" height={300}>

//             <BarChart data={stats.charts.statusChart}>

//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />

//               <Bar dataKey="value" />

//             </BarChart>

//           </ResponsiveContainer>

//         )}

//       </div>

//       {/* MONTHLY TREND LINE CHART */}

//       <div className="bg-white shadow rounded p-6 mt-8">

//         <h2 className="text-lg font-semibold mb-4">
//           Monthly Event Creation Trend
//         </h2>

//         {stats.charts.monthlyChart.length === 0 ? (

//           <p className="text-center text-gray-400">
//             No trend data available
//           </p>

//         ) : (

//           <ResponsiveContainer width="100%" height={300}>

//             <LineChart data={stats.charts.monthlyChart}>

//               <XAxis dataKey="month" />
//               <YAxis />
//               <Tooltip />
//               <CartesianGrid strokeDasharray="3 3" />

//               <Line
//                 type="monotone"
//                 dataKey="count"
//               />

//             </LineChart>

//           </ResponsiveContainer>

//         )}

//       </div>

//       {/* EVENT PERFORMANCE RANKING */}

// <div className="bg-white shadow rounded p-6 mt-8">

//   <h2 className="text-lg font-semibold mb-4">
//     🔥 Top Performing Events
//   </h2>

//   {ranking.length === 0 ? (

//     <p className="text-center text-gray-400">
//       No ranking data available
//     </p>

//   ) : (

//     <div className="space-y-4">

//       {ranking.map((event, index) => (

//         <div
//           key={event._id}
//           className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
//         >

//           <div className="flex items-center gap-3">

//             <span className="font-bold text-lg">
//               #{index + 1}
//             </span>

//             {event.banner && (
//               <img
//                 src={`http://localhost:5000${event.banner}`}
//                 alt="banner"
//                 className="h-10 w-16 object-cover rounded"
//               />
//             )}

//             <div>
//               <p className="font-medium">
//                 {event.title}
//               </p>

//               <p className="text-xs text-gray-500">
//                 Registrations: {event.registrations}
//               </p>
//             </div>

//           </div>

//           <span className="text-green-600 font-semibold">
//             🔥 Popular
//           </span>

//         </div>

//       ))}

//     </div>

//   )}

// </div>


//     </div>
//   );
// };

// // ---------------- REUSABLE CARD COMPONENT ----------------

// const StatCard = ({ title, value, color }) => {
//   return (
//     <div className="bg-white shadow rounded p-5">
//       <p className="text-gray-500 text-sm">{title}</p>
//       <h2 className={`text-3xl font-bold mt-2 ${color || ""}`}>
//         {value}
//       </h2>
//     </div>
//   );
// };

// export default HODDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHodDashboardStats,
  getEventPerformanceRanking
} from "../../api/event.api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

const HODDashboard = () => {

  const navigate = useNavigate();

  // ---------------- STATE ----------------

  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: ""
  });

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

  // ---------------- FETCH DASHBOARD STATS ----------------

  const fetchStats = async () => {

    try {

      setLoading(true);

      const params = {};

      if (dateFilter.from && dateFilter.to) {
        params.from = dateFilter.from;
        params.to = dateFilter.to;
      }

      const res = await getHodDashboardStats(params);

      setStats(res.data);

    } catch (error) {

      console.error("Dashboard Stats Error:", error);

    } finally {

      setLoading(false);

    }

  };

  // ---------------- FETCH EVENT RANKING ----------------

  const fetchRanking = async () => {

    try {

      const res = await getEventPerformanceRanking();
      setRanking(res.data);

    } catch (error) {

      console.error("Ranking Error:", error);

    }

  };

  // ---------------- FIRST LOAD ----------------

  useEffect(() => {
    fetchStats();
    fetchRanking();
  }, []);

  // ---------------- AUTO FILTER REFRESH ----------------

  useEffect(() => {

    if (dateFilter.from && dateFilter.to) {
      fetchStats();
    }

  }, [dateFilter]);

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          HOD Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Event management overview
        </p>
      </div>

      {/* ================= DATE FILTER ================= */}

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4 items-end">

        <div>
          <label className="text-sm">From</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter({
                ...dateFilter,
                from: e.target.value
              })
            }
          />
        </div>

        <div>
          <label className="text-sm">To</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter({
                ...dateFilter,
                to: e.target.value
              })
            }
          />
        </div>

        <button
          disabled={!dateFilter.from || !dateFilter.to}
          className={`px-4 py-2 rounded text-white
            ${
              dateFilter.from && dateFilter.to
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }
          `}
        >
          Apply Filter
        </button>

      </div>

      {/* ================= STATS CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <StatCard title="Total Events" value={stats.total} />

        <StatCard
          title="Upcoming Events"
          value={stats.upcoming}
          color="text-orange-500"
        />

        <StatCard
          title="Ongoing Events"
          value={stats.ongoing}
          color="text-green-600"
        />

        <StatCard
          title="Completed Events"
          value={stats.completed}
          color="text-red-500"
        />

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="bg-white shadow rounded p-6">

        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/hod/events/create")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            ➕ Create Event
          </button>

          <button
            onClick={() => navigate("/hod/manage-events")}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            📋 Manage Events
          </button>

        </div>

      </div>

      {/* ================= STATUS CHART ================= */}

      <div className="bg-white shadow rounded p-6 mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Event Status Overview
        </h2>

        {stats.charts.statusChart.length === 0 ? (

          <p className="text-center text-gray-400">
            No chart data available
          </p>

        ) : (

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.charts.statusChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>

        )}

      </div>

      {/* ================= MONTHLY TREND ================= */}

      <div className="bg-white shadow rounded p-6 mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Monthly Event Creation Trend
        </h2>

        {stats.charts.monthlyChart.length === 0 ? (

          <p className="text-center text-gray-400">
            No trend data available
          </p>

        ) : (

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.charts.monthlyChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" />
            </LineChart>
          </ResponsiveContainer>

        )}

      </div>

      {/* ================= EVENT PERFORMANCE RANKING ================= */}

      <div className="bg-white shadow rounded p-6 mt-8">

        <h2 className="text-lg font-semibold mb-4">
          🔥 Top Performing Events
        </h2>

        {ranking.length === 0 ? (

          <p className="text-center text-gray-400">
            No ranking data available
          </p>

        ) : (

          <div className="space-y-4">

            {ranking.map((event, index) => (

              <div
                key={event._id}
                className="flex items-center justify-between border p-3 rounded hover:bg-gray-50"
              >

                <div className="flex items-center gap-3">

                  <span className="font-bold text-lg">
                    #{index + 1}
                  </span>

                  {event.banner && (
                    <img
                      src={`http://localhost:5000${event.banner}`}
                      alt="banner"
                      className="h-10 w-16 object-cover rounded"
                    />
                  )}

                  <div>
                    <p className="font-medium">
                      {event.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      Registrations: {event.registrations}
                    </p>
                  </div>

                </div>

                <span className="text-green-600 font-semibold">
                  🔥 Popular
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

// ---------------- REUSABLE STAT CARD ----------------

const StatCard = ({ title, value, color }) => {
  return (
    <div className="bg-white shadow rounded p-5">
      <p className="text-gray-500 text-sm">
        {title}
      </p>
      <h2 className={`text-3xl font-bold mt-2 ${color || ""}`}>
        {value}
      </h2>
    </div>
  );
};

export default HODDashboard;
