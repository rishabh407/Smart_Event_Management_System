import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import { getCompetitionRegistrationStats } from "../../api/registeration.api";

const Attendance = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("LIVE");

  // ================= FETCH COMPETITIONS =================

  const fetchCompetitions = async () => {

    try {

      const res = await getAllAssignedCompetitions();
      setCompetitions(res.data || []);

    } catch (error) {

      console.error("Competition Fetch Error:", error);

    } finally {

      setLoading(false);

    }

  };

  // ================= FETCH STATS =================

  const fetchStats = async (competitionId) => {

    try {

      const res = await getCompetitionRegistrationStats(competitionId);

      setStats(prev => ({
        ...prev,
        [competitionId]: res.data
      }));

    } catch (error) {

      console.error("Stats Fetch Error:", error);

    }

  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // ================= AUTO REFRESH STATS =================

  useEffect(() => {

    if (competitions.length === 0) return;

    const fetchAllStats = () => {

      const now = new Date();

      competitions.forEach(comp => {

        const startTime = new Date(comp.startTime);

        if (now >= startTime) {
          fetchStats(comp._id);
        }

      });

    };

    fetchAllStats();

    const interval = setInterval(fetchAllStats, 30000); // 30 seconds refresh

    return () => clearInterval(interval);

  }, [competitions]);

  // ================= FILTER LOGIC =================

  const filteredCompetitions = competitions.filter(comp => {

    const now = new Date();
    const startTime = new Date(comp.startTime);
    const endTime = new Date(comp.endTime);

    if (activeTab === "LIVE") {
      return now >= startTime && now <= endTime;
    }

    if (activeTab === "UPCOMING") {
      return now < startTime;
    }

    if (activeTab === "COMPLETED") {
      return now > endTime;
    }

    return true;

  });

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500 animate-pulse">
          Loading attendance dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Attendance Management
      </h1>

      {/* ================= TABS ================= */}

      <div className="flex gap-3 mb-6">

        {["LIVE", "UPCOMING", "COMPLETED"].map(tab => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-semibold
            ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {/* ================= EMPTY STATE ================= */}

      {filteredCompetitions.length === 0 && (

        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No competitions found in this category.
          </p>
        </div>

      )}

      {/* ================= GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCompetitions.map((competition) => {

          const now = new Date();
          const startTime = new Date(competition.startTime);
          const endTime = new Date(competition.endTime);

          const isActive = now >= startTime && now <= endTime;
          const isUpcoming = now < startTime;

          const totalRegistered =
            stats[competition._id]?.totalRegistered || 0;

          const present =
            stats[competition._id]?.present || 0;

          const percentage =
            totalRegistered > 0
              ? Math.round((present / totalRegistered) * 100)
              : 0;

          return (

            <div
              key={competition._id}
              className="bg-white rounded-lg shadow p-5 border hover:shadow-lg transition"
            >

              <div className="flex justify-between items-center mb-3">

                <h3 className="font-bold text-lg truncate">
                  {competition.name}
                </h3>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : isUpcoming
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isActive
                    ? "LIVE"
                    : isUpcoming
                    ? "UPCOMING"
                    : "COMPLETED"}
                </span>

              </div>

              <p className="text-sm mb-1">
                👥 Registered:
                <span className="font-semibold ml-1">
                  {totalRegistered}
                </span>
              </p>

              <p className="text-sm mb-3">
                ✅ Present:
                <span className="font-semibold ml-1">
                  {present}
                </span>
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Attendance Rate: {percentage}%
              </p>

              <div className="flex gap-2">

                <button
                  disabled={!isActive}
                  onClick={() =>
                    navigate(`/teacher/attendance/${competition._id}`)
                  }
                  className={`flex-1 py-2 rounded text-sm text-white
                  ${
                    isActive
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  📝 Take
                </button>

                <button
                  disabled={isUpcoming}
                  onClick={() =>
                    navigate(`/teacher/attendance/view/${competition._id}`)
                  }
                  className={`flex-1 py-2 rounded text-sm
                  ${
                    isUpcoming
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gray-800 hover:bg-black text-white"
                  }`}
                >
                  📊 View
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Attendance;
