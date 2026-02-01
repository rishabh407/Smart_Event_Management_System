// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect } from "react";
// import { markAttendance } from "../../api/registeration.api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const ScanAttendance = () => {

//  const navigate = useNavigate();

//  useEffect(() => {

//   const scanner = new Html5QrcodeScanner(
//    "reader",
//    {
//     qrbox: {
//      width: 250,
//      height: 250
//     },
//     fps: 5
//    },
//    false
//   );

//   scanner.render(onScanSuccess, onScanError);

//   async function onScanSuccess(decodedText) {

//    try {

//     scanner.clear();

//     // Example QR:
//     // http://localhost:5173/student/scan/697e69...

//     const parts = decodedText.split("/");
//     const competitionId = parts[parts.length - 1];

//     await markAttendance({
//      competitionId
//     });

//     toast.success("Attendance marked successfully ✅");

//     navigate("/student/my-registrations");

//    } catch (error) {

//     toast.error(
//      error.response?.data?.message || "Attendance failed"
//     );

//    }

//   }

//   function onScanError(error) {
//    // ignore continuous scan errors
//   }

//  }, []);

//  return (
//   <div className="p-6">

//    <h1 className="text-xl font-bold mb-4">
//     Scan Attendance QR
//    </h1>

//    <div
//     id="reader"
//     className="max-w-sm mx-auto border rounded p-3"
//    />

//   </div>
//  );
// };

// export default ScanAttendance;


import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";
import { markAttendanceByQR } from "../../api/registeration.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ScanAttendance = () => {

  const navigate = useNavigate();

  // Prevent multiple scans
  const scannedRef = useRef(false);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: { width: 250, height: 250 },
        fps: 5
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText) {

      // STOP DOUBLE SCANS
      if (scannedRef.current) return;

      scannedRef.current = true;

      try {

        // Expected QR Format:
        // http://localhost:5173/student/scan/{competitionId}

        if (!decodedText.includes("/student/scan/")) {
          toast.error("Invalid attendance QR");
          scannedRef.current = false;
          return;
        }

        const competitionId = decodedText.split("/").pop();

        if (!competitionId) {
          toast.error("Invalid QR format");
          scannedRef.current = false;
          return;
        }

        await scanner.clear();

        // CALL BACKEND
        await markAttendanceByQR({ competitionId });

        toast.success("Attendance marked successfully ✅");

        navigate("/student/registrations");

      } catch (error) {

        scannedRef.current = false;

        toast.error(
          error.response?.data?.message ||
          "Attendance failed"
        );

      }

    }

    function onScanError(error) {
      // ignore scanning noise
    }

    return () => {
      scanner.clear().catch(() => {});
    };

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
