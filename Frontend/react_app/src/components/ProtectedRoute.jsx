import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 FORCE PASSWORD CHANGE FOR STUDENT
  if (
    user.role === "STUDENT" &&
    user.isFirstLogin === true &&
    location.pathname !== "/change-password"
  ) {
    return <Navigate to="/change-password" replace />;
  }

  return children;
}
