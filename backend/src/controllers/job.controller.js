import { Job } from '../models/job.model.js';
import { RecruiterProfile } from '../models/recruiterProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper function to get the current user's RecruiterProfile
 */
const getRecruiterProfile = async (userId) => {
  const profile = await RecruiterProfile.findOne({ user: userId });
  if (!profile) {
    throw new Error('Recruiter profile not found. Please create a profile first.');
  }
  return profile;
};

/**
 * @desc    Create a new Job
 * @route   POST /api/v1/jobs
 * @access  Private (Recruiter only)
 */
export const createJob = asyncHandler(async (req, res) => {
  const profile = await getRecruiterProfile(req.user._id);

  const {
    title,
    description,
    requiredSkills,
    salary,
    jobType,
    experienceRequired,
    longitude,
    latitude,
    address,
  } = req.body;

  let location;
  if (longitude !== undefined && latitude !== undefined) {
    location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      address,
    };
  }

  const job = await Job.create({
    recruiter: profile._id,
    title,
    description,
    requiredSkills,
    salary,
    jobType,
    experienceRequired,
    location,
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

/**
 * @desc    Update a Job
 * @route   PUT /api/v1/jobs/:id
 * @access  Private (Recruiter only)
 */
export const updateJob = asyncHandler(async (req, res) => {
  const profile = await getRecruiterProfile(req.user._id);
  const jobId = req.params.id;

  let job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Ensure the logged-in recruiter owns this job
  if (job.recruiter.toString() !== profile._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this job');
  }

  const {
    title,
    description,
    requiredSkills,
    salary,
    jobType,
    experienceRequired,
    status,
    longitude,
    latitude,
    address,
  } = req.body;

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (requiredSkills) updateFields.requiredSkills = requiredSkills;
  if (salary) updateFields.salary = salary;
  if (jobType) updateFields.jobType = jobType;
  if (experienceRequired) updateFields.experienceRequired = experienceRequired;
  if (status) updateFields.status = status;

  if (longitude !== undefined && latitude !== undefined) {
    updateFields.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      address,
    };
  }

  job = await Job.findByIdAndUpdate(jobId, { $set: updateFields }, { new: true, runValidators: true });

  res.status(200).json({
    success: true,
    message: 'Job updated successfully',
    data: job,
  });
});

/**
 * @desc    Delete a Job
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Recruiter only)
 */
export const deleteJob = asyncHandler(async (req, res) => {
  const profile = await getRecruiterProfile(req.user._id);
  const jobId = req.params.id;

  const job = await Job.findById(jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Ensure the logged-in recruiter owns this job
  if (job.recruiter.toString() !== profile._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this job');
  }

  await Job.findByIdAndDelete(jobId);

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully',
  });
});

/**
 * @desc    Get all jobs for logged-in recruiter
 * @route   GET /api/v1/jobs/me
 * @access  Private (Recruiter only)
 */
export const getRecruiterJobs = asyncHandler(async (req, res) => {
  const profile = await getRecruiterProfile(req.user._id);

  const jobs = await Job.find({ recruiter: profile._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

/**
 * @desc    Get all jobs (Open for employees & recruiters)
 * @route   GET /api/v1/jobs
 * @access  Private (Authenticated users)
 */
export const getAllJobs = asyncHandler(async (req, res) => {
  // Only fetch open jobs
  const jobs = await Job.find({ status: 'open' })
    .populate({
      path: 'recruiter',
      select: 'companyName companyLocation verifiedStatus',
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: jobs.length,
    data: jobs,
  });
});

/**
 * @desc    Get single job details
 * @route   GET /api/v1/jobs/:id
 * @access  Private (Authenticated users)
 */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate({
    path: 'recruiter',
    select: 'companyName companyDescription recruiterName companyLocation verifiedStatus',
  });

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});
