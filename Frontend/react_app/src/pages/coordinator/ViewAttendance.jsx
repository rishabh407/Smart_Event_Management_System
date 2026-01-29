import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewAttendance = () => {

  const { id } = useParams();

  const [attendance, setAttendance] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/attendance/competition/${id}`,
        {
          withCredentials: true
        }
      );

      setAttendance(res.data.attendanceList);
      setTotal(res.data.totalPresent);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Attendance List
      </h1>

      <p className="mb-4 text-gray-600">
        Total Present Students: <b>{total}</b>
      </p>

      {loading && <p>Loading attendance...</p>}

      {!loading && attendance.length === 0 && (
        <p>No attendance recorded yet.</p>
      )}

      {!loading && attendance.length > 0 && (

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-gray-100">

              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Roll No</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Year</th>
                <th className="border p-2">Section</th>
                <th className="border p-2">Time</th>
              </tr>

            </thead>

            <tbody>

              {attendance.map((item) => (

                <tr key={item._id} className="text-center">

                  <td className="border p-2">
                    {item.student.fullName}
                  </td>

                  <td className="border p-2">
                    {item.student.rollNumber}
                  </td>

                  <td className="border p-2">
                    {item.student.course}
                  </td>

                  <td className="border p-2">
                    {item.student.year}
                  </td>

                  <td className="border p-2">
                    {item.student.section}
                  </td>

                  <td className="border p-2">
                    {new Date(item.createdAt).toLocaleString()}
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

export default ViewAttendance;
