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
import { useParams } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";

const CompetitionRegistrations = () => {

 const { id } = useParams();

 const [registrations, setRegistrations] = useState([]);
 const [loading, setLoading] = useState(true);

 const fetchData = async () => {

  try {

   const res = await getCompetitionRegistrations(id);
   console.log(res.data);
   setRegistrations(res.data.data);
   setLoading(false);

  } catch (error) {

   console.error(error);
   setLoading(false);

  }

 };

 useEffect(() => {
  fetchData();
 }, [id]);

 if (loading) return <p>Loading registrations...</p>;

 return (

  <div className="bg-white p-6 rounded shadow">

   <h1 className="text-xl font-bold mb-4">
    Competition Registrations
   </h1>

   {registrations.length === 0 ? (

    <p className="text-gray-500">
     No registrations found
    </p>

   ) : (

    <div className="overflow-x-auto">

     <table className="w-full border">

      <thead className="bg-gray-100">

       <tr>
        <th className="p-2 border">Participant</th>
        <th className="p-2 border">Type</th>
        <th className="p-2 border">Team</th>
        <th className="p-2 border">Status</th>
        <th className="p-2 border">Attendance</th>
       </tr>

      </thead>

      <tbody>

       {registrations.map(reg => (

        <tr key={reg._id} className="text-center">

         <td className="p-2 border">
          {reg.student
           ? reg.student.fullName
           : reg.team?.teamName}
         </td>

         <td className="p-2 border">
          {reg.student ? "Individual" : "Team"}
         </td>

         <td className="p-2 border">
          {reg.team?.teamName || "-"}
         </td>

         <td className="p-2 border">
          {reg.status}
         </td>

         {/* <td className="p-2 border">
          {reg.status === "attended"
           ? "Present"
           : "Pending"}
         </td> */}

<td className="p-2 border">
 {reg.status === "attended"
  ? (
   <span className="text-green-600 font-semibold">
    Present
   </span>
  )
  : (
   <span className="text-orange-500">
    Pending
   </span>
  )
 }

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
