import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { markattendance } from "../../api/attendance.api";

const ScanAttendance = () => {

  const navigate = useNavigate();
  const { competitionId: currentCompetitionId } = useParams();

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

      if (scannedRef.current) return;
      scannedRef.current = true;

      try {

        let competitionId;

        
        try {
          const payload = JSON.parse(decodedText);
          competitionId = payload.competitionId;
        } catch {
          
          if (decodedText.includes("/student/scan/")) {
            competitionId = decodedText.split("/").pop();
          }
        }

        
        if (!competitionId) {
          toast.error("Invalid QR code ❌");
          scannedRef.current = false;
          return;
        }

        
        if (competitionId !== currentCompetitionId) {
          toast.error("Wrong QR for this competition ❌");
          scannedRef.current = false;
          return;
        }

        await scanner.clear();

        await markattendance({
          competitionId,
          method: "QR"
        });

        toast.success("Attendance marked successfully ✅");

        navigate("/student/registrations");

      } catch (error) {

        scannedRef.current = false;

        toast.error(
          error?.response?.data?.message || "Attendance failed"
        );

      }

    }

    function onScanError(error) {
      
    }

    return () => {
      scanner.clear().catch(() => {});
    };

  }, [currentCompetitionId]);

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