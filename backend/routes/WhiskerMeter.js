import express from "express";
import { Router } from "express";
import { getDB } from "../database.js";

const WhiskerMeterRoute = Router();
WhiskerMeterRoute.use(express.json());

function getBadgeFromPoints(points) {
  if (points >= 160) return "The Catnip Captain";
  if (points >= 120) return "Meowtain Mover";
  if (points >= 80) return "Furmidable Friend";
  if (points >= 40) return "Snuggle"; // ✅ check your DB enum!
  return "Toe bean trainee";
}

const createNotification = async (userId, message, type = "whiskermeter") => {
  const db = getDB();
  try {
    await db.query(
      `INSERT INTO notifications (user_id, message, type, created_at, is_read) 
       VALUES (?, ?, ?, NOW(), 0)`,
      [userId, message, type]
    );
    console.log(`✅ Notification created for user ${userId}: ${message}`);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
  }
};

// ➕ Add points
WhiskerMeterRoute.post("/api/whiskermeter/:userId/add", async (req, res) => {
  const db = getDB();
  const { amount } = req.body;
  const { userId } = req.params;

  try {
    // Update whiskermeter
    await db.query(
      "UPDATE whiskermeter SET points = points + ?, last_updated = NOW() WHERE user_id = ?",
      [amount, userId]
    );

    // Fetch updated points
    const [[row]] = await db.query(
      "SELECT points FROM whiskermeter WHERE user_id = ?",
      [userId]
    );

    const points = row?.points || 0;
    const badge = getBadgeFromPoints(points);

    // Update user badge
    await db.query("UPDATE users SET badge = ? WHERE user_id = ?", [
      badge,
      userId,
    ]);

    // 🔔 Notify
    const applicationMessage = `✅ ${amount} points added! Your new total is ${points}.`;
    await createNotification(userId, applicationMessage, "points_added");

    res.json({ points, badge });
  } catch (err) {
    console.error("Error updating whiskermeter:", err.message);
    res.status(500).json({ error: "Failed to update whiskermeter" });
  }
});

WhiskerMeterRoute.get("/api/whiskermeter/:userId", async (req, res) => {
  const db = getDB();
  const { userId } = req.params;

  try {
    // Get points
    const [[row]] = await db.query(
      "SELECT points FROM whiskermeter WHERE user_id = ?",
      [userId]
    );

    const points = row?.points || 0;
    const badge = getBadgeFromPoints(points);

    // Get current badge stored in users table
    const [[userRow]] = await db.query(
      "SELECT badge FROM users WHERE user_id = ?",
      [userId]
    );
    const currentBadge = userRow?.badge || null;

    // Update only if badge actually changed
    if (currentBadge !== badge) {
      await db.query("UPDATE users SET badge = ? WHERE user_id = ?", [
        badge,
        userId,
      ]);

      const applicationMessage = `🎉 Congrats! Your badge has been updated to ${badge}!`;
      await createNotification(userId, applicationMessage, "badge_update");
    }

    res.json({ points, badge });
  } catch (err) {
    console.error("Error fetching whiskermeter:", err.message);
    res.status(500).json({ error: "Failed to fetch whiskermeter" });
  }
});

export default WhiskerMeterRoute;
