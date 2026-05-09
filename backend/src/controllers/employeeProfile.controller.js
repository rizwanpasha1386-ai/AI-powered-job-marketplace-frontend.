import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Create Employee Profile
 * @route   POST /api/v1/employee-profiles
 * @access  Private (Employee only)
 */
export const createProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Check if profile already exists
  const existingProfile = await EmployeeProfile.findOne({ user: userId });
  if (existingProfile) {
    res.status(400);
    throw new Error('Profile already exists. Use update endpoint instead.');
  }

  const {
    skills,
    education,
    experience,
    preferredSalary,
    preferredJobType,
    bio,
    availabilityStatus,
    longitude,
    latitude,
  } = req.body;

  // Format location as GeoJSON if coordinates are provided
  let location;
  if (longitude !== undefined && latitude !== undefined) {
    location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  const profile = await EmployeeProfile.create({
    user: userId,
    skills,
    education,
    experience,
    preferredSalary,
    preferredJobType,
    bio,
    availabilityStatus,
    location,
  });

  res.status(201).json({
    success: true,
    message: 'Profile created successfully',
    data: profile,
  });
});

/**
 * @desc    Get Own Employee Profile
 * @route   GET /api/v1/employee-profiles/me
 * @access  Private (Employee only)
 */
export const getOwnProfile = asyncHandler(async (req, res) => {
  const profile = await EmployeeProfile.findOne({ user: req.user._id }).populate(
    'user',
    'name email phone'
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
 * @desc    Update Own Employee Profile
 * @route   PUT /api/v1/employee-profiles/me
 * @access  Private (Employee only)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    skills,
    education,
    experience,
    preferredSalary,
    preferredJobType,
    bio,
    availabilityStatus,
    longitude,
    latitude,
  } = req.body;

  const updateFields = {};
  
  if (skills) updateFields.skills = skills;
  if (education) updateFields.education = education;
  if (experience) updateFields.experience = experience;
  if (preferredSalary) updateFields.preferredSalary = preferredSalary;
  if (preferredJobType) updateFields.preferredJobType = preferredJobType;
  if (bio) updateFields.bio = bio;
  if (availabilityStatus) updateFields.availabilityStatus = availabilityStatus;

  // Update location if both coordinates are provided
  if (longitude !== undefined && latitude !== undefined) {
    updateFields.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  const updatedProfile = await EmployeeProfile.findOneAndUpdate(
    { user: userId },
    { $set: updateFields },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone');

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
