import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getDepartmentTeachers,
  toggleTeacherStatus
} from "../../api/user.api";

const HodTeachers = () => {

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  /* ================= FETCH TEACHERS ================= */

  const fetchTeachers = async () => {

    try {

      setLoading(true);

      const res = await getDepartmentTeachers();

      setTeachers(res.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load teachers");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ================= SEARCH FILTER ================= */

  const filteredTeachers = useMemo(() => {

    return teachers.filter(t =>
      t.fullName?.toLowerCase().includes(search.toLowerCase())
    );

  }, [teachers, search]);

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (active) => {

    return active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  };

  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();

  };

  /* ================= TOGGLE STATUS ================= */

  const handleToggleStatus = async (teacherId) => {

    try {

      setUpdating(teacherId);

      const res = await toggleTeacherStatus(teacherId);

      setTeachers(prev =>
        prev.map(t =>
          t._id === teacherId
            ? { ...t, isActive: res.data.isActive }
            : t
        )
      );

      toast.success("Teacher status updated");

    } catch (error) {

      console.error(error);
      toast.error("Failed to update status");

    } finally {

      setUpdating(null);

    }

  };

  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  }

  return (

    <div className="p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          Teachers
        </h1>

        <p className="text-gray-600">
          Teachers in your department
        </p>

      </div>


      {/* SEARCH */}

      <div className="mb-5">

        <input
          type="text"
          placeholder="Search teacher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full md:w-80"
        />

      </div>


      {/* EMPTY STATE */}

      {filteredTeachers.length === 0 ? (

        <div className="bg-white p-10 rounded shadow text-center text-gray-500">
          No teachers found
        </div>

      ) : (

        <>

          {/* ================= DESKTOP TABLE ================= */}

          <div className="hidden md:block bg-white rounded shadow overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="bg-gray-100">

                <tr>

                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Joined</th>
                  <th className="p-3 text-left">Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredTeachers.map(teacher => (

                  <tr
                    key={teacher._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium">
                      {teacher.fullName}
                    </td>

                    <td className="p-3">
                      {teacher.userId}
                    </td>

                    <td className="p-3">
                      {teacher.email || "N/A"}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(teacher.isActive)}`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </span>

                    </td>

                    <td className="p-3">
                      {formatDate(teacher.createdAt)}
                    </td>

                    <td className="p-3">

                      <button
                        disabled={updating === teacher._id}
                        onClick={() => handleToggleStatus(teacher._id)}
                        className={`px-3 py-1 rounded text-xs text-white ${
                          teacher.isActive
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >

                        {teacher.isActive
                          ? "Deactivate"
                          : "Activate"}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>


          {/* ================= MOBILE CARDS ================= */}

          <div className="grid gap-4 md:hidden">

            {filteredTeachers.map(teacher => (

              <div
                key={teacher._id}
                className="bg-white p-4 rounded shadow"
              >

                <div className="flex justify-between items-start mb-2">

                  <h3 className="font-semibold">
                    {teacher.fullName}
                  </h3>

                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(teacher.isActive)}`}
                  >
                    {teacher.isActive ? "Active" : "Inactive"}
                  </span>

                </div>

                <p className="text-sm text-gray-600">
                  <b>User ID:</b> {teacher.userId}
                </p>

                <p className="text-sm text-gray-600">
                  <b>Email:</b> {teacher.email || "N/A"}
                </p>

                <p className="text-sm text-gray-600 mb-3">
                  <b>Joined:</b> {formatDate(teacher.createdAt)}
                </p>

                <button
                  disabled={updating === teacher._id}
                  onClick={() => handleToggleStatus(teacher._id)}
                  className={`px-3 py-1 rounded text-xs text-white ${
                    teacher.isActive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >

                  {teacher.isActive
                    ? "Deactivate"
                    : "Activate"}

                </button>

              </div>

            ))}

          </div>

        </>

      )}

    </div>

  );

};

export default HodTeachers;