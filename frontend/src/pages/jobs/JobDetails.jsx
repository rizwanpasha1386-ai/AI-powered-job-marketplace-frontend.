import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data.data);
      } catch (err) {
        setError('Failed to load job details. It might have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      setError('');
      setSuccessMsg('');
      await api.post(`/applications/apply/${id}`);
      setSuccessMsg('Successfully applied for this job! You can track it in your applications dashboard.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading job details...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!job) return <div className="text-center py-20 text-gray-500">Job not found.</div>;

  const formatLocation = (loc) => {
    if (!loc) return 'Remote';
    if (typeof loc === 'string') return loc;
    if (loc.address) return loc.address;
    if (loc.coordinates?.length === 2) return `${loc.coordinates[1].toFixed(4)}, ${loc.coordinates[0].toFixed(4)}`;
    return 'Remote';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/employee/jobs" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-6">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Jobs
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-10 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
              {job.status === 'open' ? 'Actively Hiring' : 'Closed'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-600 dark:text-gray-300 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="font-medium text-gray-900 dark:text-white">{job.recruiter?.companyName || 'Company'}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>{formatLocation(job.location)}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{job.salary ? `$${job.salary.toLocaleString()}` : 'Not specified'}</span>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">{successMsg}</div>}

          <button
            onClick={handleApply}
            disabled={job.status !== 'open' || applying || successMsg}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applying ? 'Submitting...' : successMsg ? 'Applied' : job.status === 'open' ? 'Apply Now' : 'Applications Closed'}
          </button>
        </div>

        {/* Body Section */}
        <div className="p-6 sm:p-10 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Description</h2>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills?.map((skill, idx) => (
                  <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Job Details</h2>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Job Type</span>
                  <span className="font-medium">{job.jobType}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Experience Required</span>
                  <span className="font-medium">{job.experienceRequired}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Posted</span>
                  <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
