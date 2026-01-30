import { useEffect, useState } from "react";
import { getinchargeteacherscompetitions } from "../../api/teacher.api";
import { getCompetitionById } from "../../api/competition.api";
import { getCompetitionRegistrations } from "../../api/registeration.api";
import { declareResults } from "../../api/result.api";
import toast from "react-hot-toast";

const Results = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [winners, setWinners] = useState([
    { position: 1, participantId: "" },
    { position: 2, participantId: "" },
    { position: 3, participantId: "" }
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getinchargeteacherscompetitions();
      setCompetitions(res.data);
    } catch (error) {
      console.error("Error fetching competitions:", error);
      toast.error("Failed to load competitions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleSelectCompetition = async (competitionId) => {
    try {
      setLoadingParticipants(true);
      const [compRes, regRes] = await Promise.all([
        getCompetitionById(competitionId),
        getCompetitionRegistrations(competitionId)
      ]);
      
      const competition = compRes.data;
      const registrations = regRes.data.data || regRes.data || [];
      
      // Filter only attended registrations
      const attended = registrations.filter(r => r.status === "attended");
      
      setSelectedCompetition(competition);
      setParticipants(attended);
    } catch (error) {
      console.error("Error loading competition:", error);
      toast.error("Failed to load competition details");
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleWinnerChange = (index, participantId) => {
    const newWinners = [...winners];
    newWinners[index].participantId = participantId;
    setWinners(newWinners);
  };

  const handleDeclareResults = async () => {
    if (!selectedCompetition) return;

    // Filter out empty winners
    const validWinners = winners.filter(w => w.participantId);
    
    if (validWinners.length === 0) {
      toast.error("Please select at least one winner");
      return;
    }

    setSubmitting(true);
    try {
      await toast.promise(
        declareResults(selectedCompetition._id, validWinners),
        {
          loading: 'Declaring results...',
          success: 'Results declared successfully! 🏆',
          error: (err) => err.response?.data?.message || 'Failed to declare results',
        }
      );
      
      // Reset and refresh
      setSelectedCompetition(null);
      setParticipants([]);
      setWinners([
        { position: 1, participantId: "" },
        { position: 2, participantId: "" },
        { position: 3, participantId: "" }
      ]);
      fetchCompetitions();
    } catch (error) {
      // Error handled by toast
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  // Filter completed competitions
  const completedCompetitions = competitions.filter((comp) => {
    const now = new Date();
    return new Date(comp.endTime) < now;
  });

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Declare Results</h1>
        <p className="text-gray-600 mt-1">
          Select a completed competition to declare winners (1st, 2nd, 3rd place)
        </p>
      </div>

      {!selectedCompetition ? (
        <>
          {/* ================= EMPTY STATE ================= */}
          {completedCompetitions.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No completed competitions found.</p>
              <p className="text-gray-400 text-sm mt-2">
                Results can only be declared for competitions that have ended.
              </p>
            </div>
          )}

          {/* ================= COMPETITION CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCompetitions.map((competition) => (
              <div
                key={competition._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{competition.name}</h3>
                  <span className="px-3 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
                    Completed
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  <p><strong>Type:</strong> {competition.type}</p>
                  <p><strong>Venue:</strong> {competition.venue}</p>
                  <p>
                    <strong>Ended:</strong> {new Date(competition.endTime).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {competition.shortDescription}
                </p>

                <button
                  onClick={() => handleSelectCompetition(competition._id)}
                  disabled={competition.resultsDeclared}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                    competition.resultsDeclared
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {competition.resultsDeclared ? "✓ Results Declared" : "🏆 Declare Results"}
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <div className="mb-6">
            <button
              onClick={() => {
                setSelectedCompetition(null);
                setParticipants([]);
                setWinners([
                  { position: 1, participantId: "" },
                  { position: 2, participantId: "" },
                  { position: 3, participantId: "" }
                ]);
              }}
              className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
            >
              ← Back to Competitions
            </button>
            <h2 className="text-2xl font-bold text-gray-800">{selectedCompetition.name}</h2>
            <p className="text-gray-600">Type: {selectedCompetition.type}</p>
          </div>

          {loadingParticipants ? (
            <p className="text-center text-gray-600">Loading participants...</p>
          ) : participants.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800">No attended participants found. Attendance must be marked first.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Winners</h3>
                <div className="space-y-4">
                  {winners.map((winner, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <label className="w-24 font-semibold text-gray-700">
                        {index + 1 === 1 ? "🥇 1st" : index + 1 === 2 ? "🥈 2nd" : "🥉 3rd"} Place:
                      </label>
                      <select
                        value={winner.participantId}
                        onChange={(e) => handleWinnerChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Select Winner --</option>
                        {participants.map((p) => (
                          <option key={p._id} value={selectedCompetition.type === "individual" ? p.student?._id : p.team?._id}>
                            {selectedCompetition.type === "individual"
                              ? `${p.student?.fullName} (${p.student?.rollNumber || p.student?.email})`
                              : `${p.team?.teamName} (${p.team?.members?.length || 0} members)`}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleDeclareResults}
                disabled={submitting || winners.every(w => !w.participantId)}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-colors duration-200 shadow-md ${
                  submitting || winners.every(w => !w.participantId)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {submitting ? "Declaring Results..." : "🏆 Declare Results"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Results;
