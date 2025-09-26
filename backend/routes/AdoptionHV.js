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

// ----------------- APPLY ROUTE -----------------
HVAdoptionRoute.post(
  "/apply",
  upload.array("id_image", 5), // handle both adoption form PDF + ID photo
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
HVAdoptionRoute.get("/api/adoption", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      `SELECT * FROM adoption ORDER BY date_created DESC`
    );

    const formatted = rows.map((r) => ({
      applicationNo: r.adoption_id,
      user_id: r.adopter_id,
      name: r.adopter,
      type: r.cat_name,
      date: r.date_created ? r.date_created.toISOString().split("T")[0] : null,
      status: r.status || "Pending", // fallback since status isn’t in schema
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
  try {
    const adoptionId = req.params.id;
    const [adoption] = await db.query(
      "SELECT * FROM adoption WHERE adoption_id = ?",
      [adoptionId]
    );

    if (adoption.length === 0) {
      return res.status(404).json({ error: "Adoption not found" });
    }

    const userId = adoption[0].adopter_id;
    const catId = adoption[0].adoptedcat_id;

    // Update adoption status
    await db.query(
      "UPDATE adoption SET status = 'Approved' WHERE adoption_id = ?",
      [adoptionId]
    );

    // Update cat adoption_status
    await db.query(
      "UPDATE cat SET adoption_status = 'Adopted', date_updated = NOW() WHERE cat_id = ?",
      [catId]
    );

    // Reward points
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

    res.json({
      message: "Adoption approved, cat marked as Adopted, and points rewarded!",
    });
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
    const [adoption] = await db.query(
      "SELECT * FROM adoption WHERE adoption_id = ?",
      [adoptionId]
    );

    if (adoption.length === 0) {
      return res.status(404).json({ error: "Adoption not found" });
    }

    const userId = adoption[0].adopter_id;
    const catId = adoption[0].adoptedcat_id;
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

export default HVAdoptionRoute;
