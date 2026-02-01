import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyEvents,
  deleteEvent,
  publishEvent,
  unpublishEvent
} from "../../api/event.api";
import toast from "react-hot-toast";

const ManageEvents = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  // ================= FETCH EVENTS =================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getMyEvents();
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

  // ================= DELETE =================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this event permanently? This cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await toast.promise(deleteEvent(id), {
        loading: "Deleting...",
        success: "Event deleted successfully",
        error: "Delete failed"
      });

      setEvents(prev => prev.filter(e => e._id !== id));

    } catch (error) {}
  };

  // ================= PUBLISH TOGGLE =================

  const handlePublishToggle = async (event) => {

    try {

      if (event.isPublished) {

        await toast.promise(unpublishEvent(event._id), {
          loading: "Unpublishing...",
          success: "Event unpublished",
          error: "Unpublish failed"
        });

      } else {

        await toast.promise(publishEvent(event._id), {
          loading: "Publishing...",
          success: "Event published",
          error: "Publish failed"
        });

      }

      setEvents(prev =>
        prev.map(e =>
          e._id === event._id
            ? { ...e, isPublished: !e.isPublished }
            : e
        )
      );

    } catch (error) {}
  };

  // ================= STATUS COLOR =================

  const getStatusColor = (status) => {

    if (status === "upcoming") return "bg-orange-100 text-orange-700";
    if (status === "ongoing") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";

  };

  // ================= FILTER =================

  const filteredEvents =
    filter === "all"
      ? events
      : events.filter(e => e.liveStatus === filter);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">

        <div>
          <h1 className="text-3xl font-bold">Manage Events</h1>
          <p className="text-gray-600">Create and control all department events</p>
        </div>

        <button
          onClick={() => navigate("/hod/events/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          ➕ Create Event
        </button>

      </div>

      {/* FILTER BAR */}
      <div className="flex gap-3 mb-6 flex-wrap">

        {["all", "upcoming", "ongoing", "completed"].map(type => (

          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-sm font-medium ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.toUpperCase()}
          </button>

        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredEvents.length === 0 && (

        <div className="bg-white p-8 rounded shadow text-center text-gray-500">
          No events found
        </div>

      )}

      {/* EVENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredEvents.map(event => {

          const isUpcoming = event.liveStatus === "upcoming";

          return (

            <div
              key={event._id}
              className="bg-white rounded shadow border"
            >

              {/* IMAGE */}
              <div className="h-36 bg-gray-200">

                {event.bannerImage ? (

                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    className="w-full h-full object-cover"
                    alt="event"
                  />

                ) : (

                  <div className="h-full flex items-center justify-center text-3xl">
                    📅
                  </div>

                )}

              </div>

              {/* CONTENT */}
              <div className="p-4">

                <div className="flex justify-between mb-2">

                  <h3 className="font-bold">{event.title}</h3>

                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.liveStatus)}`}>
                    {event.liveStatus}
                  </span>

                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {event.shortDescription}
                </p>

                <p className="text-xs text-gray-500 mb-2">
                  {new Date(event.startDate).toLocaleDateString()} →{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>

                {/* PUBLISH BADGE */}
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    event.isPublished
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200"
                  }`}
                >
                  {event.isPublished ? "Published" : "Draft"}
                </span>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2 mt-4">

                  <button
                    disabled={!isUpcoming}
                    onClick={() => navigate(`/hod/events/edit/${event._id}`)}
                    className={`flex-1 px-3 py-2 rounded text-sm ${
                      isUpcoming
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    Edit
                  </button>

                  <button
                    disabled={!isUpcoming}
                    onClick={() => handlePublishToggle(event)}
                    className={`px-3 py-2 rounded text-sm ${
                      isUpcoming
                        ? event.isPublished
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {event.isPublished ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    disabled={!isUpcoming}
                    onClick={() => handleDelete(event._id)}
                    className={`px-3 py-2 rounded text-sm ${
                      isUpcoming
                        ? "bg-red-600 text-white"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default ManageEvents;
