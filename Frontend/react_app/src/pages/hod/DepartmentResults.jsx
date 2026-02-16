import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHodResults } from "../../api/result.api";
import toast from "react-hot-toast";

const DepartmentResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await getHodResults();
        console.log("Results Data:", res.data?.data);
        setResultsData(res.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Group competitions by event
  const groupedByEvent = resultsData.reduce((acc, item) => {
    const eventId = item.competition.event?._id || "no-event";
    const event = item.competition.event;

    if (!acc[eventId]) {
      acc[eventId] = {
        eventId,
        event: event || {
          title: "No Event",
          shortDescription: "Competitions without event",
          startDate: new Date(),
          endDate: new Date(),
          liveStatus: "completed",
          isPublished: true,
          bannerImage: null,
          coordinator: { fullName: "N/A" }
        },
        competitions: []
      };
    }

    acc[eventId].competitions.push(item);
    return acc;
  }, {});

  const eventsArray = Object.values(groupedByEvent);

  // Filter by status
  const filteredByStatus =
    filter === "all"
      ? eventsArray
      : eventsArray.filter(e => e.event.liveStatus === filter);

  // Filter by search
  const filteredEvents = filteredByStatus.filter((eventData) =>
    eventData.event.title.toLowerCase().includes(search.toLowerCase()) ||
    eventData.event.coordinator?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    eventData.competitions.some(comp => 
      comp.competition.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleEvent = (eventId) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  // Status color helper - EXACT SAME AS MANAGEEVENTS
  const getStatusColor = (status) => {
    if (status === "upcoming") return "bg-orange-100 text-orange-700";
    if (status === "ongoing") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";
  };

  // LOADING - EXACT SAME AS MANAGEEVENTS
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER - EXACT SAME AS MANAGEEVENTS */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
        <div>
          <h1 className="text-3xl font-bold">Department Results</h1>
          <p className="text-gray-600">View results for all competitions in your department's events</p>
        </div>
      </div>

      {/* FILTER BAR - EXACT SAME AS MANAGEEVENTS */}
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

      {/* SEARCH */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <input
          type="text"
          placeholder="Search events, competitions, or coordinators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* EMPTY STATE - EXACT SAME AS MANAGEEVENTS */}
      {filteredEvents.length === 0 && (
        <div className="bg-white p-8 rounded shadow text-center text-gray-500">
          No events found
        </div>
      )}

      {/* EVENTS GRID - EXACT SAME STRUCTURE AS MANAGEEVENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((eventData) => {
          const event = eventData.event;
          const isExpanded = expandedEvents.has(eventData.eventId);
          const totalCompetitions = eventData.competitions.length;
          const completedCompetitions = eventData.competitions.filter(
            comp => comp.results.length > 0
          ).length;

          return (
            <div
              key={eventData.eventId}
              className="bg-white rounded shadow border"
            >
              {/* IMAGE - EXACT SAME AS MANAGEEVENTS */}
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

              {/* CONTENT - SAME STRUCTURE AS MANAGEEVENTS */}
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

                {/* COORDINATOR INFO (ADDITIONAL) */}
                {event.coordinator && (
                  <p className="text-xs text-gray-500 mb-2">
                    👤 Coordinator: {event.coordinator.fullName}
                  </p>
                )}

                {/* STATS BADGES (REPLACES PUBLISH BADGE) */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    🎯 {totalCompetitions} Competition{totalCompetitions !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                    ✅ {completedCompetitions} Result{completedCompetitions !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* ACTIONS - REPLACED WITH VIEW RESULTS BUTTON */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => toggleEvent(eventData.eventId)}
                    className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                      isExpanded
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isExpanded ? "Hide Results" : "View Results"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EXPANDED RESULTS SECTION */}
      {filteredEvents.map((eventData) => {
        const isExpanded = expandedEvents.has(eventData.eventId);
        
        if (!isExpanded) return null;

        return (
          <div
            key={`results-${eventData.eventId}`}
            className="mt-6 bg-white rounded-lg shadow-lg border-2 border-blue-500 p-6 space-y-6"
          >
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                📊 Results: {eventData.event.title}
              </h2>
              <button
                onClick={() => toggleEvent(eventData.eventId)}
                className="px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700"
              >
                ✕ Close
              </button>
            </div>

            {eventData.competitions.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg p-5 border"
              >
                {/* COMPETITION HEADER */}
                <div className="mb-4 pb-4 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.competition.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>📍 {item.competition.venue}</span>
                    <span>📅 {new Date(item.competition.endTime).toLocaleDateString()}</span>
                    <span className="capitalize">👥 {item.competition.type}</span>
                  </div>
                </div>

                {/* RESULTS TABLE */}
                {item.results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b bg-white">
                          <th className="py-3 px-2 font-semibold">Position</th>
                          <th className="py-3 px-2 font-semibold">
                            {item.competition.type === "individual" ? "Student" : "Team"}
                          </th>
                          {item.competition.type === "team" && (
                            <th className="py-3 px-2 font-semibold">Members</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {item.results.map((result) => (
                          <tr key={result._id} className="border-b hover:bg-white">
                            <td className="py-3 px-2 font-medium">
                              {result.position === 1
                                ? "🥇 1st"
                                : result.position === 2
                                ? "🥈 2nd"
                                : result.position === 3
                                ? "🥉 3rd"
                                : `🏅 ${result.position}th`}
                            </td>
                            <td className="py-3 px-2">
                              {item.competition.type === "individual"
                                ? `${result.student?.fullName || "Unknown"} (${
                                    result.student?.rollNumber || result.student?.email || "N/A"
                                  })`
                                : result.team?.teamName || "Unknown Team"}
                            </td>
                            {item.competition.type === "team" && (
                              <td className="py-3 px-2">
                                {result.team?.members?.length || 0} members
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-700 font-medium">
                      ⏳ Results not declared yet
                    </p>
                    <p className="text-yellow-600 text-sm mt-1">
                      Results will appear here once they are published
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentResults;