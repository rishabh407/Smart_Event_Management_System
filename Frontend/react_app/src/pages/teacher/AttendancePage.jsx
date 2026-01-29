import React from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";

const AttendancePage = () => {

  const { id } = useParams();

  const qrValue = `${window.location.origin}/student/scan/${id}`;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Attendance QR Code
      </h1>

      <p className="text-gray-600 mb-4">
        Ask students to scan this QR code to mark attendance.
      </p>

      <div className="bg-white p-6 rounded shadow inline-block">

        <QRCode
          value={qrValue}
          size={250}
        />

        <p className="text-sm text-center mt-3 break-all">
          {qrValue}
        </p>

      </div>

    </div>
  );
};

export default AttendancePage;
