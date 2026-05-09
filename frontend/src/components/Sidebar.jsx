import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const location = useLocation();

  const employeeLinks = [
    { name: 'Dashboard', path: '/employee/dashboard' },
    { name: 'My Profile', path: '/employee/profile' },
    { name: 'Find Jobs', path: '/employee/jobs' },
    { name: 'My Applications', path: '/employee/applications' },
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard' },
    { name: 'Company Profile', path: '/recruiter/profile' },
    { name: 'Post a Job', path: '/recruiter/jobs/new' },
    { name: 'Manage Jobs', path: '/recruiter/jobs' },
    { name: 'Search Talent', path: '/recruiter/search' },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : employeeLinks;

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Component */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            AI JobConnect
          </Link>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
