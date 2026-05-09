import { Notification } from '../models/notification.model.js';

/**
 * Service to create a notification.
 * Wrapped in a try-catch to ensure that if notification fails,
 * it doesn't break the main business logic flow.
 */
export const createNotification = async ({ recipient, title, message, type }) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Returning null instead of throwing to avoid breaking the calling function
    return null;
  }
};
