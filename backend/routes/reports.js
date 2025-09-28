import express from "express";
import { getDB } from "../database.js";

const router = express.Router();

// Create notification helper function
const createNotification = async (userId, message, type = "volunteer") => {
  const db = await getDB();
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
router.get("/feeding/schedule", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = getDB();
    const userId = req.session.user.user_id;

    const [rows] = await db.query(
      `SELECT v.volunteer_id,
              v.feeding_date,
              CONCAT(u.firstname, ' ', u.lastname) AS volunteer_name
       FROM volunteer v
       JOIN users u ON v.feeder_id = u.user_id
       WHERE v.feeder_id = ? AND v.status = 'Approved'
       ORDER BY v.feeding_date ASC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching feeding schedule:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/feeding/report", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { reportText, volunteerId } = req.body;
    if (!reportText || !volunteerId) {
      return res
        .status(400)
        .json({ error: "Missing reportText or volunteerId" });
    }

    const db = getDB();
    const userId = req.session.user.user_id;

    // Insert report
    const [result] = await db.query(
      `INSERT INTO FeedingReports (volunteer_id, feeders_report, feeding_date, created_at)
       SELECT ?, ?, v.feeding_date, NOW()
       FROM volunteer v
       WHERE v.volunteer_id = ?`,
      [volunteerId, reportText, volunteerId]
    );

    // Create notification
    const applicationMessage = `✅ Your feeding report ID: ${result.insertId} has been submitted successfully.`;
    await createNotification(userId, applicationMessage, "volunteer submitted");

    res.json({
      message: "Report submitted successfully",
      reportId: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error submitting report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// in reports.js
router.get("/feeding/reports", async (req, res) => {
  try {
    const db = getDB();

    const [rows] = await db.query(
      `SELECT fr.report_id,
              fr.feeders_report,
              fr.feeding_date,
              fr.created_at,
              v.volunteer_id,
              CONCAT(u.firstname, ' ', u.lastname) AS volunteer_name
       FROM FeedingReports fr
       JOIN volunteer v ON fr.volunteer_id = v.volunteer_id
       JOIN users u ON v.feeder_id = u.user_id
       ORDER BY fr.created_at DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching feeding reports:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
