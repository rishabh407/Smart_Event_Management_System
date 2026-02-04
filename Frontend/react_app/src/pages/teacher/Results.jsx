import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAssignedCompetitions } from "../../api/teacher.api";
import { getCompetitionById } from "../../api/competition.api";
import { getCompetitionRegistrations } from "../../api/registeration.api";
import { declareResults } from "../../api/result.api";
import toast from "react-hot-toast";

const Results = () => {

  const navigate = useNavigate();

  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const [winners, setWinners] = useState([
    { position: 1, participantId: "" },
    { position: 2, participantId: "" },
    { position: 3, participantId: "" }
  ]);

  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH ASSIGNED COMPETITIONS =================

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await getAllAssignedCompetitions();

      // Filter only COMPLETED competitions immediately
      const completed = (res.data || []).filter(
        comp => new Date(comp.endTime) < new Date()
      );

      setCompetitions(completed);

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

  // ================= SEARCH FILTER =================

  const filteredCompetitions = competitions.filter(comp =>
    comp.name.toLowerCase().includes(search.toLowerCase())
  );

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

    const ids = validWinners.map(w => w.participantId);

    if (new Set(ids).size !== ids.length) {
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
          error: "Failed to declare results"
        }
      );

      // Update local state instead of refetching
      setCompetitions(prev =>
        prev.map(c =>
          c._id === selectedCompetition._id
            ? { ...c, resultsDeclared: true }
            : c
        )
      );

      setSelectedCompetition(null);
      setParticipants([]);

      setWinners([
        { position: 1, participantId: "" },
        { position: 2, participantId: "" },
        { position: 3, participantId: "" }
      ]);

    } finally {
      setSubmitting(false);
    }
  };

  // ================= LOADING UI =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <p className="text-gray-600 animate-pulse">
          Loading competitions...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Declare Results
      </h1>

      {/* ================= SEARCH ================= */}

      {!selectedCompetition && (
        <input
          type="text"
          placeholder="Search competition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full md:w-1/2 px-4 py-2 border rounded"
        />
      )}

      {/* ================= COMPETITION LIST ================= */}

      {!selectedCompetition && (

        filteredCompetitions.length === 0 ? (

          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-gray-500">
              No competitions match your search
            </p>
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredCompetitions.map((competition) => (

              <div
                key={competition._id}
                className="bg-white rounded-lg shadow p-5 border"
              >

                <h3 className="font-bold text-lg truncate mb-2">
                  {competition.name}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Ended: {new Date(competition.endTime).toLocaleString()}
                </p>

                <div className="flex flex-col gap-2">

                  <button
                    disabled={competition.resultsDeclared}
                    onClick={() => handleSelectCompetition(competition._id)}
                    className={`py-2 rounded font-medium
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
                    disabled={!competition.resultsDeclared}
                    onClick={() =>
                      navigate(`/teacher/results/${competition._id}`)
                    }
                    className={`py-2 rounded font-medium border
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

        )
      )}

      {/* ================= RESULT FORM ================= */}

      {selectedCompetition && (

        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

          <button
            onClick={() => {
              setSelectedCompetition(null);
              setParticipants([]);
            }}
            className="text-indigo-600 mb-4"
          >
            ← Back to Competitions
          </button>

          <h2 className="text-xl font-bold mb-4">
            {selectedCompetition.name}
          </h2>

          {loadingParticipants ? (

            <p className="text-center">Loading participants...</p>

          ) : participants.length === 0 ? (

            <p className="text-center text-yellow-600">
              Attendance not marked yet
            </p>

          ) : (

            <>
              {winners.map((winner, index) => (

                <div
                  key={index}
                  className="flex gap-3 items-center mb-4"
                >

                  <span className="w-20 font-semibold">
                    {index === 0 ? "🥇 1st" : index === 1 ? "🥈 2nd" : "🥉 3rd"}
                  </span>

                  <select
                    value={winner.participantId}
                    onChange={(e) =>
                      handleWinnerChange(index, e.target.value)
                    }
                    className="flex-1 border px-3 py-2 rounded"
                  >

                    <option value="">
                      -- Select Winner --
                    </option>

                    {participants.map((p) => {

                      const value =
                        selectedCompetition.type === "individual"
                          ? p.student?._id
                          : p.team?._id;

                      const label =
                        selectedCompetition.type === "individual"
                          ? `${p.student?.fullName}`
                          : `${p.team?.teamName}`;

                      return (
                        <option
                          key={p._id}
                          value={value}
                          disabled={isAlreadySelected(value, index)}
                        >
                          {label}
                        </option>
                      );
                    })}

                  </select>

                </div>

              ))}

              <button
                onClick={handleDeclareResults}
                disabled={
                  submitting || winners.every(w => !w.participantId)
                }
                className={`w-full mt-4 py-3 rounded font-semibold text-white
                ${
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
