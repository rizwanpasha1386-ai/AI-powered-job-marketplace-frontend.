import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { RecruiterProfile } from '../models/recruiterProfile.model.js';
import { generateTrustSummary } from '../services/ai/trustSummary.service.js';
import { calculateEmployeeTrust, calculateRecruiterTrust } from '../services/ai/trustAnalytics.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Generate AI Trust Summary for an employee (Recruiter-facing)
 * @route   POST /api/v1/ai/employees/:id/generate-summary
 * @access  Private (Recruiter only)
 */
export const generateEmployeeSummary = asyncHandler(async (req, res) => {
  const employeeId = req.params.id;

  const profile = await EmployeeProfile.findById(employeeId).populate('user', 'name');
  if (!profile) {
    res.status(404);
    throw new Error('Employee profile not found');
  }

  // Mock metrics (kept for backwards compatibility with the legacy UI card)
  const employeeData = {
    skills: profile.skills,
    experience: profile.experience,
    education: profile.education,
    availabilityStatus: profile.availabilityStatus,
    completedJobs: Math.floor(Math.random() * 15),
    recruiterRatings: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
    punctualityScore: Math.floor(Math.random() * (100 - 80) + 80),
  };

  const aiSummary = await generateTrustSummary(employeeData);

  profile.aiTrustSummary = aiSummary;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'AI Trust Summary generated successfully',
    data: profile.aiTrustSummary,
  });
});

/**
 * @desc    Get calculated Trust Analytics for an employee
 * @route   GET /api/v1/ai/employees/:userId/trust-summary
 * @access  Private (Authenticated)
 */
export const getEmployeeTrustSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const analytics = await calculateEmployeeTrust(userId);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});

/**
 * @desc    Get calculated Trust Analytics for a recruiter
 * @route   GET /api/v1/ai/recruiters/:userId/trust-summary
 * @access  Private (Authenticated)
 */
export const getRecruiterTrustSummary = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const recruiterProfile = await RecruiterProfile.findOne({ user: userId });
  if (!recruiterProfile) {
    res.status(404);
    throw new Error('Recruiter profile not found');
  }

  const analytics = await calculateRecruiterTrust(userId, recruiterProfile);

  res.status(200).json({
    success: true,
    data: analytics,
  });
});
