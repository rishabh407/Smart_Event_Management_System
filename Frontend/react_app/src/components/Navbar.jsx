import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
        </div>
        <div>
          <p className="text-sm text-gray-600">Welcome back,</p>
          <p className="font-semibold text-gray-900">{user?.fullName || "Student"}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.rollNumber && (
          <div className="text-right">
            <p className="text-xs text-gray-500">Roll Number</p>
            <p className="font-medium text-gray-900">{user.rollNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
