import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    fetchMyTeams();
  }, [competitionId]);

  const fetchMyTeams = async () => {
    try {
      const res = await getMyTeams(competitionId);
      setTeams(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Please enter a team name");
      return;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter a join code");
      return;
    }

    try {
      setLoading(true);
      await joinTeam({
        joinCode: joinCode.trim().toUpperCase()
      });
      toast.success("Joined team successfully!");
      setJoinCode("");
      fetchMyTeams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join team");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTeam = async (teamId) => {
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

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Team Registration</h3>
        <p className="text-sm text-blue-800">
          Create a team or join an existing one using a join code. Team size: {competition?.minTeamSize || 1} - {competition?.maxTeamSize || "unlimited"} members.
        </p>
      </div>

      {/* Create Team Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Create New Team</h3>
        <div className="flex gap-3">
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleCreateTeam()}
          />
          <button
            onClick={handleCreateTeam}
            disabled={loading}
            className={`bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>

      {/* Join Team Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">Join Existing Team</h3>
        <div className="flex gap-3">
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="Enter join code"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 uppercase focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleJoinTeam()}
          />
          <button
            onClick={handleJoinTeam}
            disabled={loading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Joining..." : "Join Team"}
          </button>
        </div>
      </div>

      {/* My Teams Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-lg mb-4">My Teams</h3>
        
        {teams.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No teams yet. Create a team or join one to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{team.teamName}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Members: {team.members?.length || 0} / {competition?.maxTeamSize || "∞"}
                    </p>
                  </div>
                  {team.isSubmitted ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✓ Registered
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      Draft
                    </span>
                  )}
                </div>

                {/* Join Code */}
                <div className="bg-gray-50 rounded p-3 mb-3">
                  <p className="text-xs text-gray-600 mb-1">Join Code:</p>
                  <p className="font-mono font-bold text-lg">{team.joinCode}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Share this code with teammates to join
                  </p>
                </div>

                {/* Submit Button */}
                {!team.isSubmitted && (
                  <button
                    onClick={() => handleSubmitTeam(team._id)}
                    disabled={submitting === team._id || (team.members?.length || 0) < (competition?.minTeamSize || 1)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                      submitting === team._id || (team.members?.length || 0) < (competition?.minTeamSize || 1)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {submitting === team._id ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Registering...
                      </span>
                    ) : (team.members?.length || 0) < (competition?.minTeamSize || 1) ? (
                      `Need ${(competition?.minTeamSize || 1) - (team.members?.length || 0)} more member(s)`
                    ) : (
                      "✅ Register Team"
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRegistration;
