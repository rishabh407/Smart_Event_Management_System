// import { useEffect, useState } from "react";
// import { registerTeam } from "../../api/registration.api";
// import { getMyTeams } from "../../api/team.api";

// const TeamRegistration = ({ competition }) => {

//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState("");

//   useEffect(() => {

//     const fetchTeams = async () => {
//       const res = await getMyTeams(competition._id);
//       setTeams(res.data.data);
//     };

//     fetchTeams();

//   }, []);

//   const handleSubmit = async () => {

//     if (!selectedTeam) {
//       return alert("Select team first");
//     }

//     try {

//       await registerTeam({
//         competitionId: competition._id,
//         teamId: selectedTeam
//       });

//       alert("Team Registered");

//     } catch (error) {
//       alert(error.response?.data?.message);
//     }

//   };

//   return (
//     <div className="mt-4">

//       <h3>Select Your Team</h3>

//       <select
//         onChange={(e) => setSelectedTeam(e.target.value)}
//         className="border p-2 w-full"
//       >

//         <option value="">Select Team</option>

//         {teams.map((team) => (
//           <option key={team._id} value={team._id}>
//             {team.name} ({team.members.length} members)
//           </option>
//         ))}

//       </select>

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 text-white px-4 py-2 rounded mt-3"
//       >
//         Register Team
//       </button>

//     </div>
//   );
// };

// export default TeamRegistration;

import React from 'react'

const TeamRegisteration = ({ competition }) => {
  return (
    <div>
       Hi , I am Team Registeration , Teams . 
    </div>
  )
}

export default TeamRegisteration
