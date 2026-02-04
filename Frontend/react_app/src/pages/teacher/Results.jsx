import { useEffect, useState } from "react";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
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

  // ================= FETCH ALL ASSIGNED COMPETITIONS =================

  const fetchCompetitions = async () => {

    try {

      setLoading(true);
      const res = await getAllAssignedCompetitions();
      setCompetitions(res.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load competitions");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // ================= SELECT COMPETITION =================

  const handleSelectCompetition = async (competitionId) => {

    try {

      setLoadingParticipants(true);

      const [compRes, regRes] = await Promise.all([
        getCompetitionById(competitionId),
        getCompetitionRegistrations(competitionId)
      ]);

      const competition = compRes.data;
      const registrations = regRes.data?.data || regRes.data || [];

      const attended = registrations.filter(
        r => r.status === "attended"
      );

      setSelectedCompetition(competition);
      setParticipants(attended);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load competition details");

    } finally {

      setLoadingParticipants(false);

    }

  };

  // ================= WINNER CHANGE =================

  const handleWinnerChange = (index, participantId) => {

    const updated = [...winners];
    updated[index].participantId = participantId;
    setWinners(updated);

  };

  // ================= DUPLICATE CHECK =================

  const isAlreadySelected = (participantId, currentIndex) => {

    return winners.some(
      (w, index) =>
        index !== currentIndex &&
        w.participantId === participantId
    );

  };

  // ================= DECLARE RESULTS =================

  const handleDeclareResults = async () => {

    if (!selectedCompetition) return;

    const validWinners = winners.filter(w => w.participantId);

    if (validWinners.length === 0) {
      toast.error("Please select at least one winner");
      return;
    }

    const selectedIds = validWinners.map(w => w.participantId);

    const hasDuplicate =
      new Set(selectedIds).size !== selectedIds.length;

    if (hasDuplicate) {
      toast.error("Same participant cannot win multiple positions");
      return;
    }

    setSubmitting(true);

    try {

      await toast.promise(

        declareResults(selectedCompetition._id, validWinners),

        {
          loading: "Declaring results...",
          success: "Results declared successfully 🏆",
          error: (err) =>
            err.response?.data?.message || "Failed to declare results"
        }

      );

      // RESET STATE

      setSelectedCompetition(null);
      setParticipants([]);

      setWinners([
        { position: 1, participantId: "" },
        { position: 2, participantId: "" },
        { position: 3, participantId: "" }
      ]);

      fetchCompetitions();

    } catch (error) {

      // Toast handles error

    } finally {

      setSubmitting(false);

    }

  };

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    );
  }

  // ================= FILTER COMPLETED =================

  const completedCompetitions = competitions.filter(
    comp => new Date(comp.endTime) < new Date()
  );

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Declare Results
        </h1>

        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Select a completed competition and declare winners
        </p>

      </div>

      {/* ================= COMPETITION LIST ================= */}

      {!selectedCompetition && (

        <>
          {completedCompetitions.length === 0 ? (

            <div className="bg-white p-8 rounded shadow text-center">

              <p className="text-gray-500 text-lg">
                No completed competitions found
              </p>

              <p className="text-gray-400 text-sm mt-2">
                Results can be declared only after competition ends
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {completedCompetitions.map((competition) => (

                <div
                  key={competition._id}
                  className="bg-white rounded-lg shadow p-5 border hover:shadow-lg transition"
                >

                  <div className="flex justify-between items-start mb-3">

                    <h3 className="font-bold text-lg truncate">
                      {competition.name}
                    </h3>

                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      Completed
                    </span>

                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-3">

                    <p><b>Type:</b> {competition.type}</p>
                    <p><b>Venue:</b> {competition.venue}</p>

                    <p>
                      <b>Ended:</b>{" "}
                      {new Date(competition.endTime).toLocaleString()}
                    </p>

                  </div>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {competition.shortDescription}
                  </p>

                  <div className="flex flex-col gap-2">
                    <button
                      disabled={competition.resultsDeclared}
                      onClick={() => handleSelectCompetition(competition._id)}
                      className={`w-full py-2 rounded font-medium transition
                      ${
                        competition.resultsDeclared
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {competition.resultsDeclared
                        ? "✓ Results Declared"
                        : "🏆 Declare Results"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        window.location.assign(
                          `/teacher/results/${competition._id}`
                        )
                      }
                      disabled={!competition.resultsDeclared}
                      className={`w-full py-2 rounded font-medium border transition
                      ${
                        !competition.resultsDeclared
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                      }`}
                    >
                      👁 View Results
                    </button>
                  </div>

                </div>

              ))}

            </div>

          )}
        </>
      )}

      {/* ================= RESULT FORM ================= */}

      {selectedCompetition && (

        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded shadow">

          <button
            onClick={() => {
              setSelectedCompetition(null);
              setParticipants([]);
            }}
            className="text-indigo-600 hover:text-indigo-800 mb-4 text-sm"
          >
            ← Back to Competitions
          </button>

          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {selectedCompetition.name}
          </h2>

          <p className="text-gray-600 mb-5">
            Type: {selectedCompetition.type}
          </p>

          {loadingParticipants ? (

            <p className="text-center text-gray-600">
              Loading participants...
            </p>

          ) : participants.length === 0 ? (

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-center">
              <p className="text-yellow-700">
                Attendance not marked yet
              </p>
            </div>

          ) : (

            <>
              <h3 className="font-semibold mb-4">
                Select Winners
              </h3>

              <div className="space-y-4">

                {winners.map((winner, index) => (

                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 items-center"
                  >

                    <label className="font-semibold w-24">
                      {index === 0
                        ? "🥇 1st"
                        : index === 1
                        ? "🥈 2nd"
                        : "🥉 3rd"}
                    </label>

                    <select
                      value={winner.participantId}
                      onChange={(e) =>
                        handleWinnerChange(index, e.target.value)
                      }
                      className="flex-1 border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                    >

                      <option value="">
                        -- Select Winner --
                      </option>

                      {participants.map((p) => {

                        const participantValue =
                          selectedCompetition.type === "individual"
                            ? p.student?._id
                            : p.team?._id;

                        return (

                          <option
                            key={p._id}
                            value={participantValue}
                            disabled={isAlreadySelected(participantValue, index)}
                          >
                            {selectedCompetition.type === "individual"
                              ? `${p.student?.fullName} (${p.student?.rollNumber || p.student?.email})`
                              : `${p.team?.teamName} (${p.team?.members?.length || 0} members)`}

                          </option>

                        );

                      })}

                    </select>

                  </div>

                ))}

              </div>

              <button
                onClick={handleDeclareResults}
                disabled={
                  submitting ||
                  winners.every(w => !w.participantId)
                }
                className={`w-full mt-6 py-3 rounded font-semibold text-white transition
                ${
                  submitting ||
                  winners.every(w => !w.participantId)
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
