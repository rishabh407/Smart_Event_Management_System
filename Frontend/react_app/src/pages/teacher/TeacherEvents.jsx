import React, { useEffect, useState, useMemo } from "react";
import { getAllEvents } from "../../api/event.api";
import { useNavigate } from "react-router-dom";

const TeacherEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res.data || []);
      } catch (error) {
        console.error("Fetch events error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

  }, []);

  // ================= STATUS LOGIC =================

  const getStatus = (start, end) => {

    const now = new Date();

    if (now < new Date(start)) return "UPCOMING";
    if (now <= new Date(end)) return "ONGOING";

    return "COMPLETED";
  };

  // ================= FILTER EVENTS =================

  const filteredEvents = useMemo(() => {

    if (filter === "ALL") return events;

    return events.filter(event => {

      const status = getStatus(
        event.startDate,
        event.endDate
      );

      return status === filter;

    });

  }, [events, filter]);

  // ================= UI =================

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}

      <h1 className="text-2xl font-bold mb-4">
        College Events
      </h1>

      <p className="text-gray-600 mb-6">
        Select an event to view your assigned competitions
      </p>

      {/* FILTER BUTTONS */}

      <div className="flex flex-wrap gap-3 mb-6">

        {["ALL", "UPCOMING", "ONGOING", "COMPLETED"].map(type => (

          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-sm font-medium transition
            ${
              filter === type
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>

        ))}

      </div>

      {/* LOADING STATE */}

      {loading && (
        <p className="text-gray-500">
          Loading events...
        </p>
      )}

      {/* EMPTY STATE */}

      {!loading && filteredEvents.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">
            No events found.
          </p>
        </div>
      )}

      {/* EVENTS GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredEvents.map(event => {

          const status = getStatus(
            event.startDate,
            event.endDate
          );

          return (

            <div
              key={event._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >

              {/* BANNER IMAGE */}

              <div className="relative h-40 w-full">

                <img
                  src={`http://localhost:5000${event.bannerImage}`}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />

                {/* STATUS BADGE */}

                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    status === "UPCOMING"
                      ? "bg-blue-100 text-blue-700"
                      : status === "ONGOING"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {status}
                </span>

              </div>

              {/* CONTENT */}

              <div className="p-4 flex flex-col flex-1">

                <h2 className="font-bold text-lg mb-1 truncate">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {event.shortDescription}
                </p>

                <div className="text-xs sm:text-sm text-gray-700 space-y-1 mb-4">

                  <p>
                    <b>Venue:</b> {event.venueOverview}
                  </p>

                  <p>
                    <b>From:</b>{" "}
                    {new Date(event.startDate).toLocaleString()}
                  </p>

                  <p>
                    <b>To:</b>{" "}
                    {new Date(event.endDate).toLocaleString()}
                  </p>

                </div>

                {/* ACTION BUTTON */}

                <button
                  onClick={() =>
                    navigate(`/teacher/events/${event._id}`)
                  }
                  className="mt-auto bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition"
                >
                  View Assigned Competitions →
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default TeacherEvents;
