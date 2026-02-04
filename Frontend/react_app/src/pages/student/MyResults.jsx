import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResults } from "../../api/result.api";
import toast from "react-hot-toast";

const MyResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultsData, setResultsData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await getMyResults();
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

  const filteredResults = resultsData.filter((item) =>
    item.competition.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          My Results
        </h1>
        <p className="text-gray-600 text-sm sm:text-base mt-1">
          View results for competitions you participated in
        </p>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-lg shadow">
        <input
          type="text"
          placeholder="Search competitions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* EMPTY STATE */}
      {filteredResults.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-gray-500 text-lg mb-2">
            {search ? "No results found" : "No results available yet"}
          </p>
          {!search && (
            <p className="text-gray-400 text-sm">
              Results will appear here once they are declared for competitions you attended
            </p>
          )}
        </div>
      )}

      {/* RESULTS LIST */}
      <div className="space-y-6">
        {filteredResults.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-5 sm:p-6 border"
          >
            {/* COMPETITION HEADER */}
            <div className="mb-4 pb-4 border-b">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {item.competition.name}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span>📍 {item.competition.venue}</span>
                <span>📅 {new Date(item.competition.endTime).toLocaleDateString()}</span>
                <span className="capitalize">👥 {item.competition.type}</span>
              </div>
            </div>

            {/* MY POSITION HIGHLIGHT */}
            {item.myPosition && (
              <div className="mb-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">
                  🎉 Your Position:{" "}
                  <span className="text-2xl">
                    {item.myPosition === 1
                      ? "🥇 1st Place"
                      : item.myPosition === 2
                      ? "🥈 2nd Place"
                      : "🥉 3rd Place"}
                  </span>
                </p>
              </div>
            )}

            {/* RESULTS TABLE */}
            {item.results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
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
                      <tr
                        key={result._id}
                        className={`border-b ${
                          item.myPosition === result.position
                            ? "bg-yellow-50 font-semibold"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-2">
                          {result.position === 1
                            ? "🥇 1st"
                            : result.position === 2
                            ? "🥈 2nd"
                            : "🥉 3rd"}
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

export default MyResults;
