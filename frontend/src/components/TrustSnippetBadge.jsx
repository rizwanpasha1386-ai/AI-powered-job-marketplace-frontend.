/**
 * TrustSnippetBadge — renders a compact, public-safe trust display.
 * Designed to sit inside job cards and employee cards without taking up too much space.
 *
 * Props:
 *  snippet: { trustScore, trustLevel, averageRating, numReviews, completedJobs|completedEngagements, verified? }
 *  variant: 'employee' | 'recruiter'  (controls label copy)
 */

const levelStyles = {
  High: {
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    score: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Medium: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    score: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Low: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
    score: 'text-red-500 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

const StarMini = ({ rating }) => {
  const filled = Math.round(rating || 0);
  return (
    <span className="flex items-center gap-px">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3 h-3 ${n <= filled ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
};

const TrustSnippetBadge = ({ snippet, variant = 'employee' }) => {
  if (!snippet) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" />
        No trust data yet
      </div>
    );
  }

  const { trustScore, trustLevel, averageRating, numReviews, verified } = snippet;
  const completedCount = snippet.completedJobs ?? snippet.completedEngagements ?? 0;
  const completedLabel = variant === 'recruiter' ? 'hires' : 'jobs';
  const styles = levelStyles[trustLevel] || levelStyles['Low'];

  return (
    <div className="flex flex-col gap-2">
      {/* Trust level badge row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          {trustLevel} Trust
        </span>

        <span className={`text-sm font-black ${styles.score}`}>
          {trustScore}
          <span className="text-[10px] font-medium opacity-70">/100</span>
        </span>

        {verified && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        {averageRating > 0 ? (
          <span className="flex items-center gap-1">
            <StarMini rating={averageRating} />
            <span className="font-semibold text-gray-700 dark:text-gray-300">{averageRating}</span>
            {numReviews > 0 && <span>({numReviews})</span>}
          </span>
        ) : (
          <span className="italic">No ratings yet</span>
        )}

        <span className="text-gray-300 dark:text-gray-600">•</span>

        <span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{completedCount}</span>{' '}
          {completedLabel} completed
        </span>
      </div>
    </div>
  );
};

export default TrustSnippetBadge;
