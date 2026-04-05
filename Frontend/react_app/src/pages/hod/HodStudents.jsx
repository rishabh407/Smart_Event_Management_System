import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  updateStudent,
  createStudent,
  getDepartmentStudents,
  toggleStudentStatus,
  uploadStudents
} from "../../api/user.api";

const HodStudents = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const [courseFilter, setCourseFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    userId: "",
    password: "",
    rollNumber: "",
    course: "",
    year: "",
    section: ""
  });

  /* ================= FETCH STUDENTS ================= */

  const fetchStudents = async () => {

    try {

      setLoading(true);

      const res = await getDepartmentStudents();

      setStudents(res.data || []);

    } catch {

      toast.error("Failed to load students");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchStudents();
  }, []);

  /* ================= DYNAMIC FILTER OPTIONS ================= */

  const courses = [...new Set(students.map(s => s.course).filter(Boolean))];
  const years = [...new Set(students.map(s => s.year).filter(Boolean))];
  const sections = [...new Set(students.map(s => s.section).filter(Boolean))];

  /* ================= FILTER STUDENTS ================= */

  const filteredStudents = useMemo(() => {

    return students.filter(student => {

      const matchSearch =
        student.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        student.rollNumber?.toLowerCase().includes(search.toLowerCase());

      const matchCourse =
        !courseFilter || student.course === courseFilter;

      const matchYear =
        !yearFilter || student.year === Number(yearFilter);

      const matchSection =
        !sectionFilter || student.section === sectionFilter;

      return matchSearch && matchCourse && matchYear && matchSection;

    });

  }, [students, search, courseFilter, yearFilter, sectionFilter]);

  /* ================= FORMAT DATE ================= */

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString();

  };

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (active) => {

    return active
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  };

  /* ================= TOGGLE STATUS ================= */

  const handleToggleStatus = async (id) => {

    try {

      setUpdating(id);

      const res = await toggleStudentStatus(id);

      setStudents(prev =>
        prev.map(s =>
          s._id === id
            ? { ...s, isActive: res.data.isActive }
            : s
        )
      );

      toast.success("Student status updated");

    } catch {

      toast.error("Failed to update status");

    } finally {

      setUpdating(null);

    }

  };

  /* ================= ADD STUDENT ================= */

  const handleAddStudent = () => {

    setEditingStudent(null);

    setForm({
      fullName: "",
      email: "",
      userId: "",
      password: "",
      rollNumber: "",
      course: "",
      year: "",
      section: ""
    });

    setModalOpen(true);

  };

  /* ================= EDIT STUDENT ================= */

  const handleEditStudent = (student) => {

    setEditingStudent(student);

    setForm({
      fullName: student.fullName || "",
      email: student.email || "",
      userId: student.userId || "",
      password: "",
      rollNumber: student.rollNumber || "",
      course: student.course || "",
      year: student.year || "",
      section: student.section || ""
    });

    setModalOpen(true);

  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* ================= SUBMIT FORM ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingStudent) {

        const res = await updateStudent(editingStudent._id, form);

        setStudents(prev =>
          prev.map(s =>
            s._id === editingStudent._id ? res.data : s
          )
        );

        toast.success("Student updated");

      } else {

        const res = await createStudent(form);

        setStudents(prev => [...prev, res.data]);

        toast.success("Student created");

      }

      setModalOpen(false);

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Operation failed"
      );

    }

  };

  /* ================= EXCEL UPLOAD ================= */

  const handleFileUpload = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    try {

      setUploading(true);

      const res = await uploadStudents(file);

      const { insertedCount, errorCount } = res.data;

      toast.success(`${insertedCount} students uploaded`);

      if (errorCount > 0) {
        toast.error(`${errorCount} rows failed`);
      }

      fetchStudents();

    } catch {

      toast.error("Upload failed");

    } finally {

      setUploading(false);

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

    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-bold">Students</h1>

          <p className="text-gray-600">
            Students in your department
          </p>

          <a
            href="/student-template.xlsx"
            download
            className="text-blue-600 text-sm underline"
          >
            Download Excel Template
          </a>

        </div>

        <div className="flex flex-wrap gap-3">

          <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">

            {uploading ? "Uploading..." : "Upload Excel"}

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              hidden
              onChange={handleFileUpload}
            />

          </label>

          <button
            onClick={handleAddStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Student
          </button>

        </div>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
      />

      {/* FILTERS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-5">

        <select
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Courses</option>

          {courses.map(course => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}

        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Years</option>

          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}

        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Sections</option>

          {sections.map(section => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}

        </select>

      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden md:block bg-white rounded shadow overflow-x-auto">

        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Course</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredStudents.map(student => (

              <tr key={student._id} className="border-t">

                <td className="p-3">{student.fullName}</td>
                <td className="p-3">{student.userId}</td>
                <td className="p-3">{student.rollNumber}</td>
                <td className="p-3">{student.course}</td>
                <td className="p-3">{student.year}</td>
                <td className="p-3">{student.section}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(student.isActive)}`}>
                    {student.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">{formatDate(student.createdAt)}</td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => handleEditStudent(student)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleToggleStatus(student._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                  >
                    {student.isActive ? "Deactivate" : "Activate"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MOBILE VIEW */}

      <div className="md:hidden space-y-3">

        {filteredStudents.map(student => (

          <div key={student._id} className="border p-3 rounded shadow">

            <h3 className="font-semibold">{student.fullName}</h3>

            <p>User ID: {student.userId}</p>
            <p>Roll: {student.rollNumber}</p>
            <p>Course: {student.course}</p>
            <p>Year: {student.year}</p>
            <p>Section: {student.section}</p>

            <div className="flex gap-2 mt-2">

              <button
                onClick={() => handleEditStudent(student)}
                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
              >
                Edit
              </button>

              <button
                onClick={() => handleToggleStatus(student._id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
              >
                {student.isActive ? "Deactivate" : "Activate"}
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {modalOpen && (

<div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

  <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 animate-fadeIn">

    <h2 className="text-xl font-semibold mb-5">
      {editingStudent ? "Edit Student" : "Add Student"}
    </h2>

    <form onSubmit={handleSubmit} className="space-y-3">

      <input
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
        required
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
        required
      />

      <input
        name="userId"
        placeholder="User ID"
        value={form.userId}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
        required
      />

      {!editingStudent && (
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border w-full p-2.5 rounded-lg"
          required
        />
      )}

      <input
        name="rollNumber"
        placeholder="Roll Number"
        value={form.rollNumber}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
      />

      <input
        name="course"
        placeholder="Course"
        value={form.course}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
      />

      <input
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
      />

      <input
        name="section"
        placeholder="Section"
        value={form.section}
        onChange={handleChange}
        className="border w-full p-2.5 rounded-lg"
      />

      <div className="flex justify-end gap-3 pt-4">

        <button
          type="button"
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {editingStudent ? "Update" : "Create"}
        </button>

      </div>

    </form>

  </div>

</div>

)}

    </div>

  );

};

export default HodStudents;

