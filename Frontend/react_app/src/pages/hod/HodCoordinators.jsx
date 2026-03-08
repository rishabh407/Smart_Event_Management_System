import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getDepartmentCoordinator,
  createCoordinator,
  updateCoordinator
} from "../../api/user.api";

const HodCoordinators = () => {

  const [coordinator, setCoordinator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    userId: "",
    password: ""
  });

  /* ================= FETCH COORDINATOR ================= */

  const fetchCoordinator = async () => {

    try {

      const res = await getDepartmentCoordinator();

      setCoordinator(res.data);

    } catch {

      toast.error("Failed to load coordinator");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchCoordinator();
  }, []);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  /* ================= CREATE ================= */

  const handleCreate = async (e) => {

    e.preventDefault();

    try {

      const res = await createCoordinator(form);

      setCoordinator(res.data);

      toast.success("Coordinator created");

      setForm({
        fullName: "",
        email: "",
        userId: "",
        password: ""
      });

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Failed to create coordinator"
      );

    }

  };

  /* ================= UPDATE ================= */

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const res = await updateCoordinator(coordinator._id, form);

      setCoordinator(res.data);

      setEditing(false);

      toast.success("Coordinator updated");

    } catch {

      toast.error("Failed to update coordinator");

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

  /* ================= CREATE PAGE ================= */

  if (!coordinator) {

    return (

      <div className="p-6 flex justify-center">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h2 className="text-2xl font-bold mb-6 text-center">
            Create Department Coordinator
          </h2>

          <form onSubmit={handleCreate} className="space-y-4">

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />

            <input
              name="userId"
              placeholder="User ID"
              value={form.userId}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
            >
              Create Coordinator
            </button>

          </form>

        </div>

      </div>

    );

  }

  /* ================= COORDINATOR VIEW ================= */

  return (

    <div className="p-6 flex justify-center">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Department Coordinator
        </h2>

        {/* PROFILE */}

        {!editing ? (

          <div className="space-y-3 text-sm">

            <div className="flex justify-center mb-4">

              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {coordinator.fullName?.charAt(0)}
              </div>

            </div>

            <p><b>Name:</b> {coordinator.fullName}</p>
            <p><b>Email:</b> {coordinator.email}</p>
            <p><b>User ID:</b> {coordinator.userId}</p>
            <p><b>Role:</b> Coordinator</p>

            <button
              onClick={() => {
                setEditing(true);
                setForm({
                  fullName: coordinator.fullName,
                  email: coordinator.email,
                  userId: coordinator.userId,
                  password: ""
                });
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-4 w-full"
            >
              Edit Coordinator
            </button>

          </div>

        ) : (

          /* ================= EDIT FORM ================= */

          <form onSubmit={handleUpdate} className="space-y-4">

            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              placeholder="Full Name"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
              placeholder="Email"
              required
            />

            <input
              name="userId"
              value={form.userId}
              disabled
              className="border px-4 py-2 rounded w-full bg-gray-100"
            />

            <input
              type="password"
              name="password"
              placeholder="New Password (optional)"
              value={form.password}
              onChange={handleChange}
              className="border px-4 py-2 rounded w-full"
            />

            <div className="flex gap-3">

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
              >
                Update
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 w-full py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </form>

        )}

      </div>

    </div>

  );

};

export default HodCoordinators;