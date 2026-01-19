import { useAuth } from "../context/AuthContext";

const Navbar = () => {

  const { user, logout } = useAuth();

  return (
    <div className="bg-white p-4 shadow flex justify-between items-center">

      <div>
        Welcome, <span className="font-semibold">{user?.fullName}</span>
      </div>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;
