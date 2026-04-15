// import { useEffect, useState } from "react";
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

// import {
//   FaChartBar,
//   FaHourglassStart,
//   FaPlayCircle,
//   FaCheckCircle,
//   FaCalendarAlt
// } from "react-icons/fa";




// const getLastMonthRange = () => {

//   const now = new Date();

//   const firstDayLastMonth = new Date(
//     now.getFullYear(),
//     now.getMonth() - 1,
//     1
//   );

//   const lastDayLastMonth = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     0
//   );

//   return {
//     from: firstDayLastMonth.toISOString().split("T")[0],
//     to: lastDayLastMonth.toISOString().split("T")[0]
//   };

// };




// const HODDashboard = () => {

//   const lastMonth = getLastMonthRange();

//   const [tempFilter, setTempFilter] = useState(lastMonth);
//   const [dateFilter, setDateFilter] = useState(lastMonth);

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


 

//   const fetchStats = async () => {

//     try {

//       setLoading(true);

//       const res = await getHodDashboardStats(dateFilter);

//       setStats(res.data);

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to load dashboard data");

//     } finally {

//       setLoading(false);

//     }

//   };


 

//   const fetchRanking = async () => {

//     try {

//       const res = await getEventPerformanceRanking(dateFilter);

//       setRanking(res.data);

//     } catch (error) {

//       console.error(error);

//     }

//   };


 

//   useEffect(() => {

//     fetchStats();
//     fetchRanking();

//   }, [dateFilter]);


 

//   const handleApplyFilter = () => {

//     if (!tempFilter.from || !tempFilter.to) return;

//     if (new Date(tempFilter.from) > new Date(tempFilter.to)) {

//       toast.error("From date must be before To date");
//       return;

//     }

//     setDateFilter(tempFilter);

//   };


 

//   const handleClearFilter = () => {

//     const lastMonth = getLastMonthRange();

//     setTempFilter(lastMonth);
//     setDateFilter(lastMonth);

//   };


 

//   if (loading) {

//     return (

//       <div className="flex items-center justify-center min-h-[300px]">

//         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>

//       </div>

//     );

//   }


//   return (

//     <div className="p-4 md:p-6 space-y-6">


//       <div>

//         <h1 className="text-2xl md:text-3xl font-bold">
//           HOD Dashboard
//         </h1>

//         <p className="text-gray-600">
//           Department event analytics overview
//         </p>

//       </div>



//       <div className="bg-white p-4 md:p-6 rounded-lg shadow">

//         <h2 className="font-semibold mb-4 flex items-center gap-2">
//           <FaCalendarAlt />
//           Filter by Date
//         </h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           <input
//             type="date"
//             className="border rounded px-3 py-2"
//             value={tempFilter.from}
//             onChange={(e) =>
//               setTempFilter({
//                 ...tempFilter,
//                 from: e.target.value
//               })
//             }
//           />

//           <input
//             type="date"
//             className="border rounded px-3 py-2"
//             value={tempFilter.to}
//             onChange={(e) =>
//               setTempFilter({
//                 ...tempFilter,
//                 to: e.target.value
//               })
//             }
//           />

//           <button
//             onClick={handleApplyFilter}
//             className="bg-blue-600 hover:bg-blue-700 text-white rounded font-medium py-2"
//           >
//             Apply
//           </button>

//           <button
//             onClick={handleClearFilter}
//             className="bg-gray-200 hover:bg-gray-300 rounded font-medium py-2"
//           >
//             Clear
//           </button>

//         </div>

//       </div>


      
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//         <StatCard title="Total Events" value={stats.total} icon={<FaChartBar />} />

//         <StatCard title="Upcoming" value={stats.upcoming} icon={<FaHourglassStart />} />

//         <StatCard title="Ongoing" value={stats.ongoing} icon={<FaPlayCircle />} />

//         <StatCard title="Completed" value={stats.completed} icon={<FaCheckCircle />} />

//       </div>



//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


//         <div className="bg-white p-4 rounded shadow h-[280px] md:h-[320px]">

//           {stats.charts.statusChart.length === 0 ? (

//             <p className="text-center text-gray-400 py-20">
//               No status data available
//             </p>

//           ) : (

//             <ResponsiveContainer width="100%" height="100%">

//               <BarChart data={stats.charts.statusChart}>

//                 <CartesianGrid strokeDasharray="3 3" />

//                 <XAxis dataKey="name" />

//                 <YAxis />

//                 <Tooltip />

//                 <Legend />

//                 <Bar dataKey="value" fill="#2563eb" />

//               </BarChart>

//             </ResponsiveContainer>

//           )}

//         </div>



//         <div className="bg-white p-4 rounded shadow h-[280px] md:h-[320px]">

//           {stats.charts.monthlyChart.length === 0 ? (

//             <p className="text-center text-gray-400 py-20">
//               No monthly trend data
//             </p>

//           ) : (

//             <ResponsiveContainer width="100%" height="100%">

//               <LineChart data={stats.charts.monthlyChart}>

//                 <CartesianGrid strokeDasharray="3 3" />

//                 <XAxis dataKey="month" />

//                 <YAxis />

//                 <Tooltip />

//                 <Legend />

