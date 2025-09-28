import express from "express";
import { Router } from "express";
import { getDB } from "../database.js";

import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HVAdoptionRoute = Router();
HVAdoptionRoute.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Create notification helper function
const createNotification = async (userId, message, type = "adoption") => {
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

// Notify all regular users when a new cat becomes available
const notifyNewCatAvailable = async (catName, catId) => {
  const db = getDB();
  try {
    // Get all regular users
    const [users] = await db.query(
      `SELECT user_id FROM users WHERE role = 'regular'`
    );

    const message = `🐱 Great news! "${catName}" is now available for adoption! Visit our cat profiles to learn more about this adorable cat.`;

    for (const user of users) {
      await createNotification(user.user_id, message, "cat_available");
    }

    console.log(`✅ Notified ${users.length} users about new cat: ${catName}`);
  } catch (err) {
    console.error("❌ Failed to notify users about new cat:", err);
  }
};
// ----------------- MULTER STORAGE -----------------
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/cats");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      callback(null, true);
    } else {
      req.err = "File is invalid!";
      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});

// ----------------- APPLY ROUTE WITH NOTIFICATIONS -----------------
HVAdoptionRoute.post(
  "/apply",
  upload.array("id_image", 5),
  async (req, res) => {
    try {
      const db = getDB();

      const { adopter, adopter_id, adoptedcat_id, cat_name, contactnumber } =
        req.body;

      // Uploaded files (both PDF + image(s))
      const idImageFiles = req.files || [];
      const storedFiles = idImageFiles.map((f) => f.filename);

      // Save as JSON string (can store multiple files cleanly)
      const idImageFile =
        storedFiles.length > 0 ? JSON.stringify(storedFiles) : null;

      // Save to DB (certificate stays NULL until admin uploads later)
      const [result] = await db.query(
        `INSERT INTO adoption 
         (adopter, adopter_id, adoptedcat_id, cat_name, contactnumber, certificate, id_image, status, date_created) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
        [
          adopter,
          adopter_id || null,
          adoptedcat_id,
          cat_name,
          contactnumber,
          null, // certificate = NULL for now
          idImageFile, // JSON with both adoption PDF + ID photo
        ]
      );

      // 🔔 CREATE NOTIFICATION FOR USER
      const adoptionMessage = `Thank you for your adoption application for "${cat_name}"! Your application (ID: ${result.insertId}) is currently under review. We'll notify you once a decision has been made.`;
      await createNotification(
        adopter_id,
        adoptionMessage,
        "adoption_submitted"
      );

      res.status(201).json({
        message: "Adoption application submitted successfully",
        applicationNo: result.insertId,
      });
    } catch (err) {
      console.error("❌ Error inserting adoption:", err);
      res.status(500).json({ error: "Failed to submit adoption application" });
    }
  }
);

// ----------------- GET ALL ADOPTIONS -----------------
// ----------------- GET ALL ADOPTIONS -----------------
HVAdoptionRoute.get("/api/adoption", async (req, res) => {
  const db = getDB();
  const currentUserId = req.user?.user_id; // assuming you store user in req.user after auth

  try {
    let query = `SELECT * FROM adoption ORDER BY date_created DESC`;
    let params = [];

    if (currentUserId) {
      query = `SELECT * FROM adoption WHERE adopter_id != ? ORDER BY date_created DESC`;
      params = [currentUserId];
    }

    const [rows] = await db.query(query, params);

    const formatted = rows.map((r) => ({
      applicationNo: r.adoption_id,
      user_id: r.adopter_id,
      name: r.adopter,
      type: r.cat_name,
      date: r.date_created ? r.date_created.toISOString().split("T")[0] : null,
      status: r.status || "Pending",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching adoptions:", err);
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
});

HVAdoptionRoute.get("/api/adoption/:id", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      "SELECT * FROM adoption WHERE adoption_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const r = rows[0];
    res.json({
      applicationNo: r.adoption_id,
      user_id: r.adopter_id,
      name: r.adopter,
      catName: r.cat_name,
      date: r.date_created ? r.date_created.toISOString().split("T")[0] : null,
      status: r.status,
      certificate: r.certificate,
    });
  } catch (err) {
    console.error("❌ Error fetching adoption:", err);
    res.status(500).json({ error: "Failed to fetch adoption" });
  }
});
// ----------------- GET ADOPTION HISTORY FOR A CAT -----------------
HVAdoptionRoute.get("/api/adoptionhistory/:cat_id", async (req, res) => {
  const db = getDB();
  const { cat_id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT * FROM adoption WHERE adoptedcat_id = ? ORDER BY date_created DESC",
      [cat_id]
    );

    const formatted = rows.map((r) => ({
      adoption_id: r.adoption_id,
      adopter_name: r.adopter,
      adopter_id: r.adopter_id,
      contact_number: r.contactnumber,
      date_adopted: r.date_created
        ? r.date_created.toISOString().split("T")[0]
        : null,
      status: r.status,
      certificate: r.certificate,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching adoption history for cat:", err);
    res.status(500).json({ error: "Failed to fetch adoption history" });
  }
});

// ----------------- GET ADOPTION FORM (PDF) -----------------
HVAdoptionRoute.get("/api/adoption/:id/pdf", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      "SELECT id_image FROM adoption WHERE adoption_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const files = JSON.parse(rows[0].id_image || "[]");
    // Find the first file that’s a PDF
    const pdfFile = files.find((f) => f.toLowerCase().endsWith(".pdf"));

    if (!pdfFile) {
      return res
        .status(404)
        .json({ error: "No PDF form found for this application" });
    }

    const filePath = path.join(process.cwd(), "FileUploads/cats", pdfFile);
    res.sendFile(path.resolve(filePath));
  } catch (err) {
    console.error("❌ Error fetching adoption PDF:", err);
    res.status(500).json({ error: "Failed to fetch PDF" });
  }
});

//approve adoption + reward points to the user + update cat status
HVAdoptionRoute.post("/api/adoption/:id/approve", async (req, res) => {
  const db = getDB();
  const { id } = req.params;
  const approverId = req.user?.user_id; // assuming you attach session user to req.user

  try {
    // Fetch adoption first
    const [rows] = await db.query(
      "SELECT adopter_id FROM adoption WHERE adoption_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    const adoption = rows[0];

    // Prevent self-approval
    if (adoption.adopter_id === approverId) {
      return res
        .status(403)
        .json({ error: "You cannot approve your own adoption application." });
    }

    // Approve adoption
    await db.query(
      "UPDATE adoption SET status = 'Approved' WHERE adoption_id = ?",
      [id]
    );

    res.json({ success: true, message: "Application approved successfully" });
  } catch (err) {
    console.error("❌ Error approving adoption:", err);
    res.status(500).json({ error: "Failed to approve adoption" });
  }
});

// ----------------- REJECT ADOPTION -----------------
HVAdoptionRoute.post("/api/adoption/:id/reject", async (req, res) => {
  const db = getDB();
  try {
    const adoptionId = req.params.id;
    const { reason } = req.body;

    const [adoption] = await db.query(
      "SELECT * FROM adoption WHERE adoption_id = ?",
      [adoptionId]
    );

    if (adoption.length === 0) {
      return res.status(404).json({ error: "Adoption not found" });
    }

    const userId = adoption[0].adopter_id;
    const catId = adoption[0].adoptedcat_id;
    const catName = adoption[0].cat_name;
    const prevStatus = adoption[0].status;

    // Update adoption status
    await db.query(
      "UPDATE adoption SET status = 'Rejected' WHERE adoption_id = ?",
      [adoptionId]
    );

    // If it was previously approved, revert the cat status
    if (prevStatus === "Approved") {
      await db.query(
        "UPDATE cat SET adoption_status = 'Available', date_updated = NOW() WHERE cat_id = ?",
        [catId]
      );

      // Optionally: remove points if they were rewarded
      const rewardPoints = 40;
      await db.query(
        "UPDATE whiskermeter SET points = GREATEST(points - ?, 0) WHERE user_id = ?",
        [rewardPoints, userId]
      );
    }

    // 🔔 CREATE REJECTION NOTIFICATION
    const rejectionMessage = `We're sorry, but your adoption application for "${catName}" (Application ID: ${adoptionId}) could not be approved. ${
      reason ? `Reason: ${reason}` : "Please contact us for more details."
    } Thank you for your interest in giving a cat a loving home!`;
    await createNotification(userId, rejectionMessage, "adoption_rejected");

    res.json({
      message:
        "Adoption rejected successfully" +
        (prevStatus === "Approved"
          ? ", cat marked Available and points adjusted."
          : "."),
    });
  } catch (err) {
    console.error("❌ Error rejecting adoption:", err);
    res.status(500).json({ error: "Failed to reject adoption" });
  }
});

export { createNotification, notifyNewCatAvailable };
export default HVAdoptionRoute;
