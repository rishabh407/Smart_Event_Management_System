import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
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
import ManageEvents from "./pages/hod/ManageEvents";
import CreateEvent from "./pages/hod/CreateEvent";
import HodDashboard from "./pages/hod/HodDashboard";
import EditEvent from "./pages/hod/EditEvent";
import HodLayout from "./layouts/HodLayout";
import CoordinatorLayout from "./layouts/CoordinatorLayout";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import ManageCompetitions from "./pages/coordinator/ManageCompetitions";
import CreateCompetitions from "./pages/coordinator/CreateCompetitions";
import EditCompetition from "./pages/coordinator/EditCompetition";
import AssignTeachers from "./pages/coordinator/AssignTeachers";
import MyEvents from "./pages/coordinator/MyEvents";
import CompetitionDetails from "./pages/coordinator/CompetitionDetails";
import CompetitionRegistrations from "./pages/coordinator/CompetitionRegistrations";
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
          <Route path="/student/events/:eventId" element={<Competitions />} />
          <Route
            path="/student/events/:eventId/competitions/:competitionId/register"
            element={<CompetitionRegisteration />}
          />

          <Route index element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route
            path="/student/event/competition/individualregisteration"
            element={<IndividualRegistration />}
          />
          <Route
            path="/student/event/competition/teamregisteration"
            element={<TeamRegisteration />}
          />
          <Route path="/student/registrations" element={<MyRegistrations />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="/student/team" element={<Team />} />
        </Route>
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

{/* COORDINATE PANEL*/}

{/* ================= COORDINATOR PANEL ================= */}

<Route
 path="/coordinator"
 element={
  <ProtectedRoute>
   <CoordinatorLayout />
  </ProtectedRoute>
 }
>

 {/* Default page */}
 {/* <Route index element={<CoordinatorDashboard />} /> */}
<Route index element={<Navigate to="dashboard" />} />
 {/* Dashboard */}
 <Route path="dashboard" element={<CoordinatorDashboard />} />

 {/* My Events page (NEW) */}
 <Route path="events" element={<MyEvents />} />

 {/* Event based competition management */}
 <Route
  path="events/:eventId/competitions"
  element={<ManageCompetitions />}
 />
 <Route
 path="events/:eventId/competitions/create"
 element={<CreateCompetitions />}
/>
<Route
 path="competitions/edit/:id"
 element={<EditCompetition/>}
/>
<Route
 path="competitions/details/:id"
 element={<CompetitionDetails />}
/>

<Route
 path="competitions/:competitionId/registrations"
 element={<CompetitionRegistrations />}
/>


<Route
 path="competitions/:competitionId/assign-teachers"
 element={<AssignTeachers />}
/>

{/* <Route
 path="competitions/:id/monitor"
 element={<CompetitionMonitor />}
/> */}

</Route>


{/*=============================== HOD PANEL ======================*/}

        <Route
          path="/hod"
          element={
            <ProtectedRoute>
              <HodLayout />
            </ProtectedRoute>
          }
        >
          <Route index path="/hod/dashboard" element={<HodDashboard />} />
          <Route path="/hod/manage-events" element={<ManageEvents />} />
          <Route path="/hod/events/create" element={<CreateEvent />} />
          <Route path="/hod/events/edit/:id" element={<EditEvent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
