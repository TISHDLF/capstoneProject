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
  upload.fields([
    { name: "certificate", maxCount: 1 }, // adoption form PDF
    { name: "id_image", maxCount: 1 }, // uploaded ID photo
  ]),
  async (req, res) => {
    try {
      const db = getDB();

      const { adopter, adopter_id, adoptedcat_id, cat_name, contactnumber } =
        req.body;

      // Uploaded files
      const certificateFile = req.files["certificate"]
        ? req.files["certificate"][0].filename
        : null;

      const idImageFile = req.files["id_image"]
        ? req.files["id_image"][0].filename
        : null;

      // Save to DB
      const [result] = await db.query(
        `INSERT INTO adoption 
        (adoption_id,adopter, adopter_id, adoptedcat_id, cat_name, contactnumber, certificate, id_image, status, date_created) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())`,
        [
          adoption_id,
          adopter,
          adopter_id || null,
          adoptedcat_id,
          cat_name,
          contactnumber,
          certificateFile,
          idImageFile,
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
      `SELECT * FROM Adoption ORDER BY date_created DESC`
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

// ----------------- GET ADOPTION CERTIFICATE (PDF/IMG) -----------------
HVAdoptionRoute.get("/api/adoption/:id/pdf", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      "SELECT certificate FROM Adoption WHERE adoption_id = ?",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const certificateFile = rows[0].certificate;
    if (!certificateFile) {
      return res.status(404).json({ error: "Certificate not uploaded" });
    }

    // build absolute path
    const filePath = path.join(
      process.cwd(),
      "FileUploads/cats",
      certificateFile
    );

    // send actual file to frontend
    res.sendFile(filePath);
  } catch (err) {
    console.error("❌ Error fetching certificate:", err);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
});
//approve adoption + reward points to the user
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

    const userId = adoption[0].adopter_id; // ✅ fixed

    // Update adoption status
    await db.query(
      "UPDATE adoption SET status = 'Approved' WHERE adoption_id = ?",
      [adoptionId]
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

    res.json({ message: "Adoption approved and points rewarded!" });
  } catch (err) {
    console.error("❌ Error approving adoption:", err);
    res.status(500).json({ error: "Failed to approve adoption" });
  }
});

export default HVAdoptionRoute;
