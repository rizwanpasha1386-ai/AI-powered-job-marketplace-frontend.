import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Search nearby employees with geospatial queries and filters
 * @route   GET /api/v1/search/employees
 * @access  Private (Recruiter only)
 */
export const searchEmployees = asyncHandler(async (req, res) => {
  const { lng, lat, radius = 50, skills, availability } = req.query;

  // Ensure coordinates are provided
  if (!lng || !lat) {
    res.status(400);
    throw new Error('Please provide longitude (lng) and latitude (lat) for the search.');
  }

  const longitude = parseFloat(lng);
  const latitude = parseFloat(lat);
  // Convert radius from kilometers to meters (MongoDB uses meters for 2dsphere $geoNear)
  const maxDistanceInMeters = parseInt(radius, 10) * 1000;

  // Build the aggregation pipeline
  const pipeline = [];

  // 1. $geoNear MUST be the first stage in an aggregation pipeline
  pipeline.push({
    $geoNear: {
      near: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      distanceField: 'calculatedDistance', // This field will be injected into the result, representing distance in meters
      maxDistance: maxDistanceInMeters,
      spherical: true,
      // Optional: you can add a distance multiplier to return distance in km
      distanceMultiplier: 0.001 
    },
  });

  // 2. Build additional matching criteria
  const matchFilters = {};

  if (skills) {
    // Expecting comma-separated skills like "React,Node.js"
    const skillList = skills.split(',').map((s) => new RegExp(s.trim(), 'i')); // Case-insensitive matching
    matchFilters.skills = { $in: skillList }; // Or $all for strict inclusion
  }

  if (availability) {
    // Expecting comma-separated statuses like "Available,Actively Looking"
    const availabilityList = availability.split(',').map((a) => a.trim());
    matchFilters.availabilityStatus = { $in: availabilityList };
  }

  // 3. Apply match filters if any exist
  if (Object.keys(matchFilters).length > 0) {
    pipeline.push({ $match: matchFilters });
  }

  // 4. Lookup the User details to populate basic info (name, email)
  pipeline.push({
    $lookup: {
      from: 'users', // Collection name for User model
      localField: 'user',
      foreignField: '_id',
      as: 'userDetails',
    },
  });

  // 5. Unwind the user array
  pipeline.push({
    $unwind: '$userDetails',
  });

  // 6. Project to hide sensitive fields like passwords
  pipeline.push({
    $project: {
      'userDetails.password': 0,
      '__v': 0,
    },
  });

  // Execute the aggregation
  const employees = await EmployeeProfile.aggregate(pipeline);

  res.status(200).json({
    success: true,
    count: employees.length,
    data: employees,
  });
});
