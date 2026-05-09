import { Link } from 'react-router-dom';
import TrustSnippetBadge from './TrustSnippetBadge';

const JobCard = ({ job, isRecruiterView = false, onDelete }) => {
  const formatLocation = (loc) => {
    if (!loc) return 'Remote';
    if (typeof loc === 'string') return loc;
    if (loc.address) return loc.address;
    if (loc.coordinates?.length === 2) return `${loc.coordinates[1].toFixed(4)}, ${loc.coordinates[0].toFixed(4)}`;
    return 'Remote';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{job.title}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full shrink-0 ${
              job.status === 'open'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {job.status === 'open' ? 'Open' : 'Closed'}
          </span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {job.recruiter?.companyName || 'Company'} &bull; {formatLocation(job.location)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
            {job.jobType}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
            {job.salary ? `$${job.salary.toLocaleString()}` : 'Salary not specified'}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded">
            {job.experienceRequired} exp
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {job.requiredSkills?.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              {skill}
            </span>
          ))}
          {job.requiredSkills?.length > 3 && (
            <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              +{job.requiredSkills.length - 3} more
            </span>
          )}
        </div>

        {/* Recruiter Trust Snippet — only on employee-facing view */}
        {!isRecruiterView && (
          <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
            <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-2 tracking-wider">Recruiter Trust</p>
            <TrustSnippetBadge snippet={job.recruiter?.trustSnippet} variant="recruiter" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
        {isRecruiterView ? (
          <div className="flex space-x-2 w-full">
            <Link
              to={`/recruiter/jobs/${job._id}/applicants`}
              className="flex-1 text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Applicants
            </Link>
            <Link
              to={`/recruiter/jobs/edit/${job._id}`}
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(job._id)}
              className="flex-1 text-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link
            to={`/employee/jobs/${job._id}`}
            className="w-full text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 py-2 rounded-md text-sm font-medium transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
