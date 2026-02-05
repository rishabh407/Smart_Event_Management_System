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
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Loading dashboard...</p>
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
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Overview of your assigned competitions and activities
        </p>
      </div>

      {/* ================= STAT CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard title="Total Competitions" value={stats?.totalCompetitions || 0} icon="📋" color="bg-blue-500" />
        <StatCard title="Upcoming" value={stats?.upcomingCompetitions || 0} icon="⏰" color="bg-orange-500" />
        <StatCard title="Ongoing" value={stats?.ongoingCompetitions || 0} icon="🟢" color="bg-green-500" />
        <StatCard title="Completed" value={stats?.completedCompetitions || 0} icon="✅" color="bg-purple-500" />

      </div>

      {/* ================= SECOND ROW ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard title="Total Registrations" value={stats?.totalRegistrations || 0} icon="👥" color="bg-indigo-500" />
        <StatCard title="Attended" value={stats?.attendedRegistrations || 0} icon="✓" color="bg-teal-500" />
        <StatCard title="Attendance Marked" value={stats?.totalAttendance || 0} icon="📝" color="bg-pink-500" />
        <StatCard title="Certificates Generated" value={stats?.certificatesGenerated || 0} icon="🎓" color="bg-yellow-500" />

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <ActionButton label="📋 Competitions" onClick={() => navigate("/teacher/events")} color="indigo" />
          <ActionButton label="📝 Attendance" onClick={() => navigate("/teacher/attendance")} color="green" />
          <ActionButton label="🏆 Results" onClick={() => navigate("/teacher/results")} color="blue" />
          <ActionButton label="🎓 Certificates" onClick={() => navigate("/teacher/certificates")} color="purple" />

        </div>

      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE */}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Competition Status
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={competitionStatusData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {competitionStatusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

        </div>

        {/* BAR */}

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">

          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Attendance Overview
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

// ================= STAT CARD =================

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h2 className="text-xl sm:text-2xl font-bold mt-1">{value}</h2>
      </div>
      <div className={`${color} text-white rounded-full p-3 text-xl`}>
        {icon}
      </div>
    </div>
  </div>
);

// ================= ACTION BUTTON =================

const ActionButton = ({ label, onClick, color }) => {

  const colors = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    purple: "bg-purple-600 hover:bg-purple-700"
  };

  return (
    <button
      onClick={onClick}
      className={`${colors[color]} text-white py-2.5 rounded-lg font-medium shadow transition`}
    >
      {label}
    </button>
  );
};

export default TeacherDashboard;
