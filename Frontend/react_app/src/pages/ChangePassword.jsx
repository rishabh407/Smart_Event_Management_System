import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loadUser } = useAuth();

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setError("");

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    // Validation
    if (!trimmedPassword || !trimmedConfirm) {
      return setError("All fields are required");
    }

    if (trimmedPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (trimmedPassword !== trimmedConfirm) {
      return setError("Passwords do not match");
    }

    try {

      setLoading(true);

      await api.post("/auth/change-password", {
        newPassword: trimmedPassword
      });

      // Refresh user session
      await loadUser();

      // Redirect
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md">

        {/* HEADER */}

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3">
          Change Password
        </h2>

        <p className="text-xs sm:text-sm text-gray-500 text-center mb-5">
          This is your first login. Please set a new password.
        </p>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium transition text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </span>
            ) : (
              "Change Password"
            )}

          </button>

        </form>

      </div>

    </div>
  );
};

export default ChangePassword;
