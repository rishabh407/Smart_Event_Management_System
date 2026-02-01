import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompetitionById } from "../../api/competition.api";
import { getDepartmentTeachers } from "../../api/teacher.api";
import { assignTeacher, removeTeacher } from "../../api/competition.api";
import toast from "react-hot-toast";

const AssignTeachers = () => {

  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const [teacherId, setTeacherId] = useState("");
  const [role, setRole] = useState("INCHARGE");

  const fetchData = async () => {
    try {
      setLoading(true);

      const [compRes, teacherRes] = await Promise.all([
        getCompetitionById(competitionId),
        getDepartmentTeachers()
      ]);

      setCompetition(compRes.data);
      setTeachers(teacherRes.data || []);

    } catch (error) {

      console.error(error);
      toast.error("Failed to load data");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchData();
  }, [competitionId]);

  const handleAssign = async () => {

    if (!teacherId || !role) {
      toast.error("Please select a teacher and role");
      return;
    }

    const alreadyAssigned = competition?.assignedTeachers?.some(
      (t) => t.teacher._id === teacherId
    );

    if (alreadyAssigned) {
      toast.error("This teacher is already assigned");
      return;
    }

    setAssigning(true);

    try {

      await toast.promise(
        assignTeacher({ competitionId, teacherId, role }),
        {
          loading: "Assigning teacher...",
          success: "Teacher assigned successfully ✅",
          error: (err) => err.response?.data?.message || "Assignment failed",
        }
      );

      setTeacherId("");
      setRole("INCHARGE");
      fetchData();

    } finally {

      setAssigning(false);

    }
  };

  const handleRemove = async (teacher) => {

    if (!window.confirm(`Remove ${teacher.fullName}?`)) return;

    setRemovingId(teacher._id);

    try {

      await toast.promise(
        removeTeacher({
          competitionId,
          teacherId: teacher._id
        }),
        {
          loading: "Removing teacher...",
          success: "Teacher removed successfully ✅",
          error: "Removal failed"
        }
      );

      fetchData();

    } finally {

      setRemovingId(null);

    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[250px]">
        <div className="text-center text-gray-600">
          Loading competition details...
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="text-center mt-10 text-red-500">
        Competition not found
      </div>
    );
  }

  // Filter out already assigned teachers

  const availableTeachers = teachers.filter(
    (t) => !competition.assignedTeachers?.some(
      (at) => at.teacher._id === t._id
    )
  );

  return (
    <div className="max-w-5xl mx-auto bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-xl space-y-8">

      {/* ================= HEADER ================= */}

      <div>

        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 mb-3 flex items-center gap-2"
        >
          ← Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Assign Teachers
        </h1>

        <p className="text-gray-600 mt-1 text-sm md:text-base">
          Competition: <span className="font-semibold">{competition.name}</span>
        </p>

      </div>

      {/* ================= ASSIGN FORM ================= */}

      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">

        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Assign New Teacher
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* TEACHER SELECT */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher
            </label>

            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              disabled={assigning}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">-- Select Teacher --</option>

              {availableTeachers.map(t => (
                <option key={t._id} value={t._id}>
                  {t.fullName}
                </option>
              ))}

            </select>

            {availableTeachers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                All teachers are already assigned
              </p>
            )}

          </div>

          {/* ROLE */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={assigning}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="INCHARGE">Incharge</option>
              <option value="JUDGE">Judge</option>
            </select>

          </div>

          {/* BUTTON */}

          <div className="flex items-end">

            <button
              onClick={handleAssign}
              disabled={!teacherId || assigning || availableTeachers.length === 0}
              className={`w-full px-4 py-2 rounded-md font-semibold text-white transition ${
                !teacherId || assigning || availableTeachers.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {assigning ? "Assigning..." : "Assign Teacher"}
            </button>

          </div>

        </div>

      </div>

      {/* ================= ASSIGNED TEACHERS ================= */}

      <div>

        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          Assigned Teachers ({competition.assignedTeachers?.length || 0})
        </h2>

        {!competition.assignedTeachers || competition.assignedTeachers.length === 0 ? (

          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-500">
              No teachers assigned yet
            </p>
          </div>

        ) : (

          <div className="space-y-3">

            {competition.assignedTeachers.map((item, index) => (

              <div
                key={item.teacher._id || index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border p-4 rounded-lg hover:bg-gray-50 transition"
              >

                <div>
                  <p className="font-semibold text-gray-800">
                    {item.teacher.fullName}
                  </p>

                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
                      item.role === "INCHARGE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {item.role}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(item.teacher)}
                  disabled={removingId === item.teacher._id}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                    removingId === item.teacher._id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {removingId === item.teacher._id ? "Removing..." : "Remove"}
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default AssignTeachers;
