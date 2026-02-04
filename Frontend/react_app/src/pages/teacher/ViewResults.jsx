import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompetitionResults } from "../../api/result.api";
import toast from "react-hot-toast";

const ViewResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await getCompetitionResults(id);
        setCompetition(res.data.competition);
        setResults(res.data.results || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message || "Failed to load competition results"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="p-4 md:p-6">
        <button
          onClick={() => navigate("/teacher/results")}
          className="text-indigo-600 hover:text-indigo-800 mb-4 text-sm"
        >
          ← Back to Results
        </button>
        <p className="text-gray-600">Competition not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <button
        onClick={() => navigate("/teacher/results")}
        className="text-indigo-600 hover:text-indigo-800 mb-4 text-sm"
      >
        ← Back to Results
      </button>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          Results — {competition.name}
        </h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Type: {competition.type} • Venue: {competition.venue}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 text-lg">No results declared yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <table className="w-full text-left text-sm md:text-base">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-2">Position</th>
                <th className="py-2 px-2">
                  {competition.type === "individual" ? "Student" : "Team"}
                </th>
                {competition.type === "team" && (
                  <th className="py-2 px-2">Members Count</th>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r._id} className="border-b last:border-0">
                  <td className="py-2 px-2 font-semibold">
                    {r.position === 1
                      ? "🥇 1st"
                      : r.position === 2
                      ? "🥈 2nd"
                      : "🥉 3rd"}
                  </td>
                  <td className="py-2 px-2">
                    {competition.type === "individual"
                      ? `${r.student?.fullName || "Unknown"} (${
                          r.student?.rollNumber || r.student?.email || "N/A"
                        })`
                      : r.team?.teamName || "Unknown Team"}
                  </td>
                  {competition.type === "team" && (
                    <td className="py-2 px-2">
                      {r.team?.members?.length || 0}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewResults;

