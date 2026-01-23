import { useEffect, useState } from "react";
import { getAllEvents } from "../../api/event.api";
import { useNavigate } from "react-router-dom";

const Events = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {
    try {
      const res = await getAllEvents();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= LIVE CLOCK =================

  useEffect(() => {

    fetchEvents();

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  // ================= COUNTDOWN FUNCTION =================

  const getRemainingTime = (date) => {

    const diff = new Date(date) - now;

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // SHOW TIMER ONLY IF LESS THAN 24 HOURS LEFT
    if (days >= 1) return null;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // ================= UI =================

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading events...
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Events
        </h1>

        <p className="text-sm text-gray-500">
          {events.length} Events Available
        </p>

      </div>

      {/* EMPTY STATE */}

      {events.length === 0 && (

        <div className="text-center mt-10 text-gray-500">
          No events available currently
        </div>

      )}

      {/* EVENTS GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map((event) => {

          const startCountdown = getRemainingTime(event.startDate);

          return (

            <div
              key={event._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
            >

              {/* IMAGE */}

              <div className="h-40 bg-gray-200">

                <img
                  src={`http://localhost:5000${event.bannerImage}`}
                  alt="event banner"
                  className="w-full h-full object-cover"
                />

              </div>

              {/* CONTENT */}

              <div className="p-4">

                <h2 className="text-lg font-semibold mb-1">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-600 mb-2">
                  {event.shortDescription}
                </p>

                <div className="text-xs text-gray-500 space-y-1">

                  <p>
                    📍 {event.venueOverview}
                  </p>

                  <p>
                    📅{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                    {" "} - {" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>

                </div>

                {/* STATUS */}

                <div className="mt-2">

                  {event.liveStatus === "upcoming" && (
                    <span className="text-orange-600 font-semibold">
                      🟡 Upcoming
                    </span>
                  )}

                  {event.liveStatus === "ongoing" && (
                    <span className="text-green-600 font-semibold">
                      🟢 Live Now
                    </span>
                  )}

                  {event.liveStatus === "completed" && (
                    <span className="text-red-600 font-semibold">
                      🔴 Completed
                    </span>
                  )}

                </div>

                {/* COUNTDOWN (ONLY LAST 24 HOURS) */}

                {event.liveStatus === "upcoming" && startCountdown && (

                  <p className="text-xs text-gray-500 mt-1">
                    Starts In: {startCountdown}
                  </p>

                )}

                {/* BUTTON */}

                <button
                  disabled={event.liveStatus === "completed"}
                  onClick={() =>
                    navigate(`/student/events/${event._id}`)
                  }
                  className={`mt-4 w-full py-2 rounded text-white transition
                    ${
                      event.liveStatus === "completed"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  View Competitions
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
