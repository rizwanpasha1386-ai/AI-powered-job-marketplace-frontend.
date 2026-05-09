import { WorkSession } from '../../models/workSession.model.js';
import { Rating } from '../../models/rating.model.js';
import { Message } from '../../models/message.model.js';
import { EmployeeProfile } from '../../models/employeeProfile.model.js';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Convert a raw numeric score (0-100) to a trust level label */
const scoreTolevel = (score) => {
  if (score >= 80) return 'High';
  if (score >= 55) return 'Medium';
  return 'Low';
};

/** Collect all work-session based metrics for any user (employee or recruiter) */
const getSessionMetrics = async (profileId, role) => {
  const matchField = role === 'employee' ? 'employee' : 'recruiter';
  const sessions = await WorkSession.find({ [matchField]: profileId });

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'completed').length;
  const cancelled = sessions.filter((s) => s.status === 'cancelled').length;
  const active = sessions.filter((s) => s.status === 'active').length;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  return { total, completed, cancelled, active, cancellationRate };
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYEE ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export const calculateEmployeeTrust = async (userId) => {
  const profile = await EmployeeProfile.findOne({ user: userId }).populate('user', 'name');
  if (!profile) throw new Error('Employee profile not found');

  // 1. Rating data
  const ratingStats = await Rating.getAverageRating(userId);
  const { averageRating, numReviews } = ratingStats;

  // 2. Session metrics
  const sessions = await getSessionMetrics(profile._id, 'employee');

  // 3. Message activity (communication signal)
  const sessionIds = (await WorkSession.find({ employee: profile._id })).map((s) => s._id);
  const messageCount = await Message.countDocuments({ sender: userId, workSession: { $in: sessionIds } });

  // 4. Profile completeness (each field worth points)
  let completeness = 0;
  if (profile.bio) completeness += 10;
  if (profile.skills?.length > 0) completeness += 20;
  if (profile.experience?.length > 0) completeness += 20;
  if (profile.education?.length > 0) completeness += 10;
  if (profile.preferredJobType) completeness += 10;
  if (profile.preferredSalary) completeness += 10;
  if (profile.availabilityStatus) completeness += 10;
  if (profile.location?.coordinates?.length === 2) completeness += 10;

  // ── TRUST SCORE CALCULATION (weighted) ──────────────────────────────────
  let score = 0;
  // Ratings (35 pts max)
  score += Math.min((averageRating / 5) * 35, 35);
  // Completed jobs (25 pts max, cap at 10 jobs)
  score += Math.min(sessions.completed * 2.5, 25);
  // Cancellation penalty (max -20)
  score -= Math.min(sessions.cancellationRate * 0.2, 20);
  // Communication activity (10 pts max, cap at 50 messages)
  score += Math.min((messageCount / 50) * 10, 10);
  // Profile completeness (10 pts max)
  score += (completeness / 100) * 10;

  const trustScore = Math.max(0, Math.round(score));
  const trustLevel = scoreTolevel(trustScore);

  // ── STRENGTHS & CONCERNS ─────────────────────────────────────────────────
  const strengths = [];
  const concerns = [];

  if (averageRating >= 4.5) strengths.push('Consistently top-rated by recruiters');
  else if (averageRating >= 3.5) strengths.push('Generally well-rated by recruiters');

  if (sessions.completed >= 5) strengths.push(`Completed ${sessions.completed} jobs successfully`);
  else if (sessions.completed >= 1) strengths.push(`${sessions.completed} completed job(s) on platform`);

  if (messageCount >= 20) strengths.push('Active communicator in workspaces');
  if (completeness >= 80) strengths.push('Well-developed professional profile');
  if (profile.skills?.length >= 5) strengths.push(`Diverse skill set: ${profile.skills.slice(0, 3).join(', ')} and more`);

  if (sessions.cancellationRate > 30) concerns.push(`High cancellation rate: ${sessions.cancellationRate}%`);
  if (averageRating > 0 && averageRating < 3.0) concerns.push('Lower than average recruiter ratings');
  if (sessions.total === 0) concerns.push('No work history on platform yet');
  if (completeness < 50) concerns.push('Profile is incomplete — fill in more details to build trust');
  if (messageCount < 5 && sessions.total > 0) concerns.push('Low communication activity in past workspaces');

  // ── SUMMARY TEXT ─────────────────────────────────────────────────────────
  const name = profile.user?.name || 'This candidate';
  let summary;
  if (trustLevel === 'High') {
    summary = `${name} is a highly trusted professional on this platform. With ${sessions.completed} completed job(s) and an average rating of ${averageRating}/5, they have consistently demonstrated strong work ethic and communication skills.`;
  } else if (trustLevel === 'Medium') {
    summary = `${name} shows a developing work history on this platform. With ${sessions.completed} completed job(s) and an average rating of ${averageRating}/5, they are building a positive track record.`;
  } else {
    summary = `${name} is new to the platform or has limited verifiable history. Recruiters should review their profile carefully before engaging.`;
  }

  return {
    trustScore,
    trustLevel,
    summary,
    strengths,
    concerns,
    metrics: {
      averageRating,
      numReviews,
      completedJobs: sessions.completed,
      cancelledJobs: sessions.cancelled,
      cancellationRate: sessions.cancellationRate,
      messagesSent: messageCount,
      profileCompleteness: completeness,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// RECRUITER ANALYTICS
// ─────────────────────────────────────────────────────────────────────────────

export const calculateRecruiterTrust = async (userId, recruiterProfile) => {
  // 1. Ratings this recruiter has received from employees
  const ratingStats = await Rating.getAverageRating(userId);
  const { averageRating, numReviews } = ratingStats;

  // 2. Session metrics
  const sessions = await getSessionMetrics(recruiterProfile._id, 'recruiter');

  // 3. Communication activity (messages sent by this user)
  const sessionIds = (await WorkSession.find({ recruiter: recruiterProfile._id })).map((s) => s._id);
  const messageCount = await Message.countDocuments({ sender: userId, workSession: { $in: sessionIds } });

  // ── TRUST SCORE CALCULATION ───────────────────────────────────────────────
  let score = 0;
  score += Math.min((averageRating / 5) * 40, 40);
  score += Math.min(sessions.completed * 3, 30);
  score -= Math.min(sessions.cancellationRate * 0.3, 25);
  score += Math.min((messageCount / 30) * 10, 10);
  // Bonus: verified status
  if (recruiterProfile.verifiedStatus) score += 10;

  const trustScore = Math.max(0, Math.round(score));
  const trustLevel = scoreTolevel(trustScore);

  // ── STRENGTHS & CONCERNS ─────────────────────────────────────────────────
  const strengths = [];
  const concerns = [];

  if (recruiterProfile.verifiedStatus) strengths.push('Verified company account');
  if (averageRating >= 4.5) strengths.push('Highly rated by hired employees');
  else if (averageRating >= 3.5) strengths.push('Generally well-rated by employees');
  if (sessions.completed >= 5) strengths.push(`Successfully completed ${sessions.completed} work engagements`);
  if (messageCount >= 15) strengths.push('Actively communicates with workers in workspaces');
  if (recruiterProfile.companyDescription) strengths.push('Detailed company profile provided');

  if (sessions.cancellationRate > 30) concerns.push(`High cancellation rate: ${sessions.cancellationRate}%`);
  if (sessions.total === 0) concerns.push('No completed hiring history on platform yet');
  if (averageRating > 0 && averageRating < 3.0) concerns.push('Low satisfaction ratings from hired employees');

  // ── SUMMARY TEXT ─────────────────────────────────────────────────────────
  const company = recruiterProfile.companyName || 'This recruiter';
  let summary;
  if (trustLevel === 'High') {
    summary = `${company} is a highly trusted recruiter on this platform. They have successfully completed ${sessions.completed} work engagement(s) with an average employee satisfaction rating of ${averageRating}/5.`;
  } else if (trustLevel === 'Medium') {
    summary = `${company} has a developing reputation on this platform with ${sessions.completed} completed engagement(s). They show a generally positive track record.`;
  } else {
    summary = `${company} is relatively new to the platform or has limited verifiable hiring history. Candidates should review their profile carefully before engaging.`;
  }

  return {
    trustScore,
    trustLevel,
    summary,
    strengths,
    concerns,
    metrics: {
      averageRating,
      numReviews,
      completedEngagements: sessions.completed,
      cancelledEngagements: sessions.cancelled,
      cancellationRate: sessions.cancellationRate,
      messagesSent: messageCount,
      verified: recruiterProfile.verifiedStatus,
    },
  };
};
