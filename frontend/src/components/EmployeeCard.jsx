import { useState } from 'react';
import TrustSnippetBadge from './TrustSnippetBadge';
import AITrustSummaryCard from './AITrustSummaryCard';

const EmployeeCard = ({ employee }) => {
  const [showAi, setShowAi] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
              {employee.userDetails?.name || 'Professional Worker'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {employee.preferredJobType || 'Any'} &bull;{' '}
              {employee.calculatedDistance !== undefined
                ? `${employee.calculatedDistance.toFixed(1)} km away`
                : 'Distance unknown'}
            </p>
          </div>
          {/* Availability Badge */}
          <span
            className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full shrink-0 ${
              employee.availabilityStatus === 'Available'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : employee.availabilityStatus === 'Actively Looking'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {employee.availabilityStatus || 'Unknown'}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {employee.bio || 'No bio provided.'}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-4">
          {employee.skills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
          {employee.skills?.length > 4 && (
            <span className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
              +{employee.skills.length - 4} more
            </span>
          )}
          {(!employee.skills || employee.skills.length === 0) && (
            <span className="text-xs text-gray-400 italic">No skills listed</span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
        {/* Live trust snippet from backend analytics */}
        <TrustSnippetBadge snippet={employee.trustSnippet} variant="employee" />

        {/* Deep AI analysis toggle */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowAi(!showAi)}
            className={`text-xs font-medium transition-colors flex items-center gap-1 ${
              showAi ? 'text-indigo-700 dark:text-indigo-400' : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            {showAi ? 'Hide Full Analysis' : 'Full AI Analysis'}
          </button>
        </div>
      </div>

      {/* Embedded AI Trust Summary Component */}
      {showAi && (
        <AITrustSummaryCard employeeId={employee._id} initialSummary={employee.aiTrustSummary} />
      )}
    </div>
  );
};

export default EmployeeCard;
