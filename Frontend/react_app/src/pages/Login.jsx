// import { useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";
// import { useNavigate } from "react-router-dom";
// import { useContext } from "react";
// import toast from "react-hot-toast";

// const Login = () => {
//   const [form, setForm] = useState({
//     identifier: "",
//     password: ""
//   });

//   const [loading, setLoading] = useState(false);
//   const { login, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Navigate after user is loaded
//   useEffect(() => {
//     if (user && !loading) {
//       const role = user.role;
//       const firstLogin = user.isFirstLogin;

//       if (role === "STUDENT" && firstLogin === true) {
//         navigate("/change-password");
//       } else if (role === "STUDENT" && firstLogin === false) {
//         navigate("/student");
//       } else if (role === "TEACHER") {
//         navigate("/teacher");
//       } else if (role === "COORDINATOR") {
//         navigate("/coordinator");
//       } else if (role === "HOD") {
//         navigate("/hod");
//       }
//     }
//   }, [user, loading, navigate]);

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (!form.identifier || !form.password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       await login(form);
//       // Navigation will be handled by useEffect when user is loaded
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error(err.response?.data?.message || err.message || "Login failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       <div className="w-full max-w-md">
//         {/* Login Card */}
//         <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
//               <span className="text-3xl text-white">🎓</span>
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               Smart Event Management
//             </h1>
//             <p className="text-gray-600">
//               Sign in to your account
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={submitHandler} className="space-y-6">
//             {/* Email/Roll Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email / Roll Number
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your email or roll number"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 value={form.identifier}
//                 onChange={(e) =>
//                   setForm({ ...form, identifier: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                 value={form.password}
//                 onChange={(e) =>
//                   setForm({ ...form, password: e.target.value })
//                 }
//                 required
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
//                 loading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Signing in...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-500">
//               Smart Event Management System
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

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

    if (user) {

      const role = user.role;
      const firstLogin = user.isFirstLogin;
    //  console.log(firstLogin);
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

    }

  }, [user, navigate]);

  // ---------------- LOGIN HANDLER ----------------

  const submitHandler = async (e) => {

    e.preventDefault();

    if (!form.identifier || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

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

      // IMPORTANT — STOP LOADER ALWAYS
      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4">
              <span className="text-3xl text-white">🎓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Smart Event Management
            </h1>
            <p className="text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={submitHandler} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Roll Number
              </label>
              <input
                type="text"
                placeholder="Enter your email or roll number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Smart Event Management System
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
