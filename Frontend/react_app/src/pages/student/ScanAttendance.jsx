import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { markattendance } from "../../api/attendance.api";

const ScanAttendance = () => {

  const { id } = useParams();

  const [status, setStatus] = useState("loading");

  const markAttendance = async () => {
    try {
      const res = await markattendance(id);
      setStatus("success");
    } catch (error) {

      console.log(error);

      setStatus("error");
    }
  };
  useEffect(() => {
    markAttendance();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded shadow text-center w-80">

        {status === "loading" && (
          <p className="text-gray-600">
            Marking attendance...
          </p>
        )}

        {status === "success" && (
          <p className="text-green-600 font-bold">
            ✅ Attendance Marked Successfully
          </p>
        )}

        {status === "error" && (
          <p className="text-red-600 font-bold">
            ❌ Attendance Failed or Already Marked
          </p>
        )}

      </div>

    </div>
  );
};

export default ScanAttendance;
