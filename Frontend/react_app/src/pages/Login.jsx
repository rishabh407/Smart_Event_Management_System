import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {

  const [form, setForm] = useState({
    identifier: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const { login, user } = useContext(AuthContext);

  const navigate = useNavigate();

  // ---------------- REDIRECT AFTER LOGIN ----------------

  useEffect(() => {

    if (!user) return;

    const role = user.role;
    const firstLogin = user.isFirstLogin;

    if (role === "STUDENT" && firstLogin === true) {
      navigate("/change-password");
    }
    else if (role === "STUDENT" && firstLogin === false) {
      navigate("/student");
    }
    else if (role === "TEACHER") {
      navigate("/teacher");
    }
    else if (role === "COORDINATOR") {
      navigate("/coordinator");
    }
    else if (role === "HOD") {
      navigate("/hod");
    }

  }, [user, navigate]);

  // ---------------- LOGIN HANDLER ----------------

  const submitHandler = async (e) => {

    e.preventDefault();

    if (!form.identifier.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (loading) return;

    try {

      setLoading(true);

      await login(form);

      // Redirect handled by useEffect

    } catch (err) {

      console.error("Login error:", err);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">

          {/* HEADER */}

          <div className="text-center mb-6 sm:mb-8">

            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
              <span className="text-2xl sm:text-3xl text-white">🎓</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Smart Event Management
            </h1>

            <p className="text-sm sm:text-base text-gray-600">
              Sign in to your account
            </p>

          </div>

          {/* FORM */}

          <form onSubmit={submitHandler} className="space-y-5 sm:space-y-6">

            {/* IDENTIFIER */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Roll Number
              </label>

              <input
                type="text"
                placeholder="Enter your email or roll number"
                autoComplete="username"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >

              {loading ? (

                <span className="flex items-center justify-center text-sm sm:text-base">
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>

              ) : (

                "Sign In"

              )}

            </button>

          </form>

          {/* FOOTER */}

          <div className="mt-5 sm:mt-6 text-center">

            <p className="text-xs sm:text-sm text-gray-500">
              Smart Event Management System
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
