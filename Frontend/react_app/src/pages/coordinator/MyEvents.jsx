import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordinatorEvents } from "../../api/event.api";
import toast from "react-hot-toast";

const MyEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // NEW

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {
    try {

      setLoading(true);
      const res = await getCoordinatorEvents();
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
  }, []);

  // ================= STATUS LOGIC =================

  const getEventStatus = (startDate, endDate) => {

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";

    return "COMPLETED";
  };

  // ================= FILTER LOGIC =================

  const filteredEvents = events.filter((event) => {

    if (filter === "ALL") return true;

    const status = getEventStatus(event.startDate, event.endDate);
    return status === filter;

  });

  // ================= LOADING =================
  console.log(filteredEvents);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">
            Loading your events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          My Assigned Events
        </h1>

        <p className="text-gray-600 text-sm md:text-base mt-1">
          Manage competitions for your assigned events
        </p>
      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="flex flex-wrap gap-2">

        {["ALL", "UPCOMING", "ONGOING", "COMPLETED"].map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${filter === item
                ? "bg-green-600 text-white"
                : "bg-white border text-gray-600 hover:bg-gray-100"
              }`}
          >
            {item}
          </button>

        ))}

      </div>

      {/* ================= EMPTY ================= */}

      {filteredEvents.length === 0 && (

        <div className="bg-white rounded-lg shadow-md p-10 text-center">

          <div className="text-5xl mb-4">📅</div>

          <p className="text-gray-500 text-lg mb-2">
            No {filter.toLowerCase()} events found
          </p>

        </div>

      )}

      {/* ================= EVENTS GRID ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        {filteredEvents.map((event) => {

          const status = getEventStatus(
            event.startDate,
            event.endDate
          );

          return (

            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200 flex flex-col"
            >

              {/* BANNER */}

              <div className="h-36 md:h-40 bg-gradient-to-br from-green-400 to-emerald-600">

                {event.bannerImage ? (

                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt="event banner"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    🎯
                  </div>

                )}

              </div>

              {/* CONTENT */}

              <div className="p-4 md:p-5 flex flex-col flex-1">

                {/* TITLE + STATUS */}

                <div className="flex justify-between items-start gap-2 mb-2">

                  <h2 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2">
                    {event.title}
                  </h2>

                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium whitespace-nowrap ${
                      status === "UPCOMING"
                        ? "bg-yellow-100 text-yellow-700"
                        : status === "ONGOING"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {status}
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {event.shortDescription}
                </p>

                {/* DETAILS */}

                <div className="text-sm text-gray-500 space-y-1 mb-4">

                  <p>📍 {event.venueOverview}</p>

                  <p>
                    📅 Start:{" "}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>

                  <p>
                    ⏳ End:{" "}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>

                </div>

                {/* BUTTON */}

                <button
                  disabled={status === "COMPLETED"}
                  onClick={() =>
                    navigate(`/coordinator/events/${event._id}/competitions`)
                  }
                  className={`mt-auto w-full px-4 py-3 rounded-lg text-sm md:text-base font-medium transition shadow ${
                    status === "COMPLETED"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  📋 Manage Competitions
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default MyEvents;
