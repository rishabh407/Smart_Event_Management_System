import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentDashboardStats } from "../../api/registeration.api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getStudentDashboardStats();
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  const registrationStatusData = [
    { name: "Active", value: stats?.activeRegistrations || 0, color: "#10B981" },
    { name: "Attended", value: stats?.attendedRegistrations || 0, color: "#3B82F6" },
    { name: "Cancelled", value: stats?.cancelledRegistrations || 0, color: "#EF4444" }
  ];

  const chartData = [
    { name: "Total", value: stats?.totalRegistrations || 0 },
    { name: "Active", value: stats?.activeRegistrations || 0 },
    { name: "Attended", value: stats?.attendedRegistrations || 0 }
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-full overflow-x-hidden">

      {/* ================= HEADER ================= */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Student Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Welcome! Here's your activity overview
        </p>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon="📋"
          color="bg-blue-500"
        />
        <StatCard
          title="Active"
          value={stats?.activeRegistrations || 0}
          icon="🟢"
          color="bg-green-500"
        />
        <StatCard
          title="Attended"
          value={stats?.attendedRegistrations || 0}
          icon="✅"
          color="bg-teal-500"
        />
        <StatCard
          title="Cancelled"
          value={stats?.cancelledRegistrations || 0}
          icon="❌"
          color="bg-red-500"
        />
        <StatCard
          title="Certificates"
          value={stats?.certificatesCount || 0}
          icon="🎓"
          color="bg-purple-500"
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
          Quick Actions
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <button
            onClick={() => navigate("/student/events")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            📅 Browse Events
          </button>

          <button
            onClick={() => navigate("/student/registrations")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            📋 My Registrations
          </button>

          <button
            onClick={() => navigate("/student/certificates")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg w-full sm:w-auto"
          >
            🎓 My Certificates
          </button>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

        {/* PIE CHART */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
            Registration Status
          </h2>

          {registrationStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={registrationStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {registrationStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-16">
              No registrations yet
            </p>
          )}
        </div>

        {/* BAR CHART */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
            Registration Overview
          </h2>

          {chartData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-16">
              No data available
            </p>
          )}
        </div>

      </div>

    </div>
  );
};

// ================= STAT CARD COMPONENT =================

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
            {title}
          </p>

          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
            {value}
          </h2>
        </div>

        <div className={`${color} text-white rounded-full p-3 sm:p-4 text-xl sm:text-2xl`}>
          {icon}
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
