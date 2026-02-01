import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";

const ViewAttendance = () => {

  const { id } = useParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {

    try {

      const res = await getCompetitionRegistrations(id);

      // remove cancelled
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

  if (loading) {
    return <p>Loading attendance...</p>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-5">
        Attendance Details
      </h1>

      <div className="overflow-x-auto bg-white rounded shadow">

        <table className="min-w-full border">

          <thead className="bg-gray-100">

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

                <tr key={reg._id}>

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
                    {isTeam ? "TEAM" : "INDIVIDUAL"}
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

    </div>
  );
};

export default ViewAttendance;
