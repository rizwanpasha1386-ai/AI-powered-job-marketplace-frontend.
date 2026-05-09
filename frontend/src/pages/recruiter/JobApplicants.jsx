import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const JobApplicants = () => {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await api.get(`/applications/job/${id}`);
        setApplications(data.data);
      } catch (err) {
        setError('Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const updateStatus = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      // Update local state to reflect change
      setApplications(applications.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link to="/recruiter/jobs" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Job Management
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Applicants</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Review and manage candidates who applied to this position.
        </p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      {applications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants yet</h3>
          <p className="text-gray-500 dark:text-gray-400">When someone applies, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
                      {app.employee?.user?.name || 'Applicant'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {app.employee?.preferredJobType || 'Professional'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full shrink-0
                    ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    ${app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                    ${app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                    ${app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                  `}>
                    {app.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {app.employee?.bio || 'No bio provided.'}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {app.employee?.skills?.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                  {app.employee?.skills?.length > 3 && (
                    <span className="text-xs text-gray-500 italic ml-1">+{app.employee.skills.length - 3} more</span>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                  Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Update Status</p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateStatus(app._id, 'shortlisted')}
                    disabled={app.status === 'shortlisted'}
                    className="text-xs font-medium py-1.5 px-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded transition-colors disabled:opacity-50"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, 'accepted')}
                    disabled={app.status === 'accepted'}
                    className="text-xs font-medium py-1.5 px-2 bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded transition-colors disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, 'rejected')}
                    disabled={app.status === 'rejected'}
                    className="text-xs font-medium py-1.5 px-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 rounded transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplicants;
