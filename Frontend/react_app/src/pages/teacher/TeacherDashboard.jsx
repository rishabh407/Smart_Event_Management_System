import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherDashboardStats } from "../../api/teacher.api";
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

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getTeacherDashboardStats();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const competitionStatusData = [
    { name: "Upcoming", value: stats?.upcomingCompetitions || 0, color: "#F59E0B" },
    { name: "Ongoing", value: stats?.ongoingCompetitions || 0, color: "#10B981" },
    { name: "Completed", value: stats?.completedCompetitions || 0, color: "#EF4444" }
  ];

  const attendanceData = [
    { name: "Attended", value: stats?.attendedRegistrations || 0 },
    { name: "Total Registered", value: stats?.totalRegistrations || 0 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your assigned competitions and activities</p>
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
          title="Upcoming"
          value={stats?.upcomingCompetitions || 0}
          icon="⏰"
          color="bg-orange-500"
        />
        <StatCard
          title="Ongoing"
          value={stats?.ongoingCompetitions || 0}
          icon="🟢"
          color="bg-green-500"
        />
        <StatCard
          title="Completed"
          value={stats?.completedCompetitions || 0}
          icon="✅"
          color="bg-purple-500"
        />
      </div>

      {/* ================= SECOND ROW STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon="👥"
          color="bg-indigo-500"
        />
        <StatCard
          title="Attended"
          value={stats?.attendedRegistrations || 0}
          icon="✓"
          color="bg-teal-500"
        />
        <StatCard
          title="Attendance Marked"
          value={stats?.totalAttendance || 0}
          icon="📝"
          color="bg-pink-500"
        />
        <StatCard
          title="Certificates Generated"
          value={stats?.certificatesGenerated || 0}
          icon="🎓"
          color="bg-yellow-500"
        />
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/teacher/competitions")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            📋 View Assigned Competitions
          </button>
          <button
            onClick={() => navigate("/teacher/attendance")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            📝 Mark Attendance
          </button>
          <button
            onClick={() => navigate("/teacher/results")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            🏆 Declare Results
          </button>
          <button
            onClick={() => navigate("/teacher/certificates")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            🎓 Generate Certificates
          </button>
        </div>
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competition Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Competition Status</h2>
          {competitionStatusData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={competitionStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {competitionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 py-20">No data available</p>
          )}
        </div>

        {/* Attendance Overview Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Attendance Overview</h2>
          {attendanceData.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
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

export default TeacherDashboard;
