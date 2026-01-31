// import { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import toast from "react-hot-toast";
// import { markAttendance } from "../../api/registeration.api";

// const ScanAttendance = () => {

//   const { id } = useParams(); // competitionId from URL
//   const navigate = useNavigate();

//   useEffect(() => {

//     const scanner = new Html5QrcodeScanner(
//       "qr-reader",
//       {
//         fps: 10,
//         qrbox: 250,
//         rememberLastUsedCamera: true
//       },
//       false
//     );

//     scanner.render(

//       // ===== SUCCESS CALLBACK =====
//       async (decodedText) => {

//         try {

//           // ✅ Extract competition ID using REGEX (Safe)
//           const match = decodedText.match(/scan\/([a-f0-9]{24})/i);

//           if (!match) {
//             toast.error("Invalid QR Code");
//             return;
//           }

//           const scannedCompetitionId = match[1];

//           // ✅ Validate competition
//           if (scannedCompetitionId !== id) {
//             toast.error("Wrong competition QR");
//             return;
//           }

//           // ✅ Mark attendance API call
//           await markAttendance({
//             competitionId: id
//           });

//           toast.success("Attendance marked successfully ✅");

//           // ✅ Stop camera
//           await scanner.clear();

//           // ✅ Redirect student
//           navigate("/student/registrations");

//         } catch (error) {

//           toast.error(
//             error.response?.data?.message ||
//             "Attendance failed"
//           );

//         }

//       },

//       // ===== ERROR CALLBACK (Ignore noise) =====
//       (error) => {
//         // Camera noise ignored
//       }

//     );

//     // ===== CLEANUP =====
//     return () => {
//       scanner.clear().catch(() => {});
//     };

//   }, [id, navigate]);

//   return (
//     <div className="p-6 flex flex-col items-center">

//       <h1 className="text-2xl font-bold mb-4">
//         Scan Attendance QR
//       </h1>

//       <p className="text-gray-600 mb-4 text-center">
//         Point your camera at the QR code displayed by the teacher
//       </p>

//       <div
//         id="qr-reader"
//         className="w-72 bg-white p-3 rounded shadow"
//       ></div>

//     </div>
//   );
// };

// export default ScanAttendance;


// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Html5QrcodeScanner } from "html5-qrcode";
// import toast from "react-hot-toast";
// import { markAttendance } from "../../api/registeration.api";

// const ScanAttendance = () => {

//   const navigate = useNavigate();

//   useEffect(() => {

//     const scanner = new Html5QrcodeScanner(
//       "qr-reader",
//       {
//         fps: 10,
//         qrbox: 250,
//         rememberLastUsedCamera: true
//       },
//       false
//     );

//     scanner.render(

//       // ===== SUCCESS CALLBACK =====
//       async (decodedText) => {

//         try {

//           // ✅ Extract competition ID safely
//           const match = decodedText.match(/scan\/([a-f0-9]{24})/i);

//           if (!match) {
//             toast.error("Invalid QR Code");
//             return;
//           }

//           const competitionId = match[1];

//           // ✅ Backend will validate everything
//           await markAttendance({
//             competitionId
//           });

//           toast.success("Attendance marked successfully ✅");

//           await scanner.clear();

//           navigate("/student/registrations");

//         } catch (error) {

//           toast.error(
//             error.response?.data?.message ||
//             "Attendance failed"
//           );

//         }

//       },

//       () => {}

//     );

//     return () => {
//       scanner.clear().catch(() => {});
//     };

//   }, [navigate]);

//   return (
//     <div className="p-6 flex flex-col items-center">

//       <h1 className="text-2xl font-bold mb-4">
//         Scan Attendance QR
//       </h1>

//       <p className="text-gray-600 mb-4 text-center">
//         Scan teacher QR to mark attendance
//       </p>

//       <div
//         id="qr-reader"
//         className="w-72 bg-white p-3 rounded shadow"
//       ></div>

//     </div>
//   );
// };

// export default ScanAttendance;


import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { markAttendance } from "../../api/registeration.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ScanAttendance = () => {

 const navigate = useNavigate();

 useEffect(() => {

  const scanner = new Html5QrcodeScanner(
   "reader",
   {
    qrbox: {
     width: 250,
     height: 250
    },
    fps: 5
   },
   false
  );

  scanner.render(onScanSuccess, onScanError);

  async function onScanSuccess(decodedText) {

   try {

    scanner.clear();

    // Example QR:
    // http://localhost:5173/student/scan/697e69...

    const parts = decodedText.split("/");
    const competitionId = parts[parts.length - 1];

    await markAttendance({
     competitionId
    });

    toast.success("Attendance marked successfully ✅");

    navigate("/student/my-registrations");

   } catch (error) {

    toast.error(
     error.response?.data?.message || "Attendance failed"
    );

   }

  }

  function onScanError(error) {
   // ignore continuous scan errors
  }

 }, []);

 return (
  <div className="p-6">

   <h1 className="text-xl font-bold mb-4">
    Scan Attendance QR
   </h1>

   <div
    id="reader"
    className="max-w-sm mx-auto border rounded p-3"
   />

  </div>
 );
};

export default ScanAttendance;
