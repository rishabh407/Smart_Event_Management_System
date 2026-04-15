import { useAuth } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {

  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center sticky top-0 z-30">

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>

        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {user?.fullName?.charAt(0)?.toUpperCase() || "S"}
        </div>

        <div className="hidden sm:block">
          <p className="text-xs text-gray-500">
            Welcome back
          </p>
          <p className="font-semibold">
            {user?.fullName || "Student"}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-4">

        {user?.rollNumber && (
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500">
              Roll No
            </p>
            <p className="font-medium">
              {user.rollNumber}
            </p>
          </div>
        )}

      </div>

    </header>
  );
};

export default Navbar;
