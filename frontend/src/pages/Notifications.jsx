import { useState, useEffect } from 'react';
import api from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data.data);
      } catch (err) {
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id, currentStatus) => {
    if (currentStatus) return; // Already read
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, readStatus: true } : n
      ));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading notifications...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Stay updated on your latest activities and application statuses.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-16 text-center border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're all caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            You don't have any notifications right now.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  !notification.readStatus ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="shrink-0 pt-1">
                  {/* Icon based on notification type if desired, or simple dot */}
                  <div className={`w-3 h-3 rounded-full ${!notification.readStatus ? 'bg-blue-500 shadow-sm shadow-blue-500/50' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${!notification.readStatus ? '' : 'text-gray-700 dark:text-gray-300'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      {new Date(notification.createdAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {!notification.readStatus && (
                    <button
                      onClick={() => markAsRead(notification._id, notification.readStatus)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-md transition-colors inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
