const db = require("../config/db");

/**
 * Centralized Notification Dispatcher
 * Inserts a persistent notification into MySQL / TiDB
 */
async function createNotification({
  userId,
  senderId = null,
  type = "message",
  title,
  message,
  link = null,
}) {
  if (!userId || !title || !message) return null;

  try {
    const [result] = await db.query(
      `INSERT INTO notifications (user_id, sender_id, type, title, message, link, is_read)
       VALUES (?, ?, ?, ?, ?, ?, FALSE)`,
      [userId, senderId, type, title, message, link]
    );
    return result.insertId;
  } catch (err) {
    console.error("Failed to insert notification:", err.message);
    return null;
  }
}

module.exports = { createNotification };
