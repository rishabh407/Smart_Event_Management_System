import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordinatorDashboardStats } from "../../api/competition.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CoordinatorDashboard = () => {

  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {

    try {

      setLoading(true);
      setError(null);

      const res = await getCoordinatorDashboardStats();

      setStats(res.data);
      setLastUpdated(new Date());

    } catch (err) {

      console.error("Dashboard Error:", err);
      setError("Failed to load dashboard data.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 60000);

    return () => clearInterval(interval);

  }, []);

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[300px]">

        <div className="text-center">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>

          <p className="mt-3 text-gray-600 text-sm">
            Loading dashboard...
          </p>

        </div>

      </div>

    );

  }

  if (error) {

    return (

      <div className="flex flex-col items-center justify-center min-h-[300px] text-center">

        <p className="text-red-500 mb-4">{error}</p>

        <button
          onClick={fetchStats}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Retry
        </button>

      </div>

    );

  }

  const chartData = [
    { name: "Total", value: stats?.totalCompetitions || 0 },
    { name: "Published", value: stats?.publishedCompetitions || 0 }
  ];

  const registrationData = [
    { name: "Total", value: stats?.totalRegistrations || 0 },
    { name: "Active", value: stats?.activeRegistrations || 0 }
  ];

  return (

    <div className="space-y-6">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Coordinator Dashboard
          </h1>

          <p className="text-gray-600 text-sm md:text-base">
            Overview of competitions and registrations
          </p>

          {lastUpdated && (

            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>

          )}

        </div>

        <button
          onClick={fetchStats}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
        >
          🔄 Refresh
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <StatCard
          title="Total Competitions"
          value={stats?.totalCompetitions || 0}
          icon="📋"
          color="bg-blue-500"
        />

        <StatCard
          title="Published"
          value={stats?.publishedCompetitions || 0}
          icon="✅"
          color="bg-green-500"
        />

        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon="👥"
          color="bg-indigo-500"
        />

        <StatCard
          title="Active Registrations"
          value={stats?.activeRegistrations || 0}
          icon="🟢"
          color="bg-teal-500"
        />

        <StatCard
          title="Assigned Events"
          value={stats?.totalEvents || 0}
          icon="🎪"
          color="bg-purple-500"
        />

      </div>

      <div className="bg-white rounded-lg shadow-md p-5">

        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => navigate("/coordinator/events")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
          >
            📅 My Events
          </button>

          <button
            onClick={() => navigate("/coordinator/results")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow"
          >
            🏆 View Results
          </button>

        </div>

      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <ChartCard
          title="Competitions Overview"
          data={chartData}
          color="#10B981"
        />

        <ChartCard
          title="Registrations Overview"
          data={registrationData}
          color="#6366F1"
        />

      </div>

    </div>

  );

};

const ChartCard = ({ title, data, color }) => {

  return (

    <div className="bg-white rounded-lg shadow-md p-5">

      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h2>

      {data.some(d => d.value > 0) ? (

        <div className="w-full h-[280px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={data}>

              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill={color} radius={[6,6,0,0]} />

            </BarChart>

          </ResponsiveContainer>

        </div>

      ) : (

        <div className="text-center text-gray-400 py-14">

          <div className="text-4xl mb-2">📊</div>

          <p>No data available yet</p>

        </div>

      )}

    </div>

  );

};


const StatCard = ({ title, value, icon, color }) => {

  return (

    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-600 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {value}
          </h2>

        </div>

        <div className={`${color} text-white rounded-full p-3 text-xl`}>
          {icon}
        </div>

      </div>

    </div>

  );

};

export default CoordinatorDashboard;