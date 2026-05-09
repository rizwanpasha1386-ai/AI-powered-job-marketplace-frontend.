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

const RecruiterDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here's your company trust profile and a summary of your hiring activity.
        </p>
      </div>

      {/* Trust Analytics Card */}
      <TrustCard userId={user?._id} role="recruiter" title="Company Trust Profile" />

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink
            to="/recruiter/jobs/new"
            label="Post a Job"
            description="Create a new job listing"
            color="border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
          />
          <QuickLink
            to="/recruiter/jobs"
            label="Manage Jobs"
            description="View and edit your job postings"
            color="border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-500 bg-purple-50/50 dark:bg-purple-900/10"
          />
          <QuickLink
            to="/recruiter/search"
            label="Search Talent"
            description="Find nearby skilled workers"
            color="border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10"
          />
          <QuickLink
            to="/recruiter/work"
            label="Active Workers"
            description="Manage ongoing work sessions"
            color="border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50/50 dark:bg-gray-800/30"
          />
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
