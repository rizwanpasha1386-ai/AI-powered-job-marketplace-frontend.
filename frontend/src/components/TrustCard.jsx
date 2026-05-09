import { useState, useEffect } from 'react';
import api from '../services/api';

// ── Sub-components ────────────────────────────────────────────────────────────

const ScoreRing = ({ score }) => {
  const level = score >= 80 ? 'High' : score >= 55 ? 'Medium' : 'Low';
  const color =
    level === 'High' ? 'text-emerald-500' : level === 'Medium' ? 'text-amber-500' : 'text-red-400';
  const ring =
    level === 'High'
      ? 'border-emerald-400'
      : level === 'Medium'
      ? 'border-amber-400'
      : 'border-red-400';
  const bg =
    level === 'High'
      ? 'bg-emerald-50 dark:bg-emerald-900/20'
      : level === 'Medium'
      ? 'bg-amber-50 dark:bg-amber-900/20'
      : 'bg-red-50 dark:bg-red-900/20';

  return (
    <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 ${ring} ${bg} shrink-0`}>
      <span className={`text-3xl font-black ${color}`}>{score}</span>
      <span className={`text-xs font-bold uppercase ${color}`}>{level}</span>
    </div>
  );
};

const StarRating = ({ rating }) => {
  const stars = Math.round(rating);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-4 h-4 ${n <= stars ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">{rating || '—'}</span>
    </span>
  );
};

const MetricBadge = ({ label, value, accent }) => (
  <div className={`flex flex-col items-center justify-center p-3 rounded-xl ${accent} text-center`}>
    <span className="text-2xl font-black">{value ?? '—'}</span>
    <span className="text-[11px] font-medium mt-0.5 opacity-80">{label}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

/**
 * TrustCard — fetches and displays trust analytics for a given userId and role.
 * @param {string} userId  — the User._id to fetch analytics for
 * @param {string} role    — 'employee' | 'recruiter'
 * @param {string} title   — optional card title override
 */
const TrustCard = ({ userId, role, title }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    const endpoint =
      role === 'recruiter'
        ? `/ai/recruiters/${userId}/trust-summary`
        : `/ai/employees/${userId}/trust-summary`;

    api
      .get(endpoint)
      .then((res) => setData(res.data.data))
      .catch(() => setError('Could not load trust data.'))
      .finally(() => setLoading(false));
  }, [userId, role]);

  if (loading)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
        <div className="flex gap-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200 dark:border-red-800 p-4 text-sm">
        {error}
      </div>
    );

  if (!data) return null;

  const { trustScore, trustLevel, summary, strengths, concerns, metrics } = data;

  const levelColor =
    trustLevel === 'High'
      ? 'text-emerald-600 dark:text-emerald-400'
      : trustLevel === 'Medium'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-red-500 dark:text-red-400';

  const employeeMetrics = [
    { label: 'Jobs Done', value: metrics?.completedJobs, accent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
    { label: 'Reviews', value: metrics?.numReviews, accent: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
    { label: 'Cancel Rate', value: `${metrics?.cancellationRate}%`, accent: metrics?.cancellationRate > 30 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
    { label: 'Messages', value: metrics?.messagesSent, accent: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' },
  ];

  const recruiterMetrics = [
    { label: 'Completed', value: metrics?.completedEngagements, accent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' },
    { label: 'Reviews', value: metrics?.numReviews, accent: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
    { label: 'Cancel Rate', value: `${metrics?.cancellationRate}%`, accent: metrics?.cancellationRate > 30 ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
    { label: 'Messages', value: metrics?.messagesSent, accent: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' },
  ];

  const metricSet = role === 'recruiter' ? recruiterMetrics : employeeMetrics;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {title || 'Trust Analytics'}
        </h2>
        {metrics?.verified && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Verified
          </span>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Score + Summary Row */}
        <div className="flex gap-6 items-start">
          <ScoreRing score={trustScore} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm font-bold uppercase tracking-wider ${levelColor}`}>
                {trustLevel} Trust
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <StarRating rating={metrics?.averageRating} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          {metricSet.map((m) => (
            <MetricBadge key={m.label} {...m} />
          ))}
        </div>

        {/* Strengths */}
        {strengths?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Strengths
            </h3>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concerns */}
        {concerns?.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Areas to Improve
            </h3>
            <ul className="space-y-1.5">
              {concerns.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No strengths or concerns empty state */}
        {strengths?.length === 0 && concerns?.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
            Complete more work sessions to build your trust profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrustCard;
