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

if (!fs.existsSync(volunteerDir)) {
  fs.mkdirSync(volunteerDir, { recursive: true });
  console.log("Created folder:", volunteerDir);
}
// Storage for volunteer application form uploads
const volunteerPdf = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/volunteer"); // 👈 not cats
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

// ✅ POST route: submit volunteer application
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

// ✅ GET route: fetch all volunteer applications
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

// ✅ Serve application form (PDF/image)
FeederRoute.get("/application/:id/form", async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getDB(); // 👈 must await
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

FeederRoute.post("/api/application/:id/approve", async (req, res) => {
  const db = await getDB(); // 👈 make sure to await
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

    res.json({ message: "Application approved and points rewarded!" });
  } catch (err) {
    console.error("❌ Error approving application:", err);
    res.status(500).json({ error: "Failed to approve application" });
  }
});

export default FeederRoute;
