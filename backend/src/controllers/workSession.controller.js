import { WorkSession } from '../models/workSession.model.js';
import { Message } from '../models/message.model.js';
import { RecruiterProfile } from '../models/recruiterProfile.model.js';
import { EmployeeProfile } from '../models/employeeProfile.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Helper to validate user has access to a specific work session
 */
const validateSessionAccess = async (sessionId, userId, role) => {
  const session = await WorkSession.findById(sessionId)
    .populate('job', 'title status')
    .populate({ path: 'recruiter', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });

  if (!session) {
    throw new Error('Work session not found');
  }

  if (role === 'employee') {
    const profile = await EmployeeProfile.findOne({ user: userId });
    if (!profile || session.employee._id.toString() !== profile._id.toString()) {
      throw new Error('Unauthorized: You are not part of this work session');
    }
  } else if (role === 'recruiter') {
    const profile = await RecruiterProfile.findOne({ user: userId });
    if (!profile || session.recruiter._id.toString() !== profile._id.toString()) {
      throw new Error('Unauthorized: You are not part of this work session');
    }
  } else {
    throw new Error('Unauthorized role');
  }

  return session;
};

/**
 * @desc    Get all work sessions for logged-in user
 * @route   GET /api/v1/work-sessions
 * @access  Private (Employee/Recruiter)
 */
export const getMyWorkSessions = asyncHandler(async (req, res) => {
  const { role, _id } = req.user;
  let query = {};
  
  if (role === 'employee') {
    const profile = await EmployeeProfile.findOne({ user: _id });
    if (!profile) throw new Error('Employee profile not found');
    query.employee = profile._id;
  } else if (role === 'recruiter') {
    const profile = await RecruiterProfile.findOne({ user: _id });
    if (!profile) throw new Error('Recruiter profile not found');
    query.recruiter = profile._id;
  }

  const sessions = await WorkSession.find(query)
    .populate('job', 'title status')
    .populate({ path: 'employee', populate: { path: 'user', select: 'name' } })
    .populate({ path: 'recruiter', populate: { path: 'user', select: 'name companyName' } })
    .sort({ updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: sessions.length,
    data: sessions,
  });
});

/**
 * @desc    Get single work session details
 * @route   GET /api/v1/work-sessions/:id
 * @access  Private (Participants only)
 */
export const getWorkSessionDetails = asyncHandler(async (req, res) => {
  const session = await validateSessionAccess(req.params.id, req.user._id, req.user.role);
  
  res.status(200).json({
    success: true,
    data: session,
  });
});

/**
 * @desc    Update work session status
 * @route   PUT /api/v1/work-sessions/:id/status
 * @access  Private (Participants only)
 */
export const updateWorkSessionStatus = asyncHandler(async (req, res) => {
  if (req.user.role !== 'recruiter') {
    res.status(403);
    throw new Error('Unauthorized: Only recruiters can update work session status');
  }

  const { status } = req.body;
  if (!['completed', 'cancelled'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Only completed or cancelled are allowed.');
  }

  const session = await validateSessionAccess(req.params.id, req.user._id, req.user.role);
  
  if (session.status !== 'active') {
    res.status(400);
    throw new Error(`Cannot change status. Session is already ${session.status}`);
  }

  session.status = status;
  if (status === 'completed') {
    session.completedAt = Date.now();
  }
  
  await session.save();

  res.status(200).json({
    success: true,
    message: `Work session marked as ${status}`,
    data: session,
  });
});

/**
 * @desc    Send a message in a work session
 * @route   POST /api/v1/work-sessions/:id/messages
 * @access  Private (Participants only)
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === '') {
    res.status(400);
    throw new Error('Message content is required');
  }

  const session = await validateSessionAccess(req.params.id, req.user._id, req.user.role);

  const newMessage = await Message.create({
    workSession: session._id,
    sender: req.user._id,
    message: message.trim(),
  });

  // Populate sender info for the frontend response
  await newMessage.populate('sender', 'name role');

  res.status(201).json({
    success: true,
    data: newMessage,
  });
});

/**
 * @desc    Get all messages for a work session
 * @route   GET /api/v1/work-sessions/:id/messages
 * @access  Private (Participants only)
 */
export const getMessages = asyncHandler(async (req, res) => {
  const session = await validateSessionAccess(req.params.id, req.user._id, req.user.role);

  const messages = await Message.find({ workSession: session._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 }); // Oldest first for chat timeline

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages,
  });
});
