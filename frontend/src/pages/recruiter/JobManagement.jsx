import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMyJobs = async () => {
    try {
      const { data } = await api.get('/jobs/recruiter/me');
      setJobs(data.data);
    } catch (err) {
      setError('Failed to load your jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) {
      try {
        await api.delete(`/jobs/${jobId}`);
        setJobs(jobs.filter(job => job._id !== jobId));
      } catch (err) {
        alert('Failed to delete job.');
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading your jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View, edit, or remove your job postings.</p>
        </div>
        <Link
          to="/recruiter/jobs/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Post New Job
        </Link>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>}

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first job posting to attract top talent.</p>
          <Link
            to="/recruiter/jobs/new"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Post a job &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isRecruiterView={true} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobManagement;
