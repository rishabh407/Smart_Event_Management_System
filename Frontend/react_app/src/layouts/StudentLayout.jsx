import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">

        <Navbar toggleSidebar={() => setOpen(!open)} />
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default StudentLayout;
