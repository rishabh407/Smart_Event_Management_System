import { useEffect, useState, useMemo } from "react";
import { getAllEvents } from "../../api/event.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Events = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEvents();
      setEvents(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= COUNTDOWN =================

  const getRemainingTime = (date) => {
    const diff = new Date(date) - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ================= SEARCH + FILTER =================

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {

      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" || event.liveStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [events, search, filter]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Events
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Browse and register for upcoming events
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {filteredEvents.length} Events Available
        </p>

      </div>

      {/* ================= SEARCH + FILTER ================= */}

      <div className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row gap-3">

        {/* SEARCH BOX */}

        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* FILTER BUTTONS */}

        <div className="flex flex-wrap gap-2">

          <FilterButton label="All" value="all" filter={filter} setFilter={setFilter} />
          <FilterButton label="Upcoming" value="upcoming" filter={filter} setFilter={setFilter} />
          <FilterButton label="Live" value="ongoing" filter={filter} setFilter={setFilter} />
          <FilterButton label="Completed" value="completed" filter={filter} setFilter={setFilter} />

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {filteredEvents.length === 0 && (
        <div className="bg-white rounded-lg shadow p-10 text-center">
          <div className="text-5xl mb-3">📅</div>
          <p className="text-gray-500 text-lg">
            No events found
          </p>
        </div>
      )}

      {/* ================= EVENTS GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredEvents.map((event) => {

          const startCountdown = getRemainingTime(event.startDate);

          return (
            <div
              key={event._id}
              onClick={() => navigate(`/student/events/${event._id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border cursor-pointer flex flex-col"
            >

              {/* IMAGE */}

              <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-400 to-indigo-600">

                {event.bannerImage ? (
                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt="event banner"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    📅
                  </div>
                )}

              </div>

              {/* CONTENT */}

              <div className="p-4 sm:p-5 flex flex-col flex-1">

                <h2 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.shortDescription}
                </p>

                <div className="text-xs text-gray-500 space-y-1 mb-3">

                  <p>📍 {event.venueOverview}</p>

                  <p>
                    📅 {new Date(event.startDate).toLocaleDateString()} -{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>

                </div>

                {/* STATUS */}

                <div className="mb-3">

                  {event.liveStatus === "upcoming" && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                      🟡 Upcoming
                    </span>
                  )}

                  {event.liveStatus === "ongoing" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      🟢 Live Now
                    </span>
                  )}

                  {event.liveStatus === "completed" && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      🔴 Completed
                    </span>
                  )}

                </div>

                {/* COUNTDOWN */}

                {event.liveStatus === "upcoming" && startCountdown && (
                  <p className="text-xs text-gray-500 mb-3">
                    Starts In: <span className="font-semibold">{startCountdown}</span>
                  </p>
                )}

                {/* BUTTON */}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/events/${event._id}`);
                  }}
                  disabled={event.liveStatus === "completed"}
                  className={`mt-auto w-full py-2 rounded-lg font-medium text-white transition
                    ${event.liveStatus === "completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"}
                  `}
                >
                  {event.liveStatus === "completed"
                    ? "View Details"
                    : "View Competitions"}
                </button>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

// ================= FILTER BUTTON COMPONENT =================

const FilterButton = ({ label, value, filter, setFilter }) => {
  return (
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
};

export default Events;
