import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loadUser } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();


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
        newPassword: trimmedPassword,
      });

      await loadUser();

      navigate("/student");
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">


        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Change Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            First login detected — please set a secure password 🔐
          </p>
        </div>


        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-md mb-4 text-sm text-center">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-5">


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
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