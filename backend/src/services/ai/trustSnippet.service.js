import { Rating } from '../../models/rating.model.js';
import { WorkSession } from '../../models/workSession.model.js';
import { RecruiterProfile } from '../../models/recruiterProfile.model.js';
import { EmployeeProfile } from '../../models/employeeProfile.model.js';

/**
 * Returns a lightweight, public-safe trust snippet for an employee User._id.
 * Does NOT expose private info — only aggregated analytics.
 */
export const getEmployeeTrustSnippet = async (userId) => {
  try {
    const [ratingStats, profile] = await Promise.all([
      Rating.getAverageRating(userId),
      EmployeeProfile.findOne({ user: userId }).select('_id skills availabilityStatus'),
    ]);

    if (!profile) return null;

    const sessionCount = await WorkSession.countDocuments({
      employee: profile._id,
      status: 'completed',
    });

    const { averageRating, numReviews } = ratingStats;

    // Simple rule-based trust level from completed sessions + rating
    let trustScore = 0;
    trustScore += Math.min((averageRating / 5) * 50, 50);
    trustScore += Math.min(sessionCount * 5, 30);
    trustScore += numReviews > 0 ? 20 : 0;
    trustScore = Math.round(trustScore);

    const trustLevel = trustScore >= 80 ? 'High' : trustScore >= 50 ? 'Medium' : 'Low';

    return {
      trustScore,
      trustLevel,
      averageRating,
      numReviews,
      completedJobs: sessionCount,
    };
  } catch {
    return null;
  }
};

/**
 * Returns a lightweight, public-safe trust snippet for a recruiter User._id.
 * Does NOT expose private info — only aggregated analytics.
 */
export const getRecruiterTrustSnippet = async (userId) => {
  try {
    const [ratingStats, profile] = await Promise.all([
      Rating.getAverageRating(userId),
      RecruiterProfile.findOne({ user: userId }).select('_id verifiedStatus'),
    ]);

    if (!profile) return null;

    const sessionCount = await WorkSession.countDocuments({
      recruiter: profile._id,
      status: 'completed',
    });

    const { averageRating, numReviews } = ratingStats;

    let trustScore = 0;
    trustScore += Math.min((averageRating / 5) * 50, 50);
    trustScore += Math.min(sessionCount * 5, 30);
    if (profile.verifiedStatus) trustScore += 20;
    trustScore = Math.round(trustScore);

    const trustLevel = trustScore >= 80 ? 'High' : trustScore >= 50 ? 'Medium' : 'Low';

    return {
      trustScore,
      trustLevel,
      averageRating,
      numReviews,
      completedEngagements: sessionCount,
      verified: profile.verifiedStatus,
    };
  } catch {
    return null;
  }
};
