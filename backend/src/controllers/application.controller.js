import { Application } from '../models/application.model.js';
import { Job } from '../models/job.model.js';
import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { RecruiterProfile } from '../models/recruiterProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createNotification } from '../services/notification.service.js';

/**
 * @desc    Apply to a specific job
 * @route   POST /api/v1/applications/apply/:jobId
 * @access  Private (Employee only)
 */
export const applyToJob = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;

  // 1. Get employee profile
  const employeeProfile = await EmployeeProfile.findOne({ user: req.user._id });
  if (!employeeProfile) {
    res.status(404);
    throw new Error('Employee profile not found. Please create a profile to apply for jobs.');
  }

  // 2. Check if job exists and is open (Populate recruiter to get recipient User ID)
  const job = await Job.findById(jobId).populate('recruiter');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.status !== 'open') {
    res.status(400);
    throw new Error('This job is no longer accepting applications');
  }

  // 3. Check for existing application
  const existingApplication = await Application.findOne({
    employee: employeeProfile._id,
    job: jobId,
  });

  if (existingApplication) {
    res.status(400);
    throw new Error('You have already applied for this job');
  }

  // 4. Create application
  const application = await Application.create({
    employee: employeeProfile._id,
    job: jobId,
  });

  // 5. Send notification to Recruiter
  await createNotification({
    recipient: job.recruiter.user,
    title: 'New Application Received',
    message: `A candidate has applied to your job posting: ${job.title}`,
    type: 'application_received',
  });

  res.status(201).json({
    success: true,
    message: 'Successfully applied to the job',
    data: application,
  });
});

/**
 * @desc    Get all applied jobs for the current employee
 * @route   GET /api/v1/applications/me
 * @access  Private (Employee only)
 */
export const getEmployeeApplications = asyncHandler(async (req, res) => {
  const employeeProfile = await EmployeeProfile.findOne({ user: req.user._id });
  if (!employeeProfile) {
    res.status(404);
    throw new Error('Employee profile not found.');
  }

  const applications = await Application.find({ employee: employeeProfile._id })
    .populate({
      path: 'job',
      select: 'title companyLocation status',
      populate: {
        path: 'recruiter',
        select: 'companyName verifiedStatus',
      },
    })
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

/**
 * @desc    Get all applicants for a specific job (Recruiter view)
 * @route   GET /api/v1/applications/job/:jobId
 * @access  Private (Recruiter only)
 */
export const getJobApplicants = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;

  // 1. Get recruiter profile
  const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!recruiterProfile) {
    res.status(404);
    throw new Error('Recruiter profile not found.');
  }

  // 2. Validate job ownership
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  if (job.recruiter.toString() !== recruiterProfile._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view applicants for this job');
  }

  // 3. Fetch applications
  const applications = await Application.find({ job: jobId })
    .populate({
      path: 'employee',
      select: 'skills experience availabilityStatus',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    })
    .sort({ appliedAt: -1 });

  res.status(200).json({
    success: true,
    count: applications.length,
    data: applications,
  });
});

/**
 * @desc    Update application status
 * @route   PUT /api/v1/applications/:id/status
 * @access  Private (Recruiter only)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  if (!['pending', 'shortlisted', 'rejected', 'accepted'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const application = await Application.findById(applicationId).populate('job').populate('employee');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  // Verify ownership
  const recruiterProfile = await RecruiterProfile.findOne({ user: req.user._id });
  if (application.job.recruiter.toString() !== recruiterProfile._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this application');
  }

  application.status = status;
  await application.save();

  // Send notification to the Employee if shortlisted or accepted
  if (status === 'shortlisted' || status === 'accepted') {
    await createNotification({
      recipient: application.employee.user,
      title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your application for ${application.job.title} has been ${status}.`,
      type: `application_${status}`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Application status updated',
    data: application,
  });
});
