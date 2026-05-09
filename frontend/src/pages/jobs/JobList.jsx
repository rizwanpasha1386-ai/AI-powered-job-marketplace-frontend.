import { useState, useEffect } from 'react';
import api from '../../services/api';
import JobCard from '../../components/JobCard';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data.data);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Finding the best opportunities...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Jobs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Browse the latest open positions tailored for you.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-10 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No jobs are currently available. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} isRecruiterView={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
