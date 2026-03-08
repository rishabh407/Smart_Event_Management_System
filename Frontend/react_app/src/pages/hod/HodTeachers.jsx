// import { useEffect, useState, useMemo } from "react";
// import toast from "react-hot-toast";
// import {
//   getDepartmentTeachers,
//   toggleTeacherStatus
// } from "../../api/user.api";

// const HodTeachers = () => {

//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [updating, setUpdating] = useState(null);

//   /* ================= FETCH TEACHERS ================= */

//   const fetchTeachers = async () => {

//     try {

//       setLoading(true);

//       const res = await getDepartmentTeachers();

//       setTeachers(res.data || []);

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to load teachers");

//     } finally {

//       setLoading(false);

//     }

//   };

//   useEffect(() => {
//     fetchTeachers();
//   }, []);

//   /* ================= SEARCH FILTER ================= */

//   const filteredTeachers = useMemo(() => {

//     return teachers.filter(t =>
//       t.fullName?.toLowerCase().includes(search.toLowerCase())
//     );

//   }, [teachers, search]);

//   /* ================= STATUS COLOR ================= */

//   const getStatusColor = (active) => {

//     return active
//       ? "bg-green-100 text-green-700"
//       : "bg-red-100 text-red-700";

//   };

//   /* ================= FORMAT DATE ================= */

//   const formatDate = (date) => {

//     if (!date) return "N/A";

//     return new Date(date).toLocaleDateString();

//   };

//   /* ================= TOGGLE STATUS ================= */

//   const handleToggleStatus = async (teacherId) => {

//     try {

//       setUpdating(teacherId);

//       const res = await toggleTeacherStatus(teacherId);

//       setTeachers(prev =>
//         prev.map(t =>
//           t._id === teacherId
//             ? { ...t, isActive: res.data.isActive }
//             : t
//         )
//       );

//       toast.success("Teacher status updated");

//     } catch (error) {

//       console.error(error);
//       toast.error("Failed to update status");

//     } finally {

//       setUpdating(null);

//     }

//   };

//   /* ================= LOADING ================= */

//   if (loading) {

//     return (
//       <div className="flex justify-center items-center min-h-[300px]">
//         <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full"></div>
//       </div>
//     );

//   }

//   return (

//     <div className="p-4 md:p-6">

//       {/* HEADER */}

//       <div className="mb-6">

//         <h1 className="text-2xl md:text-3xl font-bold">
//           Teachers
//         </h1>

//         <p className="text-gray-600">
//           Teachers in your department
//         </p>

//       </div>


//       {/* SEARCH */}

//       <div className="mb-5">

//         <input
//           type="text"
//           placeholder="Search teacher..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border px-3 py-2 rounded w-full md:w-80"
//         />

//       </div>


//       {/* EMPTY STATE */}

//       {filteredTeachers.length === 0 ? (

//         <div className="bg-white p-10 rounded shadow text-center text-gray-500">
//           No teachers found
//         </div>

//       ) : (

//         <>

//           {/* ================= DESKTOP TABLE ================= */}

//           <div className="hidden md:block bg-white rounded shadow overflow-x-auto">

//             <table className="w-full text-sm">

//               <thead className="bg-gray-100">

//                 <tr>

//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">User ID</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Status</th>
//                   <th className="p-3 text-left">Joined</th>
//                   <th className="p-3 text-left">Action</th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {filteredTeachers.map(teacher => (

//                   <tr
//                     key={teacher._id}
//                     className="border-t hover:bg-gray-50"
//                   >

//                     <td className="p-3 font-medium">
//                       {teacher.fullName}
//                     </td>

//                     <td className="p-3">
//                       {teacher.userId}
//                     </td>

//                     <td className="p-3">
//                       {teacher.email || "N/A"}
//                     </td>

//                     <td className="p-3">

//                       <span
//                         className={`px-2 py-1 rounded text-xs ${getStatusColor(teacher.isActive)}`}
//                       >
//                         {teacher.isActive ? "Active" : "Inactive"}
//                       </span>

//                     </td>

//                     <td className="p-3">
//                       {formatDate(teacher.createdAt)}
//                     </td>

//                     <td className="p-3">

//                       <button
//                         disabled={updating === teacher._id}
//                         onClick={() => handleToggleStatus(teacher._id)}
//                         className={`px-3 py-1 rounded text-xs text-white ${
//                           teacher.isActive
//                             ? "bg-red-500 hover:bg-red-600"
//                             : "bg-green-500 hover:bg-green-600"
//                         }`}
//                       >

//                         {teacher.isActive
//                           ? "Deactivate"
//                           : "Activate"}

