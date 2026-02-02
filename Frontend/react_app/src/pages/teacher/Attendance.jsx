import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import { getCompetitionRegistrationStats } from "../../api/registeration.api";

const Attendance = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

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

  // ================= LOAD DATA =================

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {

    if (competitions.length > 0) {

      competitions.forEach(comp => {
        fetchStats(comp._id);
      });

    }

  }, [competitions]);

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

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Attendance Management
      </h1>

      {/* ================= EMPTY STATE ================= */}

      {competitions.length === 0 && (

        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No assigned competitions found.
          </p>
        </div>

      )}

      {/* ================= COMPETITION GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {competitions.map((competition) => {

          const now = new Date();
          const startTime = new Date(competition.startTime);
          const endTime = new Date(competition.endTime);

          const isActive = now >= startTime && now <= endTime;
          const isUpcoming = now < startTime;
          const isCompleted = now > endTime;

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

              {/* ================= HEADER ================= */}

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

              {/* ================= ATTENDANCE INFO ================= */}

              <p className="text-sm text-gray-700 mb-1">
                👥 Registered:
                <span className="font-semibold ml-1">
                  {totalRegistered}
                </span>
              </p>

              <p className="text-sm text-gray-700 mb-3">
                ✅ Present:
                <span className="font-semibold ml-1">
                  {present}
                </span>
              </p>

              {/* ================= PROGRESS BAR ================= */}

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Attendance Rate: {percentage}%
              </p>

              {/* ================= ACTION BUTTONS ================= */}

              <div className="flex flex-wrap gap-3">

                {/* TAKE ATTENDANCE */}

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
                  📝 Take Attendance
                </button>

                {/* VIEW ATTENDANCE */}

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
                  📊 View Attendance
                </button>

                {/* VIEW REGISTRATIONS */}

                <button
                  onClick={() =>
                    navigate(`/teacher/registrations/${competition._id}`)
                  }
                  className="flex-1 py-2 rounded text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  👥 Registrations
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
