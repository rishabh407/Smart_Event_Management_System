// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getRegistrationsByCompetition } from "../../api/registeration.api";
// const CompetitionRegistrations = () => {

//  const { competitionId } = useParams();

//  const [registrations, setRegistrations] = useState([]);
//  const [loading, setLoading] = useState(true);

//  const fetchRegistrations = async () => {

//   try {
//    const res = await getRegistrationsByCompetition(competitionId);
//    setRegistrations(res.data.data);
//    setLoading(false);
//   } catch (error) {
//    console.error(error);
//    setLoading(false);
//   }

//  };

//  useEffect(() => {
//   fetchRegistrations();
//  }, [competitionId]);

//  if (loading) return <p>Loading registrations...</p>;

//  return (

//   <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">

//    <h1 className="text-2xl font-bold mb-4">
//     Competition Registrations
//    </h1>

//    {registrations.length === 0 && (
//     <p className="text-gray-500">
//      No registrations found.
//     </p>
//    )}

//    {/* TABLE */}

//    {registrations.length > 0 && (

//     <table className="w-full border-collapse border">

//      <thead className="bg-gray-100">
//       <tr>
//        <th className="border p-2">#</th>
//        <th className="border p-2">Participant</th>
//        <th className="border p-2">Type</th>
//        <th className="border p-2">Status</th>
//        <th className="border p-2">Registered At</th>
//       </tr>
//      </thead>

//      <tbody>

//       {registrations.map((reg, index) => (

//        <tr key={reg._id} className="text-center">

//         <td className="border p-2">
//          {index + 1}
//         </td>

//         <td className="border p-2">

//          {/* INDIVIDUAL */}
//          {reg.student && (
//           <div>
//            <p className="font-medium">
//             {reg.student.fullName}
//            </p>
//            <p className="text-sm text-gray-600">
//             {reg.student.email}
//            </p>
//           </div>
//          )}

//          {/* TEAM */}
//          {reg.team && (
//           <div>
//            <p className="font-medium">
//             {reg.team.teamName}
//            </p>
//            <p className="text-sm text-gray-600">
//             Members: {reg.team.members.length}
//            </p>
//           </div>
//          )}

//         </td>

//         <td className="border p-2">
//          {reg.student ? "Individual" : "Team"}
//         </td>

//         <td className="border p-2">
//          <span
//           className={`px-2 py-1 rounded text-sm ${
//            reg.status === "registered"
//             ? "bg-green-100 text-green-700"
//             : reg.status === "cancelled"
//             ? "bg-red-100 text-red-700"
//             : "bg-blue-100 text-blue-700"
//           }`}
//          >
//           {reg.status}
//          </span>
//         </td>

//         <td className="border p-2">
//          {new Date(reg.createdAt).toLocaleString()}
//         </td>

//        </tr>

//       ))}

//      </tbody>

//     </table>

//    )}

//   </div>

//  );
// };

// export default CompetitionRegistrations;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";
import toast from "react-hot-toast";

const CompetitionRegistrations = () => {

 const { id } = useParams();
 const navigate = useNavigate();

 const [registrations, setRegistrations] = useState([]);
 const [loading, setLoading] = useState(true);

 const fetchData = async () => {

  try {

   const res = await getCompetitionRegistrations(id);
   // Backend returns array directly or wrapped in data
   setRegistrations(res.data.data || res.data || []);
   setLoading(false);

  } catch (error) {

   console.error(error);
   toast.error("Failed to load registrations");
   setLoading(false);

  }

 };

 useEffect(() => {
  fetchData();
 }, [id]);

 if (loading) return <p>Loading registrations...</p>;

 return (
  <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-xl">
   <div className="mb-6">
     <button
       onClick={() => navigate(-1)}
       className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
     >
       ← Back
     </button>
     <h1 className="text-3xl font-bold text-gray-800 mb-2">
       Competition Registrations
     </h1>
     <p className="text-gray-600">
       Total Registrations: <span className="font-semibold">{registrations.length}</span>
     </p>
   </div>

   {registrations.length === 0 ? (
     <div className="bg-gray-50 p-8 rounded-lg text-center">
       <p className="text-gray-500 text-lg">No registrations found for this competition</p>
     </div>
   ) : (
     <div className="overflow-x-auto">
       <table className="w-full border-collapse">
         <thead>
           <tr className="bg-gray-100">
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">#</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Participant</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Type</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Team</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Status</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Attendance</th>
             <th className="p-3 border border-gray-300 text-left font-semibold text-gray-700">Registered At</th>
           </tr>
         </thead>
         <tbody>
           {registrations.map((reg, index) => (
             <tr key={reg._id} className="hover:bg-gray-50 transition-colors">
               <td className="p-3 border border-gray-300 text-gray-700">{index + 1}</td>
               <td className="p-3 border border-gray-300">
                 <div>
                   <p className="font-semibold text-gray-800">
                     {reg.student
                       ? reg.student.fullName
                       : reg.team?.teamName}
                   </p>
                   {reg.student && (
                     <p className="text-sm text-gray-500">
                       {reg.student.rollNumber || reg.student.email}
                     </p>
                   )}
                 </div>
               </td>
               <td className="p-3 border border-gray-300">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                   reg.student
                     ? "bg-blue-100 text-blue-700"
                     : "bg-purple-100 text-purple-700"
                 }`}>
                   {reg.student ? "Individual" : "Team"}
                 </span>
               </td>
               <td className="p-3 border border-gray-300 text-gray-700">
                 {reg.team?.teamName || "-"}
               </td>
               <td className="p-3 border border-gray-300">
                 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                   reg.status === "registered"
                     ? "bg-green-100 text-green-700"
                     : reg.status === "attended"
                     ? "bg-blue-100 text-blue-700"
                     : "bg-red-100 text-red-700"
                 }`}>
                   {reg.status.toUpperCase()}
                 </span>
               </td>
               <td className="p-3 border border-gray-300">
                 {reg.status === "attended" ? (
                   <span className="text-green-600 font-semibold flex items-center gap-1">
                     ✅ Present
                   </span>
                 ) : (
                   <span className="text-orange-500 flex items-center gap-1">
                     ⏳ Pending
                   </span>
                 )}
               </td>
               <td className="p-3 border border-gray-300 text-sm text-gray-600">
                 {new Date(reg.createdAt).toLocaleString()}
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   )}
  </div>
 );

};

export default CompetitionRegistrations;
