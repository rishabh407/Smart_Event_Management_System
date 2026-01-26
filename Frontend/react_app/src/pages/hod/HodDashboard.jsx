import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEvents } from "../../api/event.api";

const HODDashboard = () => {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ---------------- FETCH EVENTS ----------------

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ---------------- STATS ----------------

  const totalEvents = events.length;

  const upcomingEvents = events.filter(
    e => e.liveStatus === "upcoming"
  ).length;

  const ongoingEvents = events.filter(
    e => e.liveStatus === "ongoing"
  ).length;

  const completedEvents = events.filter(
    e => e.liveStatus === "completed"
  ).length;

  // ---------------- UI ----------------

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">

      {/* PAGE HEADER */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          HOD Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          Event management overview
        </p>

      </div>

      {/* STATS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        {/* TOTAL EVENTS */}

        <div className="bg-white shadow rounded p-5">

          <p className="text-gray-500 text-sm">
            Total Events
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalEvents}
          </h2>

        </div>

        {/* UPCOMING */}

        <div className="bg-white shadow rounded p-5">

          <p className="text-gray-500 text-sm">
            Upcoming Events
          </p>

          <h2 className="text-3xl font-bold text-orange-500 mt-2">
            {upcomingEvents}
          </h2>

        </div>

        {/* ONGOING */}

        <div className="bg-white shadow rounded p-5">

          <p className="text-gray-500 text-sm">
            Ongoing Events
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {ongoingEvents}
          </h2>

        </div>

        {/* COMPLETED */}

        <div className="bg-white shadow rounded p-5">

          <p className="text-gray-500 text-sm">
            Completed Events
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {completedEvents}
          </h2>

        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="bg-white shadow rounded p-6">

        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/hod/events/create")}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            ➕ Create Event
          </button>

          <button
            onClick={() => navigate("/hod/manage-events")}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            📋 Manage Events
          </button>

        </div>

      </div>

    </div>
  );
};

export default HODDashboard;
