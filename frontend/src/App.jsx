import { Routes, Route } from 'react-router-dom';

// Layouts & Route Protections
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeProfile from './pages/employee/Profile';
import EmployeeProfileForm from './pages/employee/ProfileForm';
import MyApplications from './pages/employee/MyApplications';
import JobList from './pages/jobs/JobList';
import JobDetails from './pages/jobs/JobDetails';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterProfile from './pages/recruiter/Profile';
import RecruiterProfileForm from './pages/recruiter/ProfileForm';
import JobManagement from './pages/recruiter/JobManagement';
import JobForm from './pages/recruiter/JobForm';
import JobApplicants from './pages/recruiter/JobApplicants';
import EmployeeSearch from './pages/recruiter/EmployeeSearch';
import Notifications from './pages/Notifications';
import MyWork from './pages/employee/MyWork';
import ActiveWorkers from './pages/recruiter/ActiveWorkers';
import Workspace from './pages/work-session/Workspace';

function App() {
  return (
    <Routes>
      {/* Public Routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes wrapped in DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          
          {/* Shared Routes */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/work-session/:id" element={<Workspace />} />

          {/* Employee Only Routes */}
          <Route element={<RoleRoute requiredRole="employee" />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/employee/profile/edit" element={<EmployeeProfileForm />} />
            <Route path="/employee/jobs" element={<JobList />} />
            <Route path="/employee/jobs/:id" element={<JobDetails />} />
            <Route path="/employee/applications" element={<MyApplications />} />
            <Route path="/employee/work" element={<MyWork />} />
          </Route>

          {/* Recruiter Only Routes */}
          <Route element={<RoleRoute requiredRole="recruiter" />}>
            <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            <Route path="/recruiter/profile/edit" element={<RecruiterProfileForm />} />
            <Route path="/recruiter/jobs" element={<JobManagement />} />
            <Route path="/recruiter/jobs/new" element={<JobForm />} />
            <Route path="/recruiter/jobs/edit/:id" element={<JobForm />} />
            <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicants />} />
            <Route path="/recruiter/search" element={<EmployeeSearch />} />
            <Route path="/recruiter/work" element={<ActiveWorkers />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
