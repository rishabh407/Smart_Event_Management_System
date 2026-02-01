import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";
import toast from "react-hot-toast";

const CompetitionRegistrations = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {

    try {

      const res = await getCompetitionRegistrations(id);

      setRegistrations(res.data.data || res.data || []);
      setLoading(false);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load registrations");
      setLoading(false);

    }

  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <p className="text-gray-600">Loading registrations...</p>
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl">

      {/* ================= HEADER ================= */}

      <div className="mb-6">

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-3 flex items-center gap-2"
        >
          ← Back
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
          Competition Registrations
        </h1>

        <p className="text-gray-600">
          Total Registrations:{" "}
          <span className="font-semibold">
            {registrations.length}
          </span>
        </p>

      </div>

      {/* ================= EMPTY STATE ================= */}

      {registrations.length === 0 ? (

        <div className="bg-gray-50 p-6 sm:p-8 rounded-lg text-center">

          <p className="text-gray-500 text-base sm:text-lg">
            No registrations found for this competition
          </p>

        </div>

      ) : (

        /* ================= RESPONSIVE TABLE ================= */

        <div className="overflow-x-auto border rounded-lg">

          <table className="min-w-full border-collapse text-sm sm:text-base">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-3 border text-left font-semibold">#</th>
                <th className="p-3 border text-left font-semibold">Participant</th>
                <th className="p-3 border text-left font-semibold">Type</th>
                <th className="p-3 border text-left font-semibold">Team</th>
                <th className="p-3 border text-left font-semibold">Status</th>
                <th className="p-3 border text-left font-semibold">Attendance</th>
                <th className="p-3 border text-left font-semibold">Registered At</th>

              </tr>

            </thead>

            <tbody>

              {registrations.map((reg, index) => (

                <tr
                  key={reg._id}
                  className="hover:bg-gray-50 transition-colors"
                >

                  <td className="p-3 border text-gray-700">
                    {index + 1}
                  </td>

                  <td className="p-3 border">

                    <div>

                      <p className="font-semibold text-gray-800">
                        {reg.student
                          ? reg.student.fullName
                          : reg.team?.teamName}
                      </p>

                      {reg.student && (
                        <p className="text-sm text-gray-500">
                          {reg.student.rollNumber || reg.student.email}
                        </p>
                      )}

                    </div>

                  </td>

                  <td className="p-3 border">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reg.student
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {reg.student ? "Individual" : "Team"}
                    </span>

                  </td>

                  <td className="p-3 border text-gray-700">
                    {reg.team?.teamName || "-"}
                  </td>

                  <td className="p-3 border">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        reg.status === "registered"
                          ? "bg-green-100 text-green-700"
                          : reg.status === "attended"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reg.status.toUpperCase()}
                    </span>

                  </td>

                  <td className="p-3 border">

                    {reg.status === "attended" ? (

                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        ✅ Present
                      </span>

                    ) : (

                      <span className="text-orange-500 flex items-center gap-1">
                        ⏳ Pending
                      </span>

                    )}

                  </td>

                  <td className="p-3 border text-sm text-gray-600 whitespace-nowrap">

                    {new Date(reg.createdAt).toLocaleString()}

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

export default CompetitionRegistrations;
