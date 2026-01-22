// import React, { useEffect, useState } from "react";
// import {
//   getMyTeamsByUserId,
//   leaveTeam,
//   deleteTeam
// } from "../../api/team.api";
// import { getMe } from "../../api/auth.api";
// import { registerTeam } from "../../api/registeration.api";
// import { useNavigate } from "react-router-dom";

// const Team = () => {
//   const [userTeams, setUserTeams] = useState([]);
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   // const [competitionId, setcompetitionId] = useState(null);
//   const [userId, setUserId] = useState(null);
//   useEffect(() => {
    
//     fetchUser();
//     fetchMyTeams();
//   }, []);
//   // ---------------- GET LOGGED USER ----------------
// console.log(userTeams);
//   const fetchUser = async () => {
//     try {
//       const res = await getMe();
//       setUserId(res.data.user.id);
//     } catch (error) {
//       console.error("User fetch failed");
//     }
//   };

//   // ---------------- GET TEAMS ----------------
//   const fetchMyTeams = async () => {

//     try {

//       const res = await getMyTeamsByUserId();
//       setUserTeams(res.data.datateams);
//       // setcompetitionId(res.data.datateams.competitionId);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }

//   };

//   // ---------------- LEAVE TEAM ----------------

//   const handleLeave = async (teamId) => {

//     const confirmLeave = window.confirm(
//       "Are you sure you want to leave this team?"
//     );

//     if (!confirmLeave) return;

//     try {

//       setActionLoading(teamId);
//       await leaveTeam({ teamId });
//       fetchMyTeams();

//     } catch (error) {

//       alert(error.response?.data?.message);

//     } finally {

//       setActionLoading(null);

//     }

//   };

//   // ---------------- DELETE TEAM ----------------

//   const handleDelete = async (teamId) => {
//     const confirmDelete = window.confirm(
//       "This will delete your team permanently. Continue?"
//     );

//     if (!confirmDelete) return;

//     try {

//       setActionLoading(teamId);

//       await deleteTeam(teamId);

//       fetchMyTeams();

//     } catch (error) {

//       alert(error.response?.data?.message);

//     } finally {

//       setActionLoading(null);

//     }

//   };
//     // ---------------- SUBMIT TEAM ----------------
  
//     // const handleSubmitTeam = async (teamId,competitionId) => {
//     //   // console.log(competitionId);
//     //   try {
//     //     setActionLoading(teamId);
//     //     await registerTeam({
//     //       competitionId,
//     //       teamId
//     //     });
//     //     navigate("/student/registrations");
//     //   } catch (error) {
//     //     alert(error.response?.data?.message);
//     //   }
//     // };

//     const handleSubmitTeam = async (teamId, competitionId) => {

//   try {

//     setActionLoading(teamId);

//     await registerTeam({
//       competitionId,
//       teamId
//     });

//     // Update UI instantly
//     setUserTeams(prev =>
//       prev.map(team =>
//         team._id === teamId
//           ? { ...team, isSubmitted: true }
//           : team
//       )
//     );
//  navigate("/student/registrations");
//   } catch (error) {

//     alert(error.response?.data?.message);

//   } finally {

//     setActionLoading(null);

//   }

// };


//   // ---------------- UI ----------------

//   if (loading) {
//     return <p className="text-center mt-10">Loading teams...</p>;
//   }

//   return (
//     <div>

//       <h1 className="text-2xl font-bold mb-6">
//         My Teams
//       </h1>

//       {userTeams.length === 0 && (
//         <p className="text-gray-500">
//           You have not joined any teams
//         </p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {userTeams.map((team) => {

//           const isLeader = team.leader?._id === userId;
//           const isLocked = team?.isSubmitted;
//           {/* console.log(isLeader); */}
//           {/* console.log(userId); */}
//           {/* console.log(team.leader?._id); */}
//           return (

//             <div
//               key={team._id}
//               className="border p-4 rounded bg-white shadow-sm"
//             >

//               <h2 className="font-semibold text-lg">
//                 {team.teamName}
//               </h2>

//               <p className="text-sm text-gray-600">
//                 Competition: {team.competitionId?.name}
//               </p>

//               <p className="text-sm mt-1">
//                 Members: {team.members.length}
//               </p>

//               <p className="text-sm mt-1">
//                 Status:
//                 <span
//                   className={`ml-1 font-medium ${
//                     isLocked
//                       ? "text-red-600"
//                       : "text-green-600"
//                   }`}
//                 >
//                   {isLocked ? "Submitted" : "Not Submitted"}
//                 </span>
//               </p>

//               {!isLocked && (

