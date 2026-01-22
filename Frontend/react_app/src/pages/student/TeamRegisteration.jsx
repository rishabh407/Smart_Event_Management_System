import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createTeam,
  joinTeam,
  getMyTeams
} from "../../api/team.api";
import { getMyRegistrations, registerTeam } from "../../api/registeration.api";

const TeamRegistration = () => {

  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [joinTeamId, setJoinTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  useEffect(() => {
    fetchMyTeams();
  }, []);

  const fetchMyTeams = async () => {

    try {
      const res = await getMyTeams(competitionId);
      setTeams(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- CREATE TEAM ----------------
  const handleCreateTeam = async () => {

    if (!teamName.trim()) return alert("Enter team name");

    try {

      await createTeam({
        teamName,
        competitionId
      });

      setTeamName("");
      fetchMyTeams();
    } catch (error) {
      alert(error.response?.data?.message);
    }

  };

  // ---------------- JOIN TEAM ----------------

  const handleJoinTeam = async () => {

    if (!joinTeamId) return alert("Enter team ID");

    try {

      await joinTeam({
        teamId: joinTeamId
      });

      setJoinTeamId("");
      fetchMyTeams();

    } catch (error) {

      alert(error.response?.data?.message);

    }

  };

  // ---------------- SUBMIT TEAM ----------------

  const handleSubmitTeam = async (teamId) => {
    try {
      await registerTeam({
        competitionId,
        teamId
      });
      navigate("/student/registrations");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };
  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Team Registration
      </h1>

      {/* CREATE TEAM */}
      <div className="mb-6">

        <h3 className="font-semibold mb-2">
          Create Team
        </h3>

        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          className="border p-2 mr-2"
        />

        <button
          onClick={handleCreateTeam}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Create
        </button>

      </div>

      {/* JOIN TEAM */}
      <div className="mb-6">

        <h3 className="font-semibold mb-2">
          Join Team
        </h3>

        <input
          value={joinTeamId}
          onChange={(e) => setJoinTeamId(e.target.value)}
          placeholder="Enter Team ID"
          className="border p-2 mr-2"
        />

        <button
          onClick={handleJoinTeam}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Join
        </button>

      </div>

      {/* MY TEAMS */}
      <div>

        <h3 className="font-semibold mb-3">
          My Teams
        </h3>

        {teams.length === 0 && (
          <p>No teams yet</p>
        )}

        {teams.map((team) => (

          <div
            key={team._id}
            className="border p-3 mb-2 rounded"
          >

            <p>
              <b>{team.teamName}</b>
            </p>
            <p className="text-xs text-gray-500 mt-1">
  Team ID: {team._id}
</p>
            <p className="text-sm">
              Members: {team.members.length}
            </p>
{team.isSubmitted && (
  <p className="text-sm text-red-500 mt-2">
    Team already registered
  </p>
)}

{!team.isSubmitted && (
  <button onClick={() => handleSubmitTeam(team._id)}
  className={`mt-2 bg-purple-600 text-white px-3 py-1 rounded`}>
    Submit Team
  </button>
)}

          </div>

        ))}

      </div>

    </div>
  );
};

export default TeamRegistration;
