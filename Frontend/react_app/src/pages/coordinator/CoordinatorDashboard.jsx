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

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getCoordinatorDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
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
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Coordinator Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of competitions and registrations</p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/coordinator/events")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            📅 View My Events
          </button>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitions Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Competitions Overview</h2>
          {chartData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-20">No data available</p>
          )}
        </div>

        {/* Registrations Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrations Overview</h2>
          {registrationData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-20">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ================= STAT CARD COMPONENT =================
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2>
        </div>
        <div className={`${color} text-white rounded-full p-4 text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
