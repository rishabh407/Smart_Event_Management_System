import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createTeam,
  joinTeam,
  getMyTeams
} from "../../api/team.api";
import { registerTeam } from "../../api/registeration.api";
import toast from "react-hot-toast";

const TeamRegistration = ({ competition }) => {

  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [teams, setTeams] = useState([]);

  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchMyTeams();
  }, [competitionId]);

  const fetchMyTeams = async () => {
    try {
      const res = await getMyTeams(competitionId);
      setTeams(res.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ================= CREATE TEAM =================

  const handleCreateTeam = async () => {

    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    if (creating) return;

    try {

      setCreating(true);

      await createTeam({
        teamName: teamName.trim(),
        competitionId
      });

      toast.success("Team created successfully!");

      setTeamName("");

      fetchMyTeams();

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to create team");

    } finally {

      setCreating(false);

    }
  };

  // ================= JOIN TEAM =================

  const handleJoinTeam = async () => {

    if (!joinCode.trim()) {
      toast.error("Please enter a join code");
      return;
    }

    if (joining) return;

    try {

      setJoining(true);

      await joinTeam({
        joinCode: joinCode.trim().toUpperCase()
      });

      toast.success("Joined team successfully!");

      setJoinCode("");

      fetchMyTeams();

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to join team");

    } finally {

      setJoining(false);

    }
  };

  // ================= REGISTER TEAM =================

  const handleSubmitTeam = async (teamId) => {

    if (submitting) return;

    try {

      setSubmitting(teamId);

      await registerTeam({
        competitionId,
        teamId
      });

      toast.success("Team registered successfully! 🎉");

      navigate("/student/registrations");

    } catch (error) {

      toast.error(error.response?.data?.message || "Failed to register team");

    } finally {

      setSubmitting(null);

    }
  };

  // ================= TEAM SIZE LOGIC =================

  const minSize = competition?.minTeamSize || 1;
  const maxSize = competition?.maxTeamSize || "∞";

  return (
    <div className="space-y-6">

      {/* INFO CARD */}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">

        <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
          Team Registration
        </h3>

        <p className="text-xs sm:text-sm text-blue-800">
          Create a team or join an existing one using a join code. Team size: {minSize} - {maxSize} members.
        </p>

      </div>

      {/* CREATE TEAM */}

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">

        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
          Create New Team
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
          />

          <button
            onClick={handleCreateTeam}
            disabled={creating}
            className={`px-6 py-2 rounded-lg font-medium transition
              ${creating
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"}
            `}
          >
            {creating ? "Creating..." : "Create Team"}
          </button>

        </div>

      </div>

      {/* JOIN TEAM */}

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">

        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
          Join Existing Team
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">

          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter join code"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleJoinTeam()}
          />

          <button
            onClick={handleJoinTeam}
            disabled={joining}
            className={`px-6 py-2 rounded-lg font-medium transition
              ${joining
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"}
            `}
          >
            {joining ? "Joining..." : "Join Team"}
          </button>

        </div>

      </div>

      {/* MY TEAMS */}

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">

        <h3 className="font-semibold text-base sm:text-lg mb-4">
          My Teams
        </h3>

        {teams.length === 0 ? (

          <p className="text-gray-500 text-center py-8">
            No teams yet. Create a team or join one to get started.
          </p>

        ) : (

          <div className="space-y-4">

            {teams.map((team) => {

              const memberCount = team.members?.length || 0;
              const canSubmit = memberCount >= minSize;

              return (

                <div
                  key={team._id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-start mb-3">

                    <div>
                      <h4 className="font-semibold text-base sm:text-lg">
                        {team.teamName}
                      </h4>

                      <p className="text-sm text-gray-600 mt-1">
                        Members: {memberCount} / {maxSize}
                      </p>
                    </div>

                    {team.isSubmitted ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                        ✓ Registered
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs sm:text-sm font-medium">
                        Draft
                      </span>
                    )}

                  </div>

                  {/* JOIN CODE */}

                  <div className="bg-gray-50 rounded p-3 mb-3">

                    <p className="text-xs text-gray-600 mb-1">
                      Join Code:
                    </p>

                    <p className="font-mono font-bold text-base sm:text-lg">
                      {team.joinCode}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Share this code with teammates to join
                    </p>

                  </div>

                  {/* REGISTER BUTTON */}

                  {!team.isSubmitted && (

                    <button
                      onClick={() => handleSubmitTeam(team._id)}
                      disabled={submitting === team._id || !canSubmit}
                      className={`w-full py-2 rounded-lg font-medium transition
                        ${submitting === team._id || !canSubmit
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-purple-600 hover:bg-purple-700 text-white"}
                      `}
                    >

                      {submitting === team._id ? (

                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Registering...
                        </span>

                      ) : !canSubmit ? (

                        `Need ${minSize - memberCount} more member(s)`

                      ) : (

                        "✅ Register Team"

                      )}

                    </button>

                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
};

export default TeamRegistration;
