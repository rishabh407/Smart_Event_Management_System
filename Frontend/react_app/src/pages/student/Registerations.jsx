import { useEffect, useState } from "react";
import { cancelRegistration, getMyRegistrations } from "../../api/registeration.api";
const MyRegistrations = () => {

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  useEffect(() => {

    const fetchRegistrations = async () => {

      try {

        const res = await getMyRegistrations();
        setRegistrations(res.data.data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

    fetchRegistrations();

  }, []);

  // ---------------- CANCEL HANDLER ----------------

  const handleCancel = async (registrationId) => {

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {

      setCancelLoadingId(registrationId);

      await cancelRegistration(registrationId);

      // Update UI instantly
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg._id === registrationId
            ? { ...reg, status: "cancelled" }
            : reg
      )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    } finally {
      setCancelLoadingId(null);
    }
  };

  // ---------------- UI ----------------

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading registrations...
      </p>
    );
  }

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        My Registrations
      </h1>

      {registrations.length === 0 && (
        <p className="text-gray-500">
          No registrations yet
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {registrations.map((reg) => (

          <div
            key={reg._id}
            className="border p-4 rounded shadow-sm bg-white"
          >

            {/* Competition Name */}
            <h2 className="font-semibold text-lg">
              {reg.competition?.name}
            </h2>

            {/* Venue */}
            <p className="text-sm text-gray-600">
              Venue: {reg.competition?.venue}
            </p>
             {reg.team && (
  <p className="text-xs text-gray-500">
    Team: {reg.team.teamName}
  </p>
)}
            {/* Status */}
            <p className="text-sm mt-1">
              Status:
              <span
                className={`ml-1 font-medium ${
                  reg.status === "registered"
                    ? "text-green-600"
                    : reg.status === "cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {reg.status}
              </span>
            </p>
        
            {/* Date */}
            <p className="text-xs text-gray-400 mt-1">
              Registered On:{" "}
              {new Date(reg.createdAt).toLocaleDateString()}
            </p>

            {/* QR Code */}
            {reg.qrCode && (
              <img
                src={reg.qrCode}
                alt="QR Code"
                className="mt-3 w-32 border rounded"
              />
            )}

            {/* Cancel Button */}
            {reg.status === "registered" && (

              <button
                onClick={() => handleCancel(reg._id)}
                disabled={cancelLoadingId === reg._id}
                className={`mt-4 px-3 py-1 text-sm rounded text-white transition
                  ${
                    cancelLoadingId === reg._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }
                `}
              >

                {cancelLoadingId === reg._id
                  ? "Cancelling..."
                  : "Cancel Registration"}

              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
};

export default MyRegistrations;

// import { useEffect, useState } from "react";
// import {
//   cancelRegistration,
//   getMyRegistrations
// } from "../../api/registeration.api";

// const MyRegistrations = () => {

//   const [registrations, setRegistrations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelLoadingId, setCancelLoadingId] = useState(null);

//   // Logged in user
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userId = user?._id;

//   useEffect(() => {

//     const fetchRegistrations = async () => {

//       try {

//         const res = await getMyRegistrations();
//         setRegistrations(res.data.data);

//       } catch (error) {

//         console.error(error);

//       } finally {

//         setLoading(false);

//       }

//     };

//     fetchRegistrations();

//   }, []);

//   // ---------------- CANCEL HANDLER ----------------

//   const handleCancel = async (registrationId) => {

//     const confirmCancel = window.confirm(
//       "Are you sure you want to cancel this registration?"
//     );

//     if (!confirmCancel) return;

//     try {

//       setCancelLoadingId(registrationId);

//       await cancelRegistration(registrationId);

//       // Update UI instantly
//       setRegistrations((prev) =>
//         prev.map((reg) =>
//           reg._id === registrationId
//             ? { ...reg, status: "cancelled" }
//             : reg
//         )
//       );

//     } catch (error) {

//       alert(error.response?.data?.message || "Cancel failed");

//     } finally {

//       setCancelLoadingId(null);

//     }

//   };

//   // ---------------- UI ----------------

//   if (loading) {
//     return (
//       <p className="text-center mt-10">
//         Loading registrations...
//       </p>
//     );
//   }

//   return (
//     <div>

//       <h1 className="text-2xl font-bold mb-6">
//         My Registrations
//       </h1>

//       {registrations.length === 0 && (
//         <p className="text-gray-500">
//           No registrations yet
//         </p>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//         {registrations.map((reg) => (

//           <div
//             key={reg._id}
//             className="border p-4 rounded shadow-sm bg-white"
//           >

//             {/* Competition Name */}
//             <h2 className="font-semibold text-lg">
//               {reg.competition?.name}
//             </h2>

//             {/* Team Name (if team registration) */}
//             {reg.team && (
//               <p className="text-xs text-gray-500">
//                 Team: {reg.team.teamName}
//               </p>
//             )}

//             {/* Venue */}
//             <p className="text-sm text-gray-600">
//               Venue: {reg.competition?.venue}
//             </p>

//             {/* Status */}
//             <p className="text-sm mt-1">
//               Status:
//               <span
//                 className={`ml-1 font-medium ${
//                   reg.status === "registered"
//                     ? "text-green-600"
//                     : reg.status === "cancelled"
//                     ? "text-red-600"
//                     : "text-blue-600"
//                 }`}
//               >
//                 {reg.status}
//               </span>
//             </p>

//             {/* Date */}
//             <p className="text-xs text-gray-400 mt-1">
//               Registered On:{" "}
//               {new Date(reg.createdAt).toLocaleDateString()}
//             </p>

//             {/* QR Code */}
//             {reg.qrCode && (
//               <img
//                 src={reg.qrCode}
//                 alt="QR Code"
//                 className="mt-3 w-32 border rounded"
//               />
//             )}

//             {/* Cancel Button (Only Leader / Individual Owner) */}
//             {reg.status === "registered" &&
//               reg.registeredBy === userId && (

//                 <button
//                   onClick={() => handleCancel(reg._id)}
//                   disabled={cancelLoadingId === reg._id}
//                   className={`mt-4 px-3 py-1 text-sm rounded text-white transition
//                     ${
//                       cancelLoadingId === reg._id
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-red-500 hover:bg-red-600"
//                     }
//                   `}
//                 >

//                   {cancelLoadingId === reg._id
//                     ? "Cancelling..."
//                     : "Cancel Registration"}

//                 </button>

//               )
//             }

//             {/* Team Member Info */}
//             {reg.team &&
//               reg.registeredBy !== userId &&
//               reg.status === "registered" && (

//                 <p className="text-xs text-gray-500 mt-2">
//                   Only team leader can cancel this registration
//                 </p>

//               )
//             }

//           </div>

//         ))}

//       </div>

//     </div>
//   );
// };

// export default MyRegistrations;
