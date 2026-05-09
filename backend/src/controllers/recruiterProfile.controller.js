import { RecruiterProfile } from '../models/recruiterProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Create Recruiter Profile
 * @route   POST /api/v1/recruiter-profiles
 * @access  Private (Recruiter only)
 */
export const createProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if profile already exists
  const existingProfile = await RecruiterProfile.findOne({ user: userId });
  if (existingProfile) {
    res.status(400);
    throw new Error('Profile already exists. Use update endpoint instead.');
  }

  const { companyName, companyDescription, recruiterName, companyLocation } = req.body;

  const profile = await RecruiterProfile.create({
    user: userId,
    companyName,
    companyDescription,
    recruiterName,
    companyLocation,
    // verifiedStatus is intentionally excluded so they cannot self-verify
  });

  res.status(201).json({
    success: true,
    message: 'Profile created successfully',
    data: profile,
  });
});

/**
 * @desc    Get Own Recruiter Profile
 * @route   GET /api/v1/recruiter-profiles/me
 * @access  Private (Recruiter only)
 */
export const getOwnProfile = asyncHandler(async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id }).populate(
    'user',
    'email phone role'
  );

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found');
  }

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * @desc    Update Own Recruiter Profile
 * @route   PUT /api/v1/recruiter-profiles/me
 * @access  Private (Recruiter only)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { companyName, companyDescription, recruiterName, companyLocation } = req.body;

  const updateFields = {};
  
  if (companyName) updateFields.companyName = companyName;
  if (companyDescription) updateFields.companyDescription = companyDescription;
  if (recruiterName) updateFields.recruiterName = recruiterName;
  if (companyLocation) updateFields.companyLocation = companyLocation;

  const updatedProfile = await RecruiterProfile.findOneAndUpdate(
    { user: userId },
    { $set: updateFields },
    { new: true, runValidators: true }
  ).populate('user', 'email phone role');

  if (!updatedProfile) {
    res.status(404);
    throw new Error('Profile not found. Please create one first.');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile,
  });
});