//                 <div className="mt-3 flex gap-2">
//                     <p>{team._id}</p>
//                   {isLeader && (
//                    <div className="flex gap-5">
//                     <button
//                       onClick={() => handleDelete(team._id)}
//                       disabled={actionLoading === team._id}
//                       className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//                     >
//                       {actionLoading === team._id
//                         ? "Deleting..."
//                         : "Delete Team"}
//                     </button>
//                     <button
//                       onClick={() => handleSubmitTeam(team._id,team.competitionId._id)}
//                       className="bg-purple-600 text-white px-3 py-1 rounded text-sm"
//                     >
//                         Submit Team
//                     </button>
//                       </div>
//                   )}

//                   {!isLeader && (

//                     <button
//                       onClick={() => handleLeave(team._id)}
//                       disabled={actionLoading === team._id}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
//                     >
//                       {actionLoading === team._id
//                         ? "Leaving..."
//                         : "Leave Team"}
//                     </button>

//                   )}

//                 </div>

//               )}

//               {isLocked && (

//                 <p className="text-xs text-gray-500 mt-2">
//                   Team locked after registration submission
//                 </p>

//               )}

//             </div>

//           );

//         })}

//       </div>

//     </div>
//   );
// };

// export default Team;


import React, { useEffect, useState } from "react";
import {
  getMyTeamsByUserId,
  leaveTeam,
  deleteTeam
} from "../../api/team.api";
import { getMe } from "../../api/auth.api";
import { registerTeam } from "../../api/registeration.api";
import { useNavigate } from "react-router-dom";

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

  // ---------------- GET USER ----------------

  const fetchUser = async () => {
    try {
      const res = await getMe();
      setUserId(res.data.user.id);
    } catch (error) {
      console.error("User fetch failed");
    }
  };

  // ---------------- GET TEAMS ----------------

  const fetchMyTeams = async () => {
    try {
      const res = await getMyTeamsByUserId();
      setUserTeams(res.data.datateams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LEAVE TEAM ----------------

  const handleLeave = async (teamId) => {

    if (!window.confirm("Leave this team?")) return;

    try {

      setActionLoading(teamId);

      await leaveTeam({ teamId });

      fetchMyTeams();

    } catch (error) {

      alert(error.response?.data?.message);

    } finally {

      setActionLoading(null);

    }

  };

  // ---------------- DELETE TEAM ----------------

  const handleDelete = async (teamId) => {

    if (!window.confirm("Delete this team permanently?")) return;

    try {

      setActionLoading(teamId);

      await deleteTeam(teamId);

      fetchMyTeams();

    } catch (error) {

      alert(error.response?.data?.message);

    } finally {

      setActionLoading(null);

    }

  };

  // ---------------- SUBMIT TEAM ----------------

  const handleSubmitTeam = async (teamId, competitionId) => {

    try {

      setActionLoading(teamId);

      await registerTeam({
        competitionId,
        teamId
      });

      // Optimistic UI update
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

      alert(error.response?.data?.message);

    } finally {

      setActionLoading(null);

    }

  };

  // ---------------- UI ----------------

  if (loading) {
    return <p className="text-center mt-10">Loading teams...</p>;
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        My Teams
      </h1>

      {userTeams.length === 0 && (
        <p className="text-gray-500">
          You have not joined any teams
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {userTeams.map((team) => {

          const isLeader = team.leader?._id === userId;
          const isLocked = team.isSubmitted;

          return (

            <div
              key={team._id}
              className="border p-4 rounded bg-white shadow-sm"
            >

              <h2 className="font-semibold text-lg">
                {team.teamName}
              </h2>

              <p className="text-sm text-gray-600">
                Competition: {team.competitionId?.name}
              </p>

              <p className="text-sm">
                Members: {team.members.length}
              </p>

              <p className="text-sm">
                Status:
                <span className={`ml-1 font-medium ${
                  isLocked ? "text-red-600" : "text-green-600"
                }`}>
                  {isLocked ? "Submitted" : "Not Submitted"}
                </span>
              </p>

              {!isLocked && (

                <div className="mt-3 flex gap-2">

                  {isLeader && (

                    <>
                      <button
                        onClick={() => handleDelete(team._id)}
                        disabled={actionLoading === team._id}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete Team
                      </button>

                      <button
                        onClick={() => handleSubmitTeam(team._id, team.competitionId._id)}
                        disabled={actionLoading === team._id}
                        className={`px-3 py-1 rounded text-sm text-white ${
                          actionLoading === team._id
                            ? "bg-gray-400"
                            : "bg-purple-600"
                        }`}
                      >
                        {actionLoading === team._id ? "Submitting..." : "Submit Team"}
                      </button>
                    </>

                  )}

                  {!isLeader && (

                    <button
                      onClick={() => handleLeave(team._id)}
                      disabled={actionLoading === team._id}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Leave Team
                    </button>

                  )}

                </div>

              )}

              {isLocked && (

                <p className="text-xs text-gray-500 mt-2">
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