//                 <Line dataKey="count" stroke="#10b981" />

//               </LineChart>

//             </ResponsiveContainer>

//           )}

//         </div>

//       </div>



//       <div className="bg-white p-4 rounded shadow">

//         <h2 className="font-semibold mb-4">
//           🏆 Top Performing Events
//         </h2>

//         {ranking.length === 0 ? (

//           <p className="text-gray-400 text-center py-6">
//             No event participation yet
//           </p>

//         ) : (

//           <div className="space-y-3">

//             {ranking.map((event, index) => (

//               <div
//                 key={event._id}
//                 className="flex justify-between border-b pb-2"
//               >

//                 <span>

//                   {index + 1}. {event.name}

//                 </span>

//                 <span className="font-semibold">

//                   {event.participants} participants

//                 </span>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>

//   );

// };




// const StatCard = ({ title, value, icon }) => {

//   return (

//     <div className="bg-white rounded shadow p-4 flex justify-between items-center">

//       <div>

//         <p className="text-gray-600 text-sm">
//           {title}
//         </p>

//         <h2 className="text-xl md:text-2xl font-bold">
//           {value}
//         </h2>

//       </div>

//       <span className="text-2xl text-blue-600">
//         {icon}
//       </span>

//     </div>

//   );

// };


// export default HODDashboard;
import { useEffect, useState } from "react";
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

import {
  FaChartBar,
  FaHourglassStart,
  FaPlayCircle,
  FaCheckCircle,
  FaCalendarAlt
} from "react-icons/fa";


// ✅ CURRENT MONTH FUNCTION
const getCurrentMonthRange = () => {
  const now = new Date();

  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  );

  return {
    from: firstDay.toISOString().split("T")[0],
    to: lastDay.toISOString().split("T")[0]
  };
};


const HODDashboard = () => {

  // ✅ Use current month
  const currentMonth = getCurrentMonthRange();

  const [tempFilter, setTempFilter] = useState(currentMonth);
  const [dateFilter, setDateFilter] = useState(currentMonth);

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


  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getHodDashboardStats(dateFilter);
      setStats(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };


  const fetchRanking = async () => {
    try {
      const res = await getEventPerformanceRanking(dateFilter);
      setRanking(res.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchStats();
    fetchRanking();
  }, [dateFilter]);


  const handleApplyFilter = () => {
    if (!tempFilter.from || !tempFilter.to) return;

    if (new Date(tempFilter.from) > new Date(tempFilter.to)) {
      toast.error("From date must be before To date");
      return;
    }

    setDateFilter(tempFilter);
  };


  // ✅ Clear → reset to CURRENT MONTH
  const handleClearFilter = () => {
    const currentMonth = getCurrentMonthRange();
    setTempFilter(currentMonth);
    setDateFilter(currentMonth);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="p-4 md:p-6 space-y-6">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          HOD Dashboard
        </h1>
        <p className="text-gray-600">
          Department event analytics overview
        </p>
      </div>


      {/* FILTER */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt />
          Filter by Date
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={tempFilter.from}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                from: e.target.value
              })
            }
          />

          <input
            type="date"
            className="border rounded px-3 py-2"
            value={tempFilter.to}
            onChange={(e) =>
              setTempFilter({
                ...tempFilter,
                to: e.target.value
              })
            }
          />

          <button
            onClick={handleApplyFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded font-medium py-2"
          >
            Apply
          </button>

          <button
            onClick={handleClearFilter}
            className="bg-gray-200 hover:bg-gray-300 rounded font-medium py-2"
          >
            Clear
          </button>

        </div>
      </div>


      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard title="Total Events" value={stats.total} icon={<FaChartBar />} />
        <StatCard title="Upcoming" value={stats.upcoming} icon={<FaHourglassStart />} />
        <StatCard title="Ongoing" value={stats.ongoing} icon={<FaPlayCircle />} />
        <StatCard title="Completed" value={stats.completed} icon={<FaCheckCircle />} />

      </div>


      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded shadow h-[300px]">

          {stats.charts.statusChart.length === 0 ? (
            <p className="text-center text-gray-400 py-20">
              No status data available
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.charts.statusChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}

        </div>


        <div className="bg-white p-4 rounded shadow h-[300px]">

          {stats.charts.monthlyChart.length === 0 ? (
            <p className="text-center text-gray-400 py-20">
              No monthly trend data
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.charts.monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="count" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          )}

        </div>

      </div>


      {/* RANKING */}
      <div className="bg-white p-4 rounded shadow">

        <h2 className="font-semibold mb-4">
          🏆 Top Performing Events
        </h2>

        {ranking.length === 0 ? (
          <p className="text-gray-400 text-center py-6">
            No event participation yet
          </p>
        ) : (
          <div className="space-y-3">
            {ranking.map((event, index) => (
              <div key={event._id} className="flex justify-between border-b pb-2">
                <span>{index + 1}. {event.name}</span>
                <span className="font-semibold">
                  {event.participants} participants
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};


const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded shadow p-4 flex justify-between items-center">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h2 className="text-xl md:text-2xl font-bold">{value}</h2>
      </div>
      <span className="text-2xl text-blue-600">{icon}</span>
    </div>
  );
};


export default HODDashboard;