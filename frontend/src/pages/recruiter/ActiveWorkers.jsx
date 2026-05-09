import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ActiveWorkers = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get('/work-sessions');
        setSessions(data.data);
      } catch (err) {
        setError('Failed to load active workers.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading active workers...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Active Workers</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your hired employees and communicate with them seamlessly.</p>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}
      
      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any active workers yet.</p>
          <Link to="/recruiter/search" className="text-blue-600 dark:text-blue-400 hover:underline">Find new talent &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-shadow hover:shadow-md">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{session.employee?.user?.name || 'Unknown Employee'}</h3>
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full shrink-0 ${
                    session.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    session.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Job:</span> {session.job?.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mb-6">
                  Accepted on {new Date(session.acceptedAt).toLocaleDateString()}
                </div>
              </div>
              <Link to={`/work-session/${session._id}`} className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                Open Workspace
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveWorkers;
