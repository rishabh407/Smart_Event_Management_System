import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventPublicCompetitions } from "../../api/competition.api";
import toast from "react-hot-toast";

const Competitions = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getEventPublicCompetitions(eventId);
      setCompetitions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [eventId]);

  const getCompetitionStatus = (comp) => {
    const now = currentTime;
    const regDeadline = new Date(comp.registrationDeadline);
    const start = new Date(comp.startTime);
    const end = new Date(comp.endTime);

    if (now < regDeadline && comp.registrationOpen) return "REG_OPEN";
    if (now >= regDeadline && now < start) return "REG_CLOSED";
    if (now >= start && now <= end) return "LIVE";
    return "FINISHED";
  };

  const getTimeRemaining = (targetDate) => {
    const diff = new Date(targetDate) - currentTime;

    if (diff <= 0) return "00h 00m 00s";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/student/events")}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          ← Back to Events
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Competitions</h1>
        <p className="text-gray-600 mt-1">Select a competition to register</p>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {competitions.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-gray-500 text-lg mb-2">No competitions available</p>
          <p className="text-gray-400 text-sm">
            Competitions will appear here once they are published.
          </p>
        </div>
      )}

      {/* ================= COMPETITIONS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((comp) => {
          const status = getCompetitionStatus(comp);

          return (
            <div
              key={comp._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
            >
              {/* Title */}
              <h2 className="text-lg font-semibold mb-2 text-gray-900">
                {comp.name}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {comp.shortDescription}
              </p>

              {/* Details */}
              <div className="text-sm text-gray-500 space-y-2 mb-4">
                <p className="flex items-center">
                  <span className="mr-2">📌</span>
                  Type: <span className="font-medium capitalize ml-1">{comp.type}</span>
                </p>
                <p className="flex items-center">
                  <span className="mr-2">📍</span>
                  {comp.venue}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">🗓</span>
                  Starts: {new Date(comp.startTime).toLocaleString()}
                </p>
                <p className="flex items-center">
                  <span className="mr-2">⏳</span>
                  Registration Ends: {new Date(comp.registrationDeadline).toLocaleString()}
                </p>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                {status === "REG_OPEN" && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    🟢 Registration Open
                  </span>
                )}
                {status === "REG_CLOSED" && (
                  <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    🟡 Registration Closed
                  </span>
                )}
                {status === "LIVE" && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    🔵 Live Now
                  </span>
                )}
                {status === "FINISHED" && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    🔴 Finished
                  </span>
                )}
              </div>

              {/* Countdown Timer */}
              {status === "REG_OPEN" && (
                <p className="text-xs text-gray-500 mb-3">
                  Registration Ends In: <span className="font-semibold">{getTimeRemaining(comp.registrationDeadline)}</span>
                </p>
              )}
              {status === "REG_CLOSED" && (
                <p className="text-xs text-gray-500 mb-3">
                  Competition Starts In: <span className="font-semibold">{getTimeRemaining(comp.startTime)}</span>
                </p>
              )}

              {/* Register Button */}
              <button
                disabled={status !== "REG_OPEN"}
                onClick={() =>
                  navigate(`/student/events/${eventId}/competitions/${comp._id}/register`)
                }
                className={`w-full py-2 rounded-lg text-white font-medium transition ${
                  status === "REG_OPEN"
                    ? "bg-green-600 hover:bg-green-700"
                    : status === "LIVE"
                    ? "bg-blue-500 cursor-not-allowed"
                    : status === "FINISHED"
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {status === "REG_OPEN" && "Register Now"}
                {status === "REG_CLOSED" && "Registration Closed"}
                {status === "LIVE" && "Competition Running"}
                {status === "FINISHED" && "Competition Finished"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Competitions;
