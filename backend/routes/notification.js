// Add this to your User.js routes file or create a separate Notification.js route file

import express from "express";
import { Router } from "express";
import { getDB } from "../database.js";

const router = Router();
router.use(express.json());

// Create a notification
const createNotification = async (userId, message, type = "donation") => {
  const db = getDB();
  try {
    await db.query(
      `INSERT INTO notifications (user_id, message, type, created_at) 
       VALUES (?, ?, ?, NOW())`,
      [userId, message, type]
    );
    console.log(`✅ Notification created for user ${userId}: ${message}`);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
  }
};

// Get user notifications
router.get("/notifications/:userId", async (req, res) => {
  const db = getDB();
  try {
    const { userId } = req.params;

    const [notifications] = await db.query(
      `SELECT notification_id, message, type, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );

    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notification as read
router.patch("/notifications/mark_read/:id", async (req, res) => {
  const db = getDB();
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE notifications SET is_read = 1 WHERE notification_id = ?",
      [id]
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

// Delete notification
router.delete("/notifications/delete/:id", async (req, res) => {
  const db = getDB();
  try {
    const { id } = req.params;

    await db.query("DELETE FROM notifications WHERE notification_id = ?", [id]);

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

// Mark all notifications as read for a user
router.patch("/notifications/mark_all_read/:userId", async (req, res) => {
  const db = getDB();
  try {
    const { userId } = req.params;

    await db.query(
      "UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0",
      [userId]
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
});

export { createNotification };
export default router;
