import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";

const ViewAttendance = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {

    try {

      const res = await getCompetitionRegistrations(id);

      const filtered = res.data.data.filter(
        r => r.status !== "cancelled"
      );

      setRegistrations(filtered);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500 animate-pulse">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-4">

        <h1 className="text-xl md:text-2xl font-bold">
          Attendance Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm"
        >
          ⬅ Back
        </button>

      </div>

      {/* EMPTY STATE */}

      {registrations.length === 0 && (

        <div className="bg-white p-6 rounded shadow text-center">

          <p className="text-gray-500">
            No attendance records found.
          </p>

        </div>

      )}

      {/* TABLE */}

      {registrations.length > 0 && (

        <div className="overflow-x-auto bg-white rounded shadow">

          <table className="min-w-full border text-sm">

            <thead className="bg-gray-100 sticky top-0 z-10">

              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Name / Team</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Time</th>
              </tr>

            </thead>

            <tbody>

              {registrations.map((reg, index) => {

                const isTeam = reg.team !== null;

                return (

                  <tr
                    key={reg._id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="p-2 border text-center">
                      {index + 1}
                    </td>

                    <td className="p-2 border font-medium">
                      {isTeam
                        ? reg.team.teamName
                        : reg.student?.fullName}
                    </td>

                    <td className="p-2 border">
                      {isTeam
                        ? "—"
                        : reg.student?.rollNumber}
                    </td>

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

                    <td className="p-2 border text-center">

                      {reg.status === "attended" ? (

                        <span className="text-green-600 font-bold">
                          ✅ Present
                        </span>

                      ) : (

                        <span className="text-red-600 font-bold">
                          ❌ Absent
                        </span>

                      )}

                    </td>

                    <td className="p-2 border text-center">
                      {reg.attendedAt
                        ? new Date(reg.attendedAt).toLocaleTimeString()
                        : "—"}
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

export default ViewAttendance;
