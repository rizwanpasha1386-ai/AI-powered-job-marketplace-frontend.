import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import TrustCard from '../../components/TrustCard';

const QuickLink = ({ to, label, description, color }) => (
  <Link
    to={to}
    className={`block p-4 rounded-xl border ${color} transition-all hover:shadow-md group`}
  >
    <p className="font-semibold text-gray-900 dark:text-white group-hover:underline">{label}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
  </Link>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's an overview of your trust profile and quick actions.
        </p>
      </div>

      {/* Trust Analytics Card */}
      <TrustCard userId={user?._id} role="employee" title="My Trust Profile" />

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink
            to="/employee/jobs"
            label="Find Jobs"
            description="Browse skill-matched openings"
            color="border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
          />
          <QuickLink
            to="/employee/applications"
            label="My Applications"
            description="Track all your job applications"
            color="border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
          />
          <QuickLink
            to="/employee/work"
            label="Active Work"
            description="Open your current workspace"
            color="border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
          />
          <QuickLink
            to="/employee/profile"
            label="My Profile"
            description="Update skills & experience"
            color="border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-gray-800/30"
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