//                       </button>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>


//           {/* ================= MOBILE CARDS ================= */}

//           <div className="grid gap-4 md:hidden">

//             {filteredTeachers.map(teacher => (

//               <div
//                 key={teacher._id}
//                 className="bg-white p-4 rounded shadow"
//               >

//                 <div className="flex justify-between items-start mb-2">

//                   <h3 className="font-semibold">
//                     {teacher.fullName}
//                   </h3>

//                   <span
//                     className={`px-2 py-1 rounded text-xs ${getStatusColor(teacher.isActive)}`}
//                   >
//                     {teacher.isActive ? "Active" : "Inactive"}
//                   </span>

//                 </div>

//                 <p className="text-sm text-gray-600">
//                   <b>User ID:</b> {teacher.userId}
//                 </p>

//                 <p className="text-sm text-gray-600">
//                   <b>Email:</b> {teacher.email || "N/A"}
//                 </p>

//                 <p className="text-sm text-gray-600 mb-3">
//                   <b>Joined:</b> {formatDate(teacher.createdAt)}
//                 </p>

//                 <button
//                   disabled={updating === teacher._id}
//                   onClick={() => handleToggleStatus(teacher._id)}
//                   className={`px-3 py-1 rounded text-xs text-white ${
//                     teacher.isActive
//                       ? "bg-red-500 hover:bg-red-600"
//                       : "bg-green-500 hover:bg-green-600"
//                   }`}
//                 >

//                   {teacher.isActive
//                     ? "Deactivate"
//                     : "Activate"}

//                 </button>

//               </div>

//             ))}

//           </div>

//         </>

//       )}

//     </div>

//   );

// };

// export default HodTeachers;

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  getDepartmentTeachers,
  toggleTeacherStatus,
  createTeacher,
  updateTeacher
} from "../../api/user.api";

const HodTeachers = () => {

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    userId: "",
    password: ""
  });

  /* ================= FETCH TEACHERS ================= */

  const fetchTeachers = async () => {

    try {

      setLoading(true);

      const res = await getDepartmentTeachers();

      setTeachers(res.data || []);

    } catch (error) {

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

      toast.error("Failed to update status");

    } finally {

      setUpdating(null);

    }

  };

  /* ================= OPEN ADD MODAL ================= */

  const handleAddTeacher = () => {

    setEditingTeacher(null);

    setForm({
      fullName: "",
      email: "",
      userId: "",
      password: ""
    });

    setModalOpen(true);

  };

  /* ================= OPEN EDIT MODAL ================= */

  const handleEditTeacher = (teacher) => {

    setEditingTeacher(teacher);

    setForm({
      fullName: teacher.fullName,
      email: teacher.email,
      userId: teacher.userId,
      password: ""
    });

    setModalOpen(true);

  };

  /* ================= HANDLE INPUT ================= */

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

      if (editingTeacher) {

        const res = await updateTeacher(editingTeacher._id, form);

        setTeachers(prev =>
          prev.map(t =>
            t._id === editingTeacher._id
              ? res.data
              : t
          )
        );

        toast.success("Teacher updated");

      } else {

        const res = await createTeacher(form);

        setTeachers(prev => [...prev, res.data]);

        toast.success("Teacher created");

      }

      setModalOpen(false);

    } catch (error) {

      toast.error("Operation failed");

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

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Teachers
          </h1>
          <p className="text-gray-600">
            Teachers in your department
          </p>
        </div>

        <button
          onClick={handleAddTeacher}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Teacher
        </button>

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

      {/* TABLE */}

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3 text-left">Actions</th>

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

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => handleEditTeacher(teacher)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Edit
                  </button>

                  <button
                    disabled={updating === teacher._id}
                    onClick={() => handleToggleStatus(teacher._id)}
                    className={`px-2 py-1 rounded text-xs text-white ${
                      teacher.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {teacher.isActive ? "Deactivate" : "Activate"}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* ================= MODAL ================= */}

      {modalOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded shadow w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              {editingTeacher ? "Edit Teacher" : "Add Teacher"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="border px-3 py-2 rounded w-full"
                required
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border px-3 py-2 rounded w-full"
                required
              />

              <input
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="User ID"
                className="border px-3 py-2 rounded w-full"
                required
                disabled={editingTeacher}
              />

              {!editingTeacher && (
                <input
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="Password"
                  className="border px-3 py-2 rounded w-full"
                  required
                />
              )}

              <div className="flex justify-end gap-2 pt-3">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editingTeacher ? "Update" : "Create"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );

};

export default HodTeachers;