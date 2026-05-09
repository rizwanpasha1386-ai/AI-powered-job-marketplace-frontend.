import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const DashboardNavbar = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* User Info & Actions */}
      <div className="flex-1 px-4 flex justify-end">
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <NotificationDropdown />
          
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block border-l pl-4 border-gray-200 dark:border-gray-700">
            {user?.name} <span className="text-xs text-gray-500 capitalize">({user?.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
