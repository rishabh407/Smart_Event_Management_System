import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loadUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      // Call backend
      await api.post("/auth/change-password", {
        newPassword: password
      });

      // Refresh user session
      await loadUser();

      // Redirect to student dashboard
      navigate("/student");

    } catch (err) {

      setError(
        err.response?.data?.message || "Password change failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          Change Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-4">
          This is your first login. Please set a new password.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ChangePassword;
