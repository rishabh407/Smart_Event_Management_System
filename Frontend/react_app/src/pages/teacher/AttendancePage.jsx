import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const AttendancePage = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const qrValue = `${window.location.origin}/student/scan/${id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(qrValue);
    alert("QR Link Copied!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">

      {/* HEADER */}

      <div className="w-full max-w-md flex justify-between items-center mb-4">

        <h1 className="text-lg sm:text-xl font-bold">
          Attendance QR
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          ⬅ Back
        </button>

      </div>

      {/* CARD */}

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 flex flex-col items-center">

        <p className="text-gray-600 text-center text-sm mb-4">
          Ask students to scan this QR code to mark attendance
        </p>

        {/* QR CODE */}

        <div className="bg-white p-3 rounded border">

          <QRCode
            value={qrValue}
            size={220}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%"
            }}
          />

        </div>

        {/* LINK */}

        <p className="text-xs text-gray-500 text-center mt-3 break-all">
          {qrValue}
        </p>

        {/* ACTION BUTTONS */}

        <div className="flex gap-3 w-full mt-4">

          <button
            onClick={copyLink}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm font-medium"
          >
            📋 Copy Link
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium"
          >
            🖨 Print QR
          </button>

        </div>

      </div>

    </div>
  );
};

export default AttendancePage;
