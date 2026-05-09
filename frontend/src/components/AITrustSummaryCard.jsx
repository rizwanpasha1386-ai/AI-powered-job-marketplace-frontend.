import { useState } from 'react';
import api from '../services/api';

const AITrustSummaryCard = ({ employeeId, initialSummary }) => {
  const [summary, setSummary] = useState(initialSummary || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/ai/employees/${employeeId}/generate-summary`);
      setSummary(data.data);
    } catch (err) {
      setError('Failed to generate AI summary.');
    } finally {
      setLoading(false);
    }
  };

  const getTrustBadgeColor = (level) => {
    if (level === 'High') return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800';
    if (level === 'Medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/80 dark:to-gray-800/80 rounded-xl p-6 border border-blue-100 dark:border-gray-700 mt-4 text-center">
        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyzing candidate data...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/80 dark:to-gray-800/80 rounded-xl p-6 border border-blue-100 dark:border-gray-700 mt-4 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm mb-3">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <h4 className="text-md font-bold text-gray-900 dark:text-white mb-1">AI Candidate Analysis</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
          Generate an instant AI assessment of this candidate's reliability, communication style, and profile strength.
        </p>
        <button 
          onClick={generateSummary} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-6 rounded-full shadow-sm transition-colors flex items-center"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Generate Summary
        </button>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mt-4 overflow-hidden shadow-sm">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-3 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">AI Trust Verification</h4>
        </div>
        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded border ${getTrustBadgeColor(summary.trustLevel)}`}>
          {summary.trustLevel} Trust
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Professional Summary</h5>
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
            {summary.professionalSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div>
            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Reliability</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {summary.reliabilityAnalysis}
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Communication</h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {summary.communicationBehavior}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            onClick={generateSummary} 
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITrustSummaryCard;
