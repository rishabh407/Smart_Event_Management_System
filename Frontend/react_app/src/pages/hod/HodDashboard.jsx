import { useEffect, useState, useRef } from "react";
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

  // ================= FILTER STATES =================

  const [tempFilter, setTempFilter] = useState({
    from: "",
    to: ""
  });

  const [dateFilter, setDateFilter] = useState({
    from: "",
    to: ""
  });

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

      // prevent re-fetch on reset
      if (
        !dateFilter.from &&
        !dateFilter.to &&
        originalStatsRef.current
      ) {
        return;
      }

      setLoading(true);

      const params = {};

      if (dateFilter.from && dateFilter.to) {
        params.from = dateFilter.from;
        params.to = dateFilter.to;
      }

      const res = await getHodDashboardStats(params);

      // Save default snapshot once
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
      toast.error("Failed to load dashboard data");
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

    setDateFilter(tempFilter);
  };

  // ================= RESET FILTER =================

  const handleResetFilter = () => {

    const empty = { from: "", to: "" };

    setTempFilter(empty);
    setDateFilter(empty);

    // Restore cached data instantly
    if (originalStatsRef.current) {
      setStats(originalStatsRef.current);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          HOD Dashboard
        </h1>
        <p className="text-gray-600">
          Event management overview
        </p>
      </div>

      {/* ================= DATE FILTER ================= */}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-6">

        <h2 className="font-semibold mb-4">
          📅 Filter by Date
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
            disabled={!tempFilter.from || !tempFilter.to}
            className={`rounded text-white font-medium ${
              tempFilter.from && tempFilter.to
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Apply
          </button>

          {(tempFilter.from || tempFilter.to) && (
            <button
              onClick={handleResetFilter}
              className="rounded bg-gray-200 hover:bg-gray-300"
            >
              Reset
            </button>
          )}

        </div>
      </div>

      {/* ================= STATS CARDS ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <StatCard title="Total Events" value={stats.total} icon="📊" />
        <StatCard title="Upcoming" value={stats.upcoming} icon="⏳" />
        <StatCard title="Ongoing" value={stats.ongoing} icon="🟢" />
        <StatCard title="Completed" value={stats.completed} icon="✅" />

      </div>

      {/* ================= STATUS CHART ================= */}

      <div className="bg-white p-4 rounded shadow mb-6">

        {stats.charts.statusChart.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No chart data available
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 640 ? 220 : 300}
          >
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

      {/* ================= MONTHLY TREND ================= */}

      <div className="bg-white p-4 rounded shadow">

        {stats.charts.monthlyChart.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No monthly trend data
          </p>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={window.innerWidth < 640 ? 220 : 300}
          >
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
  );
};

// ================= STAT CARD =================

const StatCard = ({ title, value, icon }) => {

  return (
    <div className="bg-white rounded shadow p-4 flex justify-between items-center">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <h2 className="text-xl md:text-2xl font-bold">
          {value}
        </h2>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  );
};

export default HODDashboard;
