import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (e, id, readStatus) => {
    e.preventDefault();
    e.stopPropagation();
    if (readStatus) return; // Already read

    try {
      await api.put(`/notifications/${id}/read`);
      // Update local state
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, readStatus: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.readStatus).length;
  const displayNotifications = notifications.slice(0, 5); // Show top 5

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications(); // Refresh when opening
        }}
        className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-gray-800">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {displayNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 flex gap-3 ${
                      !notification.readStatus ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${!notification.readStatus ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold text-gray-900 dark:text-white mb-0.5 ${!notification.readStatus ? '' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                        {!notification.readStatus && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification._id, notification.readStatus)}
                            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block py-1"
            >
              View All Notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
