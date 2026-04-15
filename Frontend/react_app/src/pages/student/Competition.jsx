import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventPublicCompetitions } from "../../api/competition.api";
import toast from "react-hot-toast";

const Competitions = () => {

  const { eventId } = useParams();
  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getEventPublicCompetitions(eventId);
      setCompetitions(res.data || []);
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

  

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {

      const status = getCompetitionStatus(comp);

      const matchesSearch =
        comp.name.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || status === filter;

      return matchesSearch && matchesFilter;

    });
  }, [competitions, search, filter, currentTime]);

  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">



      <div>
        <button
          onClick={() => navigate("/student/events")}
          className="text-blue-600 hover:text-blue-700 mb-3"
        >
          ← Back to Events
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Competitions
        </h1>

        <p className="text-gray-600 text-sm sm:text-base mt-1">
          Select a competition to register
        </p>
      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3">

        <input
          type="text"
          placeholder="Search competitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex flex-wrap gap-2">

          <FilterBtn label="All" value="all" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Open" value="REG_OPEN" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Live" value="LIVE" filter={filter} setFilter={setFilter} />
          <FilterBtn label="Finished" value="FINISHED" filter={filter} setFilter={setFilter} />

        </div>

      </div>



      {filteredCompetitions.length === 0 && (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-gray-500 text-lg">
            No competitions found
          </p>
        </div>
      )}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredCompetitions.map((comp) => {

          const status = getCompetitionStatus(comp);

          return (
            <div
              key={comp._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 sm:p-6 border flex flex-col"
            >



              <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">
                {comp.name}
              </h2>



              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {comp.shortDescription}
              </p>



              <div className="text-sm text-gray-500 space-y-1 mb-3">

                <p>📌 Type: <span className="font-medium capitalize">{comp.type}</span></p>
                <p>📍 {comp.venue}</p>
                <p>🗓 Starts: {new Date(comp.startTime).toLocaleString()}</p>
                <p>⏳ Reg Ends: {new Date(comp.registrationDeadline).toLocaleString()}</p>

              </div>



              <div className="mb-3">

                {status === "REG_OPEN" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    🟢 Registration Open
                  </span>
                )}

                {status === "REG_CLOSED" && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    🟡 Registration Closed
                  </span>
                )}

                {status === "LIVE" && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    🔵 Live Now
                  </span>
                )}

                {status === "FINISHED" && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    🔴 Finished
                  </span>
                )}

              </div>



              {status === "REG_OPEN" && (
                <p className="text-xs text-gray-500 mb-2">
                  Registration Ends In: <span className="font-semibold">{getTimeRemaining(comp.registrationDeadline)}</span>
                </p>
              )}

              {status === "REG_CLOSED" && (
                <p className="text-xs text-gray-500 mb-2">
                  Competition Starts In: <span className="font-semibold">{getTimeRemaining(comp.startTime)}</span>
                </p>
              )}



              <button
                disabled={status !== "REG_OPEN"}
                onClick={() =>
                  navigate(`/student/events/${eventId}/competitions/${comp._id}/register`)
                }
                className={`mt-auto w-full py-2 rounded-lg font-medium text-white transition
                  ${status === "REG_OPEN"
                    ? "bg-green-600 hover:bg-green-700"
                    : status === "LIVE"
                    ? "bg-blue-500 cursor-not-allowed"
                    : status === "FINISHED"
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"}
                `}
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



const FilterBtn = ({ label, value, filter, setFilter }) => (
  <button
    onClick={() => setFilter(value)}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition
      ${filter === value
        ? "bg-blue-600 text-white"
        : "bg-gray-100 hover:bg-gray-200"}
    `}
  >
    {label}
  </button>
);

export default Competitions;
