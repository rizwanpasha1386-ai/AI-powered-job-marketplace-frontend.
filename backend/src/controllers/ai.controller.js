import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { generateTrustSummary } from '../services/ai/trustSummary.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Generate AI Trust Summary for an employee
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

  // Mock fetching aggregated performance metrics from other collections (e.g., jobs, reviews)
  // For the MVP, we generate realistic mock data based on the prompt's request
  const employeeData = {
    skills: profile.skills,
    experience: profile.experience,
    education: profile.education,
    availabilityStatus: profile.availabilityStatus,
    // Mock metrics
    completedJobs: Math.floor(Math.random() * 15), 
    recruiterRatings: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1), // 3.5 to 5.0
    punctualityScore: Math.floor(Math.random() * (100 - 80) + 80), // 80 to 100
  };

  // Generate the summary via the scalable service
  const aiSummary = await generateTrustSummary(employeeData);

  // Save the generated summary to the profile
  profile.aiTrustSummary = aiSummary;
  await profile.save();

  res.status(200).json({
    success: true,
    message: 'AI Trust Summary generated successfully',
    data: profile.aiTrustSummary,
  });
});
