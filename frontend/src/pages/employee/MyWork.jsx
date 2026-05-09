import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const MyWork = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get('/work-sessions');
        setSessions(data.data);
      } catch (err) {
        setError('Failed to load work sessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading your work sessions...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Active Work</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your accepted jobs and communicate with recruiters.</p>
      </div>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}
      
      {sessions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any active work sessions yet.</p>
          <Link to="/employee/jobs" className="text-blue-600 dark:text-blue-400 hover:underline">Find open jobs &rarr;</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between transition-shadow hover:shadow-md">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{session.job?.title || 'Unknown Job'}</h3>
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full shrink-0 ${
                    session.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                    session.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span> {session.recruiter?.companyName}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Recruiter:</span> {session.recruiter?.user?.name}
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

export default MyWork;
