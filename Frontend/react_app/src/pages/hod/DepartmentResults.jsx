import { useEffect, useState } from "react";
import { getHodResults } from "../../api/result.api";
import toast from "react-hot-toast";

const DepartmentResults = () => {

  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const fallbackImage = "/event-banner.jpg";

  useEffect(() => {

    const fetchResults = async () => {

      try {

        setLoading(true);

        const res = await getHodResults();

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



  const groupedByEvent = resultsData.reduce((acc, item) => {

    const eventId = item.competition.event?._id || "no-event";
    const event = item.competition.event;

    if (!acc[eventId]) {

      acc[eventId] = {
        eventId,
        event,
        competitions: []
      };

    }

    acc[eventId].competitions.push(item);

    return acc;

  }, {});

  const eventsArray = Object.values(groupedByEvent);



  const filteredByStatus =
    filter === "all"
      ? eventsArray
      : eventsArray.filter(e => e.event.liveStatus === filter);

  const filteredEvents = filteredByStatus.filter((eventData) =>
    eventData.event.title.toLowerCase().includes(search.toLowerCase()) ||
    eventData.competitions.some(comp =>
      comp.competition.name.toLowerCase().includes(search.toLowerCase())
    )
  );



  const toggleEvent = (eventId) => {

    setExpandedEvents((prev) => {

      const newSet = new Set(prev);

      if (newSet.has(eventId)) newSet.delete(eventId);
      else newSet.add(eventId);

      return newSet;

    });

  };



  const getStatusColor = (status) => {

    if (status === "upcoming") return "bg-orange-100 text-orange-700";
    if (status === "ongoing") return "bg-green-100 text-green-700";
    return "bg-gray-200 text-gray-700";

  };



  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  }

  return (

    <div className="p-6 space-y-8">



      <div>

        <h1 className="text-3xl font-bold">
          Department Results
        </h1>

        <p className="text-gray-600">
          View results for competitions across department events
        </p>

      </div>



      <div className="flex flex-wrap gap-3">

        {["all", "upcoming", "ongoing", "completed"].map(type => (

          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.toUpperCase()}
          </button>

        ))}

      </div>



      <div className="bg-white p-4 rounded-xl shadow">

        <input
          type="text"
          placeholder="Search events or competitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>



      {filteredEvents.length === 0 && (

        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          No events found
        </div>

      )}



      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {filteredEvents.map((eventData) => {

          const event = eventData.event;
          const isExpanded = expandedEvents.has(eventData.eventId);

          const resultsCount =
            eventData.competitions.reduce(
              (acc, c) => acc + c.results.length,
              0
            );

          return (

            <div
              key={eventData.eventId}
              className="bg-white rounded-xl shadow border overflow-hidden flex flex-col hover:shadow-lg transition"
            >



              <div className="h-40 w-full bg-gray-200">

                <img
                  src={
                    event.bannerImage
                      ? `http://localhost:5000${event.bannerImage}`
                      : fallbackImage
                  }
                  alt="event banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />

              </div>



              <div className="p-4 flex flex-col gap-3 flex-1">

                <div className="flex justify-between items-start">

                  <h3 className="font-semibold text-lg text-gray-800">
                    {event.title}
                  </h3>

                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(event.liveStatus)}`}>
                    {event.liveStatus}
                  </span>

                </div>

                <p className="text-gray-600 text-sm line-clamp-2">
                  {event.shortDescription}
                </p>

                <p className="text-xs text-gray-500">

                  {new Date(event.startDate).toLocaleDateString()} →{" "}
                  {new Date(event.endDate).toLocaleDateString()}

                </p>



                <div className="flex gap-3 mt-2">

                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded">
                    🎯 {eventData.competitions.length} Competitions
                  </span>

                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
                    🏆 {resultsCount} Results
                  </span>

                </div>

                <button
                  onClick={() => toggleEvent(eventData.eventId)}
                  className={`mt-auto w-full py-2 rounded-lg font-medium transition ${
                    isExpanded
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isExpanded ? "Hide Results" : "View Results"}
                </button>

              </div>

            </div>

          );

        })}

      </div>



      {filteredEvents.map((eventData) => {

        if (!expandedEvents.has(eventData.eventId)) return null;

        return (

          <div
            key={eventData.eventId}
            className="bg-white rounded-xl shadow border p-6 space-y-6"
          >

            <div className="flex justify-between items-center border-b pb-4">

              <h2 className="text-xl font-bold">
                Results: {eventData.event.title}
              </h2>

              <button
                onClick={() => toggleEvent(eventData.eventId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Close
              </button>

            </div>

            {eventData.competitions.map((item, idx) => (

              <div key={idx} className="bg-gray-50 border rounded-lg p-4">

                <h3 className="font-semibold mb-3 text-lg">
                  {item.competition.name}
                </h3>

                {item.results.length > 0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead className="bg-white border-b">

                        <tr>
                          <th className="px-3 py-2 text-left">Position</th>
                          <th className="px-3 py-2 text-left">Winner</th>
                        </tr>

                      </thead>

                      <tbody>

                        {item.results.map((result) => (

                          <tr
                            key={result._id}
                            className="border-b hover:bg-white"
                          >

                            <td className="px-3 py-2 font-medium">

                              {result.position === 1
                                ? "🥇 1st"
                                : result.position === 2
                                ? "🥈 2nd"
                                : result.position === 3
                                ? "🥉 3rd"
                                : `${result.position}th`}

                            </td>

                            <td className="px-3 py-2">

                              {item.competition.type === "individual"
                                ? result.student?.fullName
                                : result.team?.teamName}

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="text-center py-4 text-yellow-700 bg-yellow-50 rounded">
                    Results not declared yet
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