import { Notification } from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc    Get all notifications for logged-in user
 * @route   GET /api/v1/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/v1/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: req.user._id },
    { readStatus: true },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found or unauthorized');
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});
