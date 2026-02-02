import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const StudentLayout = () => {

  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 overflow-hidden">

        <Navbar toggleSidebar={() => setOpen(!open)} />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default StudentLayout;

// .made this page also fully responsive and if you think there is need of any thing to add into this add it successfully?