import { useEffect, useState } from "react";
import { getAllEvents } from "../../api/event.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getRemainingTime = (date) => {
    const diff = new Date(date) - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (days >= 1) return `${days}d ${hours}h`;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-1">Browse and register for upcoming events</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {events.length} {events.length === 1 ? "Event" : "Events"} Available
          </p>
        </div>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {events.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-500 text-lg mb-2">No events available currently</p>
          <p className="text-gray-400 text-sm">
            Check back later for new events
          </p>
        </div>
      )}

      {/* ================= EVENTS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const startCountdown = getRemainingTime(event.startDate);

          return (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200 cursor-pointer"
              onClick={() => navigate(`/student/events/${event._id}`)}
            >
              {/* Banner Image */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600">
                {event.bannerImage ? (
                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt="event banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl">
                    📅
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 line-clamp-2">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.shortDescription}
                </p>

                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p className="flex items-center">
                    <span className="mr-2">📍</span>
                    {event.venueOverview}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  {event.liveStatus === "upcoming" && (
                    <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      🟡 Upcoming
                    </span>
                  )}
                  {event.liveStatus === "ongoing" && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      🟢 Live Now
                    </span>
                  )}
                  {event.liveStatus === "completed" && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      🔴 Completed
                    </span>
                  )}
                </div>

                {/* Countdown */}
                {event.liveStatus === "upcoming" && startCountdown && (
                  <p className="text-xs text-gray-500 mb-3">
                    Starts In: <span className="font-semibold">{startCountdown}</span>
                  </p>
                )}

                {/* Button */}
                <button
                  disabled={event.liveStatus === "completed"}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/student/events/${event._id}`);
                  }}
                  className={`w-full py-2 rounded-lg text-white font-medium transition ${
                    event.liveStatus === "completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {event.liveStatus === "completed" ? "View Details" : "View Competitions"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;
