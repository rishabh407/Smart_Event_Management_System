import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { getCompetitionRegistrationStats } from "../../api/registeration.api";

const Attendance = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // ================= FETCH COMPETITIONS =================

  const fetchCompetitions = async () => {
    try {

      const res = await getinchargeteacherscompetitions();
      setCompetitions(res.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  // ================= FETCH TOTAL REGISTRATIONS =================

  const fetchStats = async (id) => {
    try {

      const res = await getCompetitionRegistrationStats(id);

      setStats(prev => ({
        ...prev,
        [id]: res.data
      }));

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    fetchCompetitions();

  }, []);

  useEffect(() => {

    competitions.forEach(c => fetchStats(c._id));

  }, [competitions]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        Loading competitions...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Attendance Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {competitions.map((competition) => {

          const now = new Date();
          const startTime = new Date(competition.startTime);
          const endTime = new Date(competition.endTime);

          const isActive = now >= startTime && now <= endTime;
          const isUpcoming = now < startTime;
          const isCompleted = now > endTime;

          const total = stats[competition._id]?.total || 0;

          return (

            <div
              key={competition._id}
              className="bg-white rounded-lg shadow-md p-6 border"
            >

              {/* HEADER */}

              <div className="flex justify-between mb-3">

                <h3 className="font-bold">
                  {competition.name}
                </h3>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
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

              {/* TOTAL REGISTRATION */}

              <p className="text-sm mb-4">
                👥 Total Registered:
                <span className="font-bold ml-1">
                  {total}
                </span>
              </p>

              {/* ACTION BUTTONS */}

              <div className="flex gap-3">

                {/* SHOW QR */}

                {isActive && (

                  <button
                    onClick={() =>
                      navigate(`/teacher/attendance/${competition._id}`)
                    }
                    className="flex-1 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    📱 Show QR
                  </button>

                )}

                {/* VIEW ATTENDANCE */}

                {(isActive || isCompleted) && (

                  <button
                    onClick={() =>
                      navigate(`/teacher/attendance/view/${competition._id}`)
                    }
                    className="flex-1 py-2 rounded bg-gray-800 hover:bg-black text-white"
                  >
                    📊 View Attendance
                  </button>

                )}

                {/* UPCOMING */}

                {isUpcoming && (

                  <button
                    disabled
                    className="flex-1 py-2 rounded bg-gray-300 text-gray-500"
                  >
                    ⏳ Not Started
                  </button>

                )}

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Attendance;
