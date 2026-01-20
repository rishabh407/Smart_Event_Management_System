import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoordinatorDashboard from "./pages/CoordinationDashboard";
import HodDashboard from "./pages/HodDashboard";
import ChangePassword from "./pages/ChangePassword";
import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import Events from "./pages/student/Events";
import Certificates from "./pages/student/Certificates";
import Team from "./pages/student/Team";
import Competitions from "./pages/student/Competition";
import CompetitionRegisteration from "./pages/student/CompetitionRegisteration";
import MyRegistrations from "./pages/student/Registerations";
import IndividualRegistration from "./pages/student/IndividualRegisteration";
import TeamRegisteration from "./pages/student/TeamRegisteration";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

      {/* Public Routes */}

        <Route path="/" element={<Login />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
{/* Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
        <Route path="/student/events/:eventId" element={<Competitions/>} />
        <Route
  path="/student/events/:eventId/competitions/:competitionId/register"
  element={<CompetitionRegisteration />}
/>

          <Route index element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="/student/event/competition/individualregisteration" element={<IndividualRegistration />} />
            <Route path="/student/event/competition/teamregisteration" element={<TeamRegisteration/>} />
            <Route path="/student/registrations" element={<MyRegistrations/>} />
            <Route path="certificates" element={<Certificates/>} />
            <Route path="team" element={<Team />} />
        </Route>


        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/coordinator"
          element={
            <ProtectedRoute>
              <CoordinatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hod"
          element={
            <ProtectedRoute>
              <HodDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
