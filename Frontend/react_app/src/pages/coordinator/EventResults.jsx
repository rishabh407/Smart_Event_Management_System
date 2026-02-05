import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoordinatorResults } from "../../api/result.api";
import toast from "react-hot-toast";

const EventResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH RESULTS ================= */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await getCoordinatorResults();
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

  /* ================= FILTER ================= */
  const filteredResults = resultsData.filter(
    (item) =>
      item.competition.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.competition.event?.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">
            Loading results...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Event Results
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          View results for all competitions in your events
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search competitions or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* ================= EMPTY STATE ================= */}
      {filteredResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 sm:p-10 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-gray-500 text-base sm:text-lg mb-2">
            {search ? "No results found" : "No results available yet"}
          </p>
          {!search && (
            <p className="text-gray-400 text-sm">
              Results will appear once competitions are evaluated
            </p>
          )}
        </div>
      )}

      {/* ================= RESULTS LIST ================= */}
      <div className="space-y-6">
        {filteredResults.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-4 sm:p-6 border"
          >
            {/* HEADER */}
            <div className="mb-4 pb-4 border-b">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 break-words">
                    {item.competition.name}
                  </h2>

                  {item.competition.event && (
                    <p className="text-sm text-gray-600 mt-1">
                      Event: {item.competition.event.title}
                    </p>
                  )}
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/coordinator/competitions/details/${item.competition._id}`
                    )
                  }
                  className="text-green-600 hover:text-green-800 text-sm font-medium whitespace-nowrap"
                >
                  View Details →
                </button>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <span>📍 {item.competition.venue}</span>
                <span>
                  📅{" "}
                  {new Date(item.competition.endTime).toLocaleDateString()}
                </span>
                <span className="capitalize">
                  👥 {item.competition.type}
                </span>
              </div>
            </div>

            {/* ================= RESULTS TABLE ================= */}
            {item.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="py-3 px-2 font-semibold">
                        Position
                      </th>
                      <th className="py-3 px-2 font-semibold">
                        {item.competition.type === "individual"
                          ? "Student"
                          : "Team"}
                      </th>
                      {item.competition.type === "team" && (
                        <th className="py-3 px-2 font-semibold">
                          Members
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {item.results.map((result) => (
                      <tr
                        key={result._id}
                        className="border-b last:border-0"
                      >
                        <td className="py-3 px-2 whitespace-nowrap">
                          {result.position === 1
                            ? "🥇 1st"
                            : result.position === 2
                            ? "🥈 2nd"
                            : "🥉 3rd"}
                        </td>

                        <td className="py-3 px-2">
                          {item.competition.type === "individual"
                            ? `${result.student?.fullName || "Unknown"} (${
                                result.student?.rollNumber ||
                                result.student?.email ||
                                "N/A"
                              })`
                            : result.team?.teamName || "Unknown Team"}
                        </td>

                        {item.competition.type === "team" && (
                          <td className="py-3 px-2 text-center">
                            {result.team?.members?.length || 0}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No results declared yet
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventResults;
