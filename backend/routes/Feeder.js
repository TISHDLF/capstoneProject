import express, { Router } from "express";
import { getDB } from "../database.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mime from "mime-types";

const FeederRoute = Router();
FeederRoute.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const volunteerDir = path.join(process.cwd(), "FileUploads/volunteer");

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

if (!fs.existsSync(volunteerDir)) {
  fs.mkdirSync(volunteerDir, { recursive: true });
  console.log("Created folder:", volunteerDir);
}

// Storage for volunteer application form uploads
const volunteerPdf = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/volunteer");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadVolunteer = multer({
  storage: volunteerPdf,
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      callback(null, true);
    } else {
      callback(
        new Error("Only images or PDF files are allowed for application forms"),
        false
      );
    }
  },
});

// POST route: submit volunteer application WITH NOTIFICATIONS
FeederRoute.post(
  "/apply",
  uploadVolunteer.single("application_form"),
  async (req, res) => {
    try {
      const db = await getDB();
      const { user_id } = req.body;

      if (!user_id || !req.file) {
        return res
          .status(400)
          .json({ error: "User ID and application form are required" });
      }

      const filePath = req.file.filename;

      const [result] = await db.query(
        `INSERT INTO volunteer_application (user_id, application_form) VALUES (?, ?)`,
        [user_id, filePath]
      );

      // 🔔 CREATE NOTIFICATION FOR USER
      const applicationMessage = `Thank you for your volunteer application! Your application (ID: ${result.insertId}) has been submitted successfully and is currently under review. We'll notify you once a decision has been made.`;
      await createNotification(
        user_id,
        applicationMessage,
        "volunteer_submitted"
      );

      res.json({
        message: "Application submitted successfully",
        application_id: result.insertId,
      });
    } catch (err) {
      console.error("Error inserting application:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET route: fetch all volunteer applications
FeederRoute.get("/applications", async (req, res) => {
  try {
    const db = await getDB();
    const [rows] = await db.query(`
      SELECT va.application_id, 
             va.user_id, 
             va.application_form, 
             va.application_date, 
             va.status,
             CONCAT(u.firstname, ' ', u.lastname) AS user_name,
             u.email, 
             u.contactnumber
      FROM volunteer_application va
      JOIN users u ON va.user_id = u.user_id
      ORDER BY va.application_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve application form (PDF/image)
FeederRoute.get("/application/:id/form", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDB();
    const [rows] = await db.query(
      "SELECT application_form FROM volunteer_application WHERE application_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    const filename = rows[0].application_form;
    if (!filename) {
      return res.status(404).json({ message: "No application form uploaded" });
    }

    const filePath = path.join(
      process.cwd(),
      "FileUploads/volunteer",
      filename
    );

    if (!fs.existsSync(filePath)) {
      console.error("❌ File not found:", filePath);
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.sendFile(filePath);
  } catch (err) {
    console.error("❌ Error fetching form:", err);
    res.status(500).json({ message: "Server error while fetching form" });
  }
});

// Check application status by user_id
FeederRoute.get("/status/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const db = await getDB();

    const [apps] = await db.query(
      "SELECT application_id, status FROM volunteer_application WHERE user_id = ? ORDER BY application_date DESC LIMIT 1",
      [user_id]
    );

    if (apps.length === 0) {
      return res.json({ status: "none" });
    }

    const application = apps[0];

    if (application.status === "Accepted") {
      return res.json({
        status: "approved",
        application_id: application.application_id,
      });
    }

    return res.json({
      status: "pending",
      application_id: application.application_id,
    });
  } catch (err) {
    console.error("❌ Error fetching application status:", err);
    res.status(500).json({ error: "Failed to fetch status" });
  }
});

// DELETE a volunteer (feeder)
FeederRoute.delete("/delete/:feeder_id", async (req, res) => {
  const db = await getDB();
  const { feeder_id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM volunteer WHERE feeder_id = ?",
      [feeder_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Feeder not found" });
    }

    res.json({ message: "Feeder removed successfully" });
  } catch (err) {
    console.error("Error deleting feeder:", err);
    res.status(500).json({ error: "Failed to delete feeder" });
  }
});

// APPROVE VOLUNTEER APPLICATION WITH NOTIFICATIONS
FeederRoute.post("/api/application/:id/approve", async (req, res) => {
  const db = await getDB();
  try {
    const feederId = req.params.id;
    const { feeding_date } = req.body;

    // Step 1: Fetch applicant
    const [rows] = await db.query(
      `SELECT va.user_id, va.application_date, u.firstname, u.lastname
       FROM volunteer_application va
       JOIN users u ON va.user_id = u.user_id
       WHERE va.application_id = ?`,
      [feederId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "application not found" });
    }

    const userId = rows[0].user_id;
    const fullName = `${rows[0].firstname} ${rows[0].lastname}`;
    const application_date = rows[0].application_date;

    // Step 2: Insert into volunteer table
    await db.query(
      `INSERT INTO volunteer (feeder_id, name, feeding_date, application_date, status)
       VALUES (?, ?, ?, ?, 'Approved')`,
      [userId, fullName, feeding_date || new Date(), application_date]
    );

    // Step 3: Update volunteer_application status → Accepted
    await db.query(
      "UPDATE volunteer_application SET status = 'Accepted' WHERE application_id = ?",
      [feederId]
    );

    // Step 4: Reward points
    const rewardPoints = 40;
    const [meter] = await db.query(
      "SELECT * FROM whiskermeter WHERE user_id = ?",
      [userId]
    );

    if (meter.length === 0) {
      await db.query(
        "INSERT INTO whiskermeter (user_id, points) VALUES (?, ?)",
        [userId, rewardPoints]
      );
    } else {
      await db.query(
        "UPDATE whiskermeter SET points = points + ? WHERE user_id = ?",
        [rewardPoints, userId]
      );
    }

    // 🔔 CREATE APPROVAL NOTIFICATION
    const approvalMessage = `🎉 Congratulations! Your volunteer application (ID: ${feederId}) has been approved! You've earned ${rewardPoints} whisker points and are now part of our amazing volunteer team. Thank you for wanting to help our cats!`;
    await createNotification(userId, approvalMessage, "volunteer_approved");

    res.json({ message: "Application approved and points rewarded!" });
  } catch (err) {
    console.error("❌ Error approving application:", err);
    res.status(500).json({ error: "Failed to approve application" });
  }
});

// REJECT VOLUNTEER APPLICATION WITH NOTIFICATIONS
FeederRoute.post("/api/application/:id/reject", async (req, res) => {
  const db = await getDB();
  try {
    const feederId = req.params.id;
    const { reason } = req.body;

    // Step 1: Fetch applicant info
    const [rows] = await db.query(
      `SELECT va.user_id, u.firstname, u.lastname
       FROM volunteer_application va
       JOIN users u ON va.user_id = u.user_id
       WHERE va.application_id = ?`,
      [feederId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const userId = rows[0].user_id;
    const fullName = `${rows[0].firstname} ${rows[0].lastname}`;

    // Step 2: Update volunteer_application status → Rejected
    await db.query(
      "UPDATE volunteer_application SET status = 'Rejected' WHERE application_id = ?",
      [feederId]
    );

    // 🔔 CREATE REJECTION NOTIFICATION
    const rejectionMessage = `We appreciate your interest in volunteering with us! Unfortunately, your volunteer application (ID: ${feederId}) could not be approved at this time. ${
      reason
        ? `Reason: ${reason}`
        : "Please feel free to apply again in the future or contact us for more information."
    } Thank you for wanting to help our cats!`;
    await createNotification(userId, rejectionMessage, "volunteer_rejected");

    res.json({ message: "Application rejected and user notified." });
  } catch (err) {
    console.error("❌ Error rejecting application:", err);
    res.status(500).json({ error: "Failed to reject application" });
  }
});

export default FeederRoute;
