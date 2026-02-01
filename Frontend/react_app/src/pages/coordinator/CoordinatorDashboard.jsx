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

  // ================= LOADING UI =================

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

  // ================= CHART DATA =================

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

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Coordinator Dashboard
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Overview of competitions and registrations
          </p>
        </div>

      </div>

      {/* ================= STATS CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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

      {/* ================= QUICK ACTION ================= */}

      <div className="bg-white rounded-lg shadow-md p-5">

        <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
          Quick Actions
        </h2>

        <button
          onClick={() => navigate("/coordinator/events")}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition shadow"
        >
          📅 View My Events
        </button>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* COMPETITIONS CHART */}

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">

          <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
            Competitions Overview
          </h2>

          {chartData.some(d => d.value > 0) ? (

            <div className="w-full h-[260px] md:h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={chartData}>

                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />

                </BarChart>

              </ResponsiveContainer>

            </div>

          ) : (
            <p className="text-center text-gray-400 py-16">
              No data available
            </p>
          )}

        </div>

        {/* REGISTRATION CHART */}

        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">

          <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
            Registrations Overview
          </h2>

          {registrationData.some(d => d.value > 0) ? (

            <div className="w-full h-[260px] md:h-[300px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={registrationData}>

                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} />

                </BarChart>

              </ResponsiveContainer>

            </div>

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

// ================= STAT CARD =================

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

        <div className={`${color} text-white rounded-full p-3 md:p-4 text-xl md:text-2xl`}>
          {icon}
        </div>

      </div>

    </div>
  );
};

export default CoordinatorDashboard;
