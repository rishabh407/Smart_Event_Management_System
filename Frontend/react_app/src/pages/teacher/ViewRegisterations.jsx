// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getCompetitionRegistrations } from "../../api/registeration.api";

// const ViewRegistrations = () => {

//   const { id } = useParams();

//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchRegistrations = async () => {
//     try {

//       const res = await getCompetitionRegistrations(id);
//       console.log(res.data);
//       // Backend sends: { success: true, data: [...] }
//       setRegistrations(res.data.data);

//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRegistrations();
//   }, []);

//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-bold mb-5">
//         Registered Students
//       </h1>

//       {/* LOADING */}
//       {loading && <p>Loading registrations...</p>}

//       {/* EMPTY */}
//       {!loading && registrations.length === 0 && (
//         <p className="text-gray-500">
//           No students registered yet.
//         </p>
//       )}

//       {/* TABLE */}
//       {!loading && registrations.length > 0 && (

//         <div className="overflow-x-auto bg-white rounded shadow">

//           <table className="min-w-full border">

//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-3 border">#</th>
//                 <th className="p-3 border">Name</th>
//                 <th className="p-3 border">Roll No</th>
//                 <th className="p-3 border">Email</th>
//                 <th className="p-3 border">Registered At</th>
//               </tr>
//             </thead>

//             <tbody>

//               {registrations.map((reg, index) => (

//                 <tr key={reg._id || index}>

//                   <td className="p-2 border text-center">
//                     {index + 1}
//                   </td>

//                   <td className="p-2 border">
//                     {reg.student?.fullName}
//                   </td>

//                   <td className="p-2 border">
//                     {reg.student?.rollNumber}
//                   </td>

//                   <td className="p-2 border">
//                     {reg.student?.email || "N/A"}
//                   </td>

//                   <td className="p-2 border">
//                     {new Date(reg.createdAt).toLocaleString()}
//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       )}

//     </div>
//   );
// };

// export default ViewRegistrations;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";

const ViewRegistrations = () => {

  const { id } = useParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {

      const res = await getCompetitionRegistrations(id);

      // Backend sends: { success: true, data: [...] }
      setRegistrations(res.data.data);

    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-5">
        Registered Participants
      </h1>

      {/* LOADING */}
      {loading && <p>Loading registrations...</p>}

      {/* EMPTY */}
      {!loading && registrations.length === 0 && (
        <p className="text-gray-500">
          No registrations found.
        </p>
      )}

      {/* TABLE */}
      {!loading && registrations.length > 0 && (

        <div className="overflow-x-auto bg-white rounded shadow">

          <table className="min-w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Name / Team</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Registered At</th>
              </tr>
            </thead>

            <tbody>

              {registrations.map((reg, index) => {

                const isTeam = reg.team !== null;

                return (

                  <tr key={reg._id || index}>

                    <td className="p-2 border text-center">
                      {index + 1}
                    </td>

                    {/* NAME OR TEAM NAME */}
                    <td className="p-2 border font-medium">
                      {isTeam
                        ? reg.team?.teamName
                        : reg.student?.fullName
                      }
                    </td>

                    {/* ROLL NUMBER */}
                    <td className="p-2 border">
                      {isTeam
                        ? "TEAM"
                        : reg.student?.rollNumber
                      }
                    </td>

                    {/* EMAIL */}
                    <td className="p-2 border">
                      {isTeam
                        ? "—"
                        : reg.student?.email || "N/A"
                      }
                    </td>

                    {/* TYPE */}
                    <td className="p-2 border text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          isTeam
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isTeam ? "TEAM" : "INDIVIDUAL"}
                      </span>
                    </td>

                    {/* TIME */}
                    <td className="p-2 border">
                      {new Date(reg.createdAt).toLocaleString()}
                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default ViewRegistrations;
