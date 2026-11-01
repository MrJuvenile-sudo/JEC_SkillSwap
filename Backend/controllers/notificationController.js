const db = require("../config/db");
const { createNotification } = require("../utils/notificationService");

// 1. Get all notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const [notifications] = await db.query(
      `SELECT n.id, n.user_id, n.sender_id, n.type, n.title, n.message, n.link, n.is_read, n.created_at,
              u.name AS sender_name, u.profile_picture AS sender_picture
       FROM notifications n
       LEFT JOIN users u ON n.sender_id = u.id
       WHERE n.user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [userId]
    );

    const [unreadResult] = await db.query(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    res.json({
      success: true,
      notifications: notifications || [],
      unreadCount: unreadResult[0]?.count || 0,
    });
  } catch (error) {
    console.error("GetNotifications Error:", error);
    res.status(500).json({ success: false, message: "Error fetching notifications" });
  }
};

// 2. Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("MarkAsRead Error:", error);
    res.status(500).json({ success: false, message: "Error updating notification" });
  }
};

// 3. Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("MarkAllAsRead Error:", error);
    res.status(500).json({ success: false, message: "Error updating notifications" });
  }
};

// 4. Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await db.query(`DELETE FROM notifications WHERE id = ? AND user_id = ?`, [id, userId]);

    res.json({ success: true, message: "Notification removed" });
  } catch (error) {
    console.error("DeleteNotification Error:", error);
    res.status(500).json({ success: false, message: "Error deleting notification" });
  }
};

// 5. Send Test Notification (Convenience for testing sound & vibration)
exports.sendTestNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const senderName = req.user.name || "Aarav Sharma";

    const notifId = await createNotification({
      userId,
      senderId: userId,
      type: "message",
      title: `Message from ${senderName}`,
      message: "Hey! Ready for our 1-on-1 skill swap session? Testing sound and notification chime! 🚀",
      link: "/exchanges",
    });

    res.status(201).json({
      success: true,
      message: "Test notification dispatched with sound & alert!",
      notificationId: notifId,
    });
  } catch (error) {
    console.error("SendTestNotification Error:", error);
    res.status(500).json({ success: false, message: "Error generating test notification" });
  }
};
