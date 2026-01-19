import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const StudentLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <Navbar/>

        {/* Page Content */}
        <div className="p-6 overflow-y-auto">
          <Outlet />
        </div>

      </div>

    </div>
  );
};

export default StudentLayout;
