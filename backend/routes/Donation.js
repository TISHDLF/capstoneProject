import express from "express";
import { Router } from "express";

import { getDB } from "../database.js";

import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DonationRoute = Router();
DonationRoute.use(express.json());

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
const createNotification = async (userId, message, type = "donation") => {
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
const proofStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/proofs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadProof = multer({
  storage: proofStorage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith("image/")) {
      callback(null, true);
    } else {
      callback(
        new Error("Only images are allowed for proof of payment"),
        false
      );
    }
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
      // req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});

DonationRoute.get("/api/donations", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      `SELECT d.donation_id AS donationId, u.user_id AS userId, CONCAT(u.firstname, ' ', u.lastname) AS name, 
                d.donation_type AS type, DATE_FORMAT(d.date_donated, '%m-%d-%y') AS date, 
                d.description, d.status, d.proofimage
        FROM donation d 
        JOIN users u ON d.donator_id = u.user_id 
        ORDER BY d.date_donated DESC`
    );

    const formatted = rows.map((r) => ({
      ...r,
      type: r.type ? r.type.split(",") : [],
      status: r.status || "Pending",
      proofUrl: r.proofimage
        ? `data:image/png;base64,${r.proofimage.toString("base64")}`
        : null,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error fetching donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// ---------------- DONATIONS ---------------- //
// UPDATED DONATION SUBMISSION WITH NOTIFICATIONS
DonationRoute.post(
  "/api/donations",
  uploadProof.single("proofImage"),
  async (req, res) => {
    const db = getDB();
    try {
      const donator_id = req.body.donator_id;

      if (!donator_id) {
        return res.status(400).json({ error: "Donator ID is required" });
      }

      let {
        donationType,
        amount,
        foodType,
        foodQuantity,
        foodDescription,
        itemDescription,
        otherDescription,
      } = req.body;

      if (!donationType || donationType.length === 0) {
        return res.status(400).json({ error: "Donation type is required" });
      }

      if (Array.isArray(donationType)) {
        donationType = donationType.join(",");
      }

      const description = `Amount: ${amount || "N/A"} Food: ${
        foodType || "N/A"
      } (${foodQuantity || 0}) Food Desc: ${
        foodDescription || "N/A"
      } Item Desc: ${itemDescription || "N/A"} Other Desc: ${
        otherDescription || "N/A"
      }`;

      // Handle proof of payment
      let proofBuffer = null;
      if (req.file) {
        proofBuffer = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path); // delete temp file
      }

      // Get donator full name
      const [user] = await db.query(
        "SELECT firstname, lastname FROM users WHERE user_id = ?",
        [donator_id]
      );
      if (user.length === 0) {
        return res.status(404).json({ error: "Donator not found" });
      }
      const donatorName = `${user[0].firstname} ${user[0].lastname}`;

      // Insert into Donation
      const [result] = await db.query(
        `INSERT INTO donation (donator_id, donator, donation_type, description, proofimage, status) 
         VALUES (?, ?, ?, ?, ?, 'Pending')`,
        [donator_id, donatorName, donationType, description, proofBuffer]
      );

      const donationId = result.insertId;

      // If donation type includes "Money", insert into MonetaryDonation
      if (donationType.includes("Money") && amount) {
        await db.query(
          `INSERT INTO monetarydonation (donation_id, amount, currency) VALUES (?, ?, ?)`,
          [donationId, parseFloat(amount), "PHP"]
        );
      }

      // 🔔 CREATE NOTIFICATION FOR USER
      const donationTypesList = donationType.split(",").join(", ");
      let notificationMessage = `Thank you for your ${donationTypesList} donation! `;

      if (amount) {
        notificationMessage += `Amount: ₱${amount}. `;
      }

      notificationMessage += `Your donation (ID: ${donationId}) is currently under review. We'll notify you once it's approved.`;

      await createNotification(
        donator_id,
        notificationMessage,
        "donation_submitted"
      );

      res.status(201).json({
        message: "Donation submitted successfully!",
        donation_id: donationId,
      });
    } catch (err) {
      console.error("Error inserting donation:", err);
      res.status(500).json({ error: "Failed to submit donation" });
    }
  }
);

// UPDATED APPROVE DONATION WITH ADDITIONAL NOTIFICATIONS
DonationRoute.post("/api/donations/:id/approve", async (req, res) => {
  const db = getDB();
  try {
    const donationId = req.params.id;
    const [donation] = await db.query(
      "SELECT * FROM donation WHERE donation_id = ?",
      [donationId]
    );

    if (donation.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const userId = donation[0].donator_id;
    const donationType = donation[0].donation_type;

    // Update donation status
    await db.query(
      "UPDATE donation SET status = 'Approved' WHERE donation_id = ?",
      [donationId]
    );

    // Award points
    const rewardPoints = 20;
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
    const approvalMessage = `🎉 Great news! Your ${donationType} donation (ID: ${donationId}) has been approved! You've earned ${rewardPoints} whisker points as a thank you for your generosity.`;
    await createNotification(userId, approvalMessage, "donation_approved");

    res.json({ message: "Donation approved and points rewarded!" });
  } catch (err) {
    console.error("Error approving donation:", err);
    res.status(500).json({ error: "Failed to approve donation" });
  }
});
DonationRoute.post("/api/donations/:id/reject", async (req, res) => {
  const db = getDB();
  try {
    const donationId = req.params.id;
    const { reason } = req.body;

    const [donation] = await db.query(
      "SELECT * FROM donation WHERE donation_id = ?",
      [donationId]
    );

    if (donation.length === 0) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const userId = donation[0].donator_id;
    const donationType = donation[0].donation_type;

    // Update donation status
    await db.query(
      "UPDATE donation SET status = 'Rejected' WHERE donation_id = ?",
      [donationId]
    );

    // 🔔 CREATE REJECTION NOTIFICATION
    const rejectionMessage = `We're sorry, but your ${donationType} donation (ID: ${donationId}) could not be approved. ${
      reason ? `Reason: ${reason}` : "Please contact us for more details."
    } Thank you for your interest in helping our cats!`;
    await createNotification(userId, rejectionMessage, "donation_rejected");

    res.json({ message: "Donation rejected and user notified." });
  } catch (err) {
    console.error("Error rejecting donation:", err);
    res.status(500).json({ error: "Failed to reject donation" });
  }
});

// ADOPTION
DonationRoute.post(
  "/api/adoption",
  upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "id_image", maxCount: 1 },
  ]),
  async (req, res) => {
    const db = getDB();
    try {
      const { adoptedcat_id, adopter_id, cat_name, adopter, contactnumber } =
        req.body;
      // Validate required fields
      if (
        !adoptedcat_id ||
        !adopter_id ||
        !cat_name ||
        !adopter ||
        !contactnumber
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      // Certificate is mandatory
      const certificateFile = req.files["certificate"]?.[0];
      if (!certificateFile) {
        return res.status(400).json({ error: "No PDF file uploaded" });
      }
      // Optional ID image
      const idImageFile = req.files["id_image"]?.[0];
      // Read files
      const certificateBuffer = fs.readFileSync(certificateFile.path);
      const idImageBuffer = idImageFile
        ? fs.readFileSync(idImageFile.path)
        : null;
      // Insert into DB
      await pool.query(
        `INSERT INTO Adoption (adoptedcat_id, adopter_id, cat_name, adopter, contactnumber, certificate, id_image) 
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          adoptedcat_id ? parseInt(adoptedcat_id) : null,
          parseInt(adopter_id),
          cat_name,
          adopter,
          contactnumber,
          certificateBuffer,
          idImageBuffer,
        ]
      );

      // Remove temp files
      fs.unlinkSync(certificateFile.path);
      if (idImageFile) fs.unlinkSync(idImageFile.path);
      res.status(201).json({ message: "Adoption PDF stored in DB" });
    } catch (err) {
      console.error("Failed to store adoption PDF:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);

// Get all adoptions
DonationRoute.get("/api/adoption", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await pool.query(
      `SELECT * FROM Adoption ORDER BY date_created DESC`
    );
    // Map DB columns to frontend-friendly names
    const formatted = rows.map((r) => ({
      applicationNo: r.adoption_id,
      user_id: r.adopter_id,
      name: r.adopter,
      type: r.cat_name,
      date: r.date_created.toISOString().split("T")[0], // format as yyyy-mm-dd
      status: r.status || "Pending",
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
});
// adoption pdf (id)
DonationRoute.get("/api/adoption/:id/pdf", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await pool.query(
      "SELECT certificate FROM Adoption WHERE adoption_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    const pdfBuffer = rows[0].certificate;

    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch PDF" });
  }
});
// Get total donated amount
DonationRoute.get("/api/donations/total", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      "SELECT IFNULL(SUM(amount), 0) AS totalAmount FROM monetarydonation"
    );

    res.json({ totalAmount: rows[0].totalAmount });
  } catch (err) {
    console.error("Error fetching total donations:", err);
    res.status(500).json({ error: "Failed to fetch total donations" });
  }
});

export default DonationRoute;
