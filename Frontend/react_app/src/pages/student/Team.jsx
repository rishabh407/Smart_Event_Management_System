import { useEffect, useState } from "react";
import {
  getMyTeamsByUserId,
  leaveTeam,
  deleteTeam
} from "../../api/team.api";
import { getMe } from "../../api/auth.api";
import { registerTeam } from "../../api/registeration.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Team = () => {

  const [userTeams, setUserTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchMyTeams();
  }, []);

  // ================= FETCH USER =================

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUserId(res.data?.user?.id);
    } catch {
      toast.error("Failed to load user");
    }
  };

  // ================= FETCH TEAMS =================

  const fetchMyTeams = async () => {
    try {
      const res = await getMyTeamsByUserId();
      setUserTeams(res.data?.datateams || []);
    } catch {
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  // ================= LEAVE TEAM =================

  const handleLeave = async (teamId) => {

    if (!window.confirm("Leave this team?")) return;

    try {

      setActionLoading(teamId);

      await leaveTeam({ teamId });

      toast.success("Left team successfully");

      fetchMyTeams();

    } catch (error) {

      toast.error(error.response?.data?.message || "Leave failed");

    } finally {

      setActionLoading(null);

    }
  };

  // ================= DELETE TEAM =================

  const handleDelete = async (teamId) => {

    if (!window.confirm("Delete this team permanently?")) return;

    try {

      setActionLoading(teamId);

      await deleteTeam(teamId);

      toast.success("Team deleted");

      fetchMyTeams();

    } catch (error) {

      toast.error(error.response?.data?.message || "Delete failed");

    } finally {

      setActionLoading(null);

    }
  };

  // ================= SUBMIT TEAM =================

  const handleSubmitTeam = async (teamId, competitionId) => {

    try {

      setActionLoading(teamId);

      await registerTeam({
        competitionId,
        teamId
      });

      toast.success("Team submitted successfully");

      setUserTeams(prev =>
        prev.map(team =>
          team._id === teamId
            ? { ...team, isSubmitted: true }
            : team
        )
      );

      setTimeout(() => {
        navigate("/student/registrations");
      }, 500);

    } catch (error) {

      toast.error(error.response?.data?.message || "Submit failed");

    } finally {

      setActionLoading(null);

    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* HEADER */}

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        My Teams
      </h1>

      {/* EMPTY */}

      {userTeams.length === 0 && (

        <div className="bg-white rounded-lg shadow p-8 text-center">

          <div className="text-5xl mb-3">👥</div>

          <p className="text-gray-500">
            You have not joined any teams
          </p>

        </div>

      )}

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {userTeams.map((team) => {

          const isLeader = team.leader?._id === userId;
          const isLocked = team.isSubmitted;

          return (

            <div
              key={team._id}
              className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col"
            >

              {/* TITLE */}

              <h2 className="font-semibold text-lg mb-1">
                {team.teamName}
              </h2>

              {/* INFO */}

              <p className="text-sm text-gray-600">
                Competition: {team.competitionId?.name || "Competition"}
              </p>

              <p className="text-sm text-gray-600">
                Members: {team.members?.length || 0}
              </p>

              <p className="text-sm mt-1">
                Status:
                <span
                  className={`ml-1 font-medium ${
                    isLocked ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isLocked ? "Submitted" : "Not Submitted"}
                </span>
              </p>

              {/* ACTIONS */}

              {!isLocked && (

                <div className="mt-4 flex flex-wrap gap-2">

                  {isLeader ? (

                    <>
                      <button
                        onClick={() => handleDelete(team._id)}
                        disabled={actionLoading === team._id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                      >
                        Delete Team
                      </button>

                      <button
                        onClick={() =>
                          handleSubmitTeam(team._id, team.competitionId?._id)
                        }
                        disabled={actionLoading === team._id}
                        className={`px-3 py-1 rounded text-sm text-white transition ${
                          actionLoading === team._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700"
                        }`}
                      >
                        {actionLoading === team._id
                          ? "Submitting..."
                          : "Submit Team"}
                      </button>
                    </>

                  ) : (

                    <button
                      onClick={() => handleLeave(team._id)}
                      disabled={actionLoading === team._id}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Leave Team
                    </button>

                  )}

                </div>

              )}

              {isLocked && (

                <p className="text-xs text-gray-500 mt-3">
                  Team locked after submission
                </p>

              )}

            </div>

          );

        })}

      </div>

    </div>
  );
};

export default Team;
