import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompetitionRegistrations } from "../../api/registeration.api";

const ViewRegistrations = () => {

  const { id } = useParams();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {

      const res = await getCompetitionRegistrations(id);
      setRegistrations(res.data);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-5">
        Registered Students
      </h1>

      {/* LOADING */}
      {loading && <p>Loading registrations...</p>}

      {/* EMPTY */}
      {!loading && registrations.length === 0 && (
        <p className="text-gray-500">
          No students registered yet.
        </p>
      )}

      {/* TABLE */}
      {!loading && registrations.length > 0 && (

        <div className="overflow-x-auto bg-white rounded shadow">

          <table className="min-w-full border">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Registered At</th>
              </tr>
            </thead>

            <tbody>

              {registrations.map((reg, index) => (

                <tr key={reg._id}>

                  <td className="p-2 border text-center">
                    {index + 1}
                  </td>

                  <td className="p-2 border">
                    {reg.studentId?.fullName}
                  </td>

                  <td className="p-2 border">
                    {reg.studentId?.rollNumber}
                  </td>

                  <td className="p-2 border">
                    {reg.studentId?.email}
                  </td>

                  <td className="p-2 border">
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

export default ViewRegistrations;
