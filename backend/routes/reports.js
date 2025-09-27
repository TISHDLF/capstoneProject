import express from "express";
import { getDB } from "../database.js";

const router = express.Router();

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
    const db = getDB();

    await db.query(
      `INSERT INTO FeedingReports (volunteer_id, feeders_report, feeding_date, created_at)
       SELECT ?, ?, v.feeding_date, NOW()
       FROM volunteer v
       WHERE v.volunteer_id = ?`,
      [volunteerId, reportText, volunteerId]
    );

    res.json({ message: "Report submitted successfully" });
  } catch (err) {
    console.error("❌ Error submitting report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
