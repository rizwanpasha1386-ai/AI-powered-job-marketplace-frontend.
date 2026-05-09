import { Rating } from '../models/rating.model.js';
import { WorkSession } from '../models/workSession.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Submit a rating
 * @route   POST /api/v1/ratings
 * @access  Private (Authenticated users)
 */
export const createRating = asyncHandler(async (req, res) => {
  const { workSessionId, toUserId, rating, feedback } = req.body;
  const fromUserId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400); throw new Error('Please provide a valid rating between 1 and 5');
  }

  // 1. Validate work session exists and is fully populated
  const session = await WorkSession.findById(workSessionId)
    .populate('recruiter')
    .populate('employee');

  if (!session) {
    res.status(404); throw new Error('Work session not found');
  }

  // 2. Ensure work is completed before allowing ratings
  if (session.status !== 'completed') {
    res.status(400); throw new Error('You can only leave a rating after the work session is formally completed');
  }

  // 3. Validate participants (Ensure sender is in the session)
  const isRecruiter = session.recruiter.user.toString() === fromUserId.toString();
  const isEmployee = session.employee.user.toString() === fromUserId.toString();

  if (!isRecruiter && !isEmployee) {
    res.status(403); throw new Error('You are not an authorized participant in this work session');
  }

  // 4. Validate target (Ensure they are rating the other person, not themselves or a random user)
  const expectedToUserId = isRecruiter ? session.employee.user.toString() : session.recruiter.user.toString();

  if (toUserId !== expectedToUserId) {
    res.status(400); throw new Error('Invalid target user for this rating');
  }

  // 5. Prevent duplicate ratings via DB query fallback (Model index also protects this)
  const existingRating = await Rating.findOne({ fromUser: fromUserId, toUser: toUserId, workSession: workSessionId });
  if (existingRating) {
    res.status(400); throw new Error('You have already rated this user for this work session');
  }

  // 6. Create rating
  const newRating = await Rating.create({
    fromUser: fromUserId,
    toUser: toUserId,
    workSession: workSessionId,
    rating: Number(rating),
    feedback,
  });

  // Calculate new average statistics natively
  const stats = await Rating.getAverageRating(toUserId);

  res.status(201).json({
    success: true,
    message: 'Rating submitted successfully',
    data: newRating,
    stats,
  });
});

/**
 * @desc    Get reviews and stats for a specific user
 * @route   GET /api/v1/ratings/user/:userId
 * @access  Private (Authenticated users)
 */
export const getUserRatings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Fetch individual rating documents
  const ratings = await Rating.find({ toUser: userId })
    .populate('fromUser', 'name role')
    .populate({
      path: 'workSession',
      select: 'job completedAt',
      populate: { path: 'job', select: 'title' }
    })
    .sort({ createdAt: -1 });

  // Fetch aggregated statistics using the model utility
  const stats = await Rating.getAverageRating(userId);

  res.status(200).json({
    success: true,
    stats,
    count: ratings.length,
    data: ratings,
  });
});
