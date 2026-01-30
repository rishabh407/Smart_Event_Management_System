import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";

const Attendance = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getinchargeteacherscompetitions();
      setCompetitions(res.data);
    } catch (error) {
      console.error("Error fetching competitions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Select a competition to mark attendance for students</p>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {competitions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No competitions assigned yet.</p>
          <p className="text-gray-400 text-sm mt-2">
            Competitions will appear here once a coordinator assigns you to them.
          </p>
        </div>
      )}

      {/* ================= COMPETITION CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => {
          const now = new Date();
          const startTime = new Date(competition.startTime);
          const endTime = new Date(competition.endTime);
          const isActive = now >= startTime && now <= endTime;
          const isUpcoming = now < startTime;
          const isCompleted = now > endTime;

          return (
            <div
              key={competition._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{competition.name}</h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : isUpcoming
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {isActive ? "Active" : isUpcoming ? "Upcoming" : "Completed"}
                </span>
              </div>

              <div className="text-sm text-gray-600 space-y-2 mb-4">
                <p><strong>Type:</strong> {competition.type}</p>
                <p><strong>Venue:</strong> {competition.venue}</p>
                <p>
                  <strong>Start:</strong> {startTime.toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong> {endTime.toLocaleString()}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {competition.shortDescription}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/teacher/attendance/${competition._id}`)}
                  disabled={!isActive && !isCompleted}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    isActive || isCompleted
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isActive ? "📱 Show QR Code" : isCompleted ? "View Attendance" : "Not Started"}
                </button>
                {isCompleted && (
                  <button
                    onClick={() => navigate(`/teacher/attendance/view/${competition._id}`)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    View
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
