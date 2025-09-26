import express from "express";
import cors from "cors";
import { Router } from "express";
import { getDB } from "../database.js";
import cookieParser from "cookie-parser";

import multer from "multer";
import fs, { stat } from "fs";
import path from "path";
import { fileURLToPath } from "url";

import nodemailer from "nodemailer";

const AdminRoute = Router();
AdminRoute.use(express.json());
const dir = path.join(process.cwd(), "FileUploads/certificates");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// In Admin.js (or wherever AdminRoute is defined)
const certificateStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(process.cwd(), "FileUploads/certificates");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const certificateUpload = multer({
  storage: certificateStorage,
  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});
AdminRoute.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

AdminRoute.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/],
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.MAILPASS,
  },
});
AdminRoute.get("/approved", async (req, res) => {
  try {
    const db = await getDB();
    const [rows] = await db.query(`
      SELECT a.adoption_id, a.adopter, a.contactnumber, a.adoption_date, a.cat_name, a.certificate, u.email
      FROM adoption a
      LEFT JOIN users u ON u.user_id = a.adopter_id
      WHERE a.status = 'Approved'
      ORDER BY a.adoption_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching approved adoptions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
AdminRoute.post("/adoptions/send-email", async (req, res) => {
  const { email, adopter, catName, adoptionDate, certificate } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const mailOptions = {
      from: '"Cat Shelter Admin" <whiskerwatch100@gmail.com>',
      to: email,
      subject: "Your Cat Adoption Certificate",
      text: `Hello ${adopter},\n\nCongratulations on adopting ${catName} on ${adoptionDate}!\n\nPlease find your adoption certificate attached.\n\nThank you for adopting!`,
      attachments: certificate
        ? [
            {
              filename: certificate, // original filename or stored name
              path: path.join(
                process.cwd(),
                "FileUploads/certificates",
                certificate
              ),
            },
          ]
        : [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
});

AdminRoute.post("/feeders/send-email", async (req, res) => {
  const { email, firstname, lastname, feedingDate } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const mailOptions = {
      from: '"Cat Shelter Admin" <whiskerwatch100@gmail.com>',
      to: email,
      subject: "Your Feeding Volunteer Schedule",
      text: `Hello ${firstname} ${lastname},\n\nYour assigned feeding schedule is: ${feedingDate}\n\nThank you for volunteering!`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res
      .status(500)
      .json({ error: "Failed to send email", details: err.message });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

AdminRoute.use(cookieParser());
AdminRoute.use(
  "/FileUploads",
  express.static(path.join(__dirname, "FileUploads"))
);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = "FileUploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = function (req, file, callback) {
  if (file.mimetype == "application/pdf") {
    callback(null, true);
  } else {
    req.err = "File is invalid!";
    callback(null, false);
  }
};

const uploadImages = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      !req.invalidFiles
        ? (req.invalidFiles = [file.originalname])
        : req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});

const upload = multer({ storage, fileFilter });

AdminRoute.get("/manage/users", async (req, res) => {
  const db = getDB();
  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE role IN ('regular','head_volunteer', 'admin')"
    );
    return res.json(users);
  } catch (err) {
    console.error("Error fetching user profiles:", err);
    return res.status(500).json({ err: "Failed to fetch user list." });
  }
});

AdminRoute.get("/manage/adminlist", async (req, res) => {
  const db = getDB();
  try {
    const [admin] = await db.query(
      "SELECT user_id, firstname, lastname, email, DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login FROM users WHERE role = 'admin'"
    );

    return res.json(admin);
  } catch (err) {
    console.error("Error fetching admin profiles: ", err);
    return res.status(500).json({ err: "Failed to fetch admin list." });
  }
});

AdminRoute.get("/manage/non_admin", async (req, res) => {
  const db = getDB();
  try {
    const [admin] = await db.query(
      "SELECT user_id, firstname, lastname, email FROM users WHERE role NOT IN ('admin')"
    );
    return res.json(admin);
  } catch (err) {
    console.error("Error fetching user profiles: ", err);
    return res.status(500).json({ err: "Failed to fetch admin list." });
  }
});

AdminRoute.patch("/manage/userupdate/:user_id", async (req, res) => {
  const db = getDB();
  const user_id = req.params.user_id;
  const {
    firstname = "",
    lastname = "",
    role = "",
    email = "",
    contactnumber = "",
    birthday = "",
    address = "",
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE users SET
            firstname = ?,
            lastname = ?,
            role = ?,
            email = ?,
            contactnumber = ?,
            birthday = ?,
            address = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?`,
      [
        firstname,
        lastname,
        role,
        email,
        contactnumber,
        birthday,
        address,
        user_id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET REQUEST: FETCHES THE USER DATA FOR ROLE UPDATE
AdminRoute.get("/manage/role/:user_id", async (req, res) => {
  const db = getDB();
  const user_id = req.params.user_id;

  try {
    const [role] = await db.query(
      `SELECT firstname, lastname, email, role FROM users WHERE user_id = ?`,
      [user_id]
    );

    return res.json(role[0]);
  } catch (err) {
    console.error("Error fetching user: ", err);
    res.status(500).json({ error: "Internal Server failed!" });
  }
});

// PATCH REQUEST: UPDATE THE ROLE OF A USER INTO ADMIN/HEAD VOLUNTEER/REGULAR
AdminRoute.patch("/manage/update/:user_id", async (req, res) => {
  const db = getDB();
  const user_id = req.params.user_id;
  const { firstname = "", lastname = "", email = "", role = "" } = req.body;

  try {
    const [update] = await db.query(
      `
            UPDATE users SET
                firstname = ?, 
                lastname = ?,
                email = ?,
                role = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
      [firstname, lastname, email, role, user_id]
    );

    if (update.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User role updated successfully!" });

    console.log(update);
  } catch (err) {
    console.error("Error updating user role: ", err);
    return res.status(500).json({ err: "Failed to update role." });
  }
});

AdminRoute.patch("/manage/update_admin", async (req, res) => {
  const db = getDB();
  const { user_id } = req.body;
  try {
    const query = await db.query(
      ` 
            UPDATE users SET role = 'admin' WHERE user_id = ?
        `,
      [user_id]
    );

    return res.json({ success: true, result: query });
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Failed to update user role to admin!" });
  }
});

AdminRoute.get("/manage/userprofile/:user_id", async (req, res) => {
  const db = getDB();
  const user_id = req.params.user_id;

  try {
    const [userprofile] = await db.query(
      `SELECT 
                user_id, firstname, lastname, profile_image, contactnumber, DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, email, username, role, badge, address, 
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
            FROM users
            WHERE user_id = ?;`,
      [user_id]
    );
    return res.json(userprofile[0]);
  } catch (err) {
    console.error("Error fetching user data: ", err);
    return res.status(500).json({ err: "Failed to fetch user data." });
  }
});

AdminRoute.get("/feeders/application", async (req, res) => {
  const db = getDB();

  try {
    const [applications] = await db.query(`
            SELECT
                va.application_id AS application_number,
                u.firstname,
                u.lastname,
                va.application_form,
                DATE_FORMAT(va.application_date, '%Y-%m-%d') AS date_applied,
                va.status
            FROM
                volunteer_application va
            JOIN
                users u ON va.user_id = u.user_id  
            WHERE va.status = 'Pending'
        `);

    return res.json(applications);
  } catch (err) {
    console.error("Error fetching application data: ", err);
    res.status(500).json({ error: "Internal Server failed!" });
  }
});

AdminRoute.get("/form/:application_id", async (req, res) => {
  const db = getDB();
  const application_id = req.params.application_id;

  try {
    const [application] = await db.query(
      `
            SELECT
                va.application_id AS application_id,
                u.firstname,
                u.lastname,
                va.application_form,
                DATE_FORMAT(va.application_date, '%Y-%m-%d') AS date_applied,
                va.status
            FROM
                volunteer_application va
            JOIN
                users u ON va.user_id = u.user_id
            WHERE va.application_id = ?; 
        `,
      [application_id]
    );

    return res.json(application[0]);
  } catch (err) {
    console.error("Error fetching application data: ", err);
    res.status(500).json({ error: "Internal Server failed!" });
  }
});

AdminRoute.patch("/form/status_update/:application_id", async (req, res) => {
  const db = getDB();
  const application_id = req.params.application_id;
  const { status } = req.body;

  try {
    // 1. Update application status
    const [statusupdate] = await db.query(
      `UPDATE volunteer_application SET status = ? WHERE application_id = ?`,
      [status, application_id]
    );

    // 2. If Accepted, insert into volunteer
    if (status === "Accepted") {
      const [userData] = await db.query(
        `SELECT va.user_id, u.firstname, u.lastname, va.application_date
         FROM volunteer_application va
         JOIN users u ON va.user_id = u.user_id
         WHERE va.application_id = ?`,
        [application_id]
      );

      if (userData.length === 0) {
        return res
          .status(404)
          .json({ error: "User not found for this application" });
      }

      const { user_id, firstname, lastname, application_date } = userData[0];
      const fullName = `${firstname} ${lastname}`;

      // Avoid duplicates
      const [existingVolunteer] = await db.query(
        `SELECT * FROM volunteer WHERE feeder_id = ?`,
        [user_id]
      );

      if (existingVolunteer.length === 0) {
        await db.query(
          `INSERT INTO volunteer (feeder_id, name, feeding_date, application_date, status)
           VALUES (?, ?, NOW(), ?, 'Approved')`,
          [user_id, fullName, application_date]
        );
      }
    }

    res.json({ success: true, result: statusupdate });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ err: "Failed to update status!" });
  }
});

AdminRoute.get("/api/dashboard", async (req, res) => {
  const db = getDB();
  try {
    const [rows] = await db.query(
      `SELECT
  (SELECT COUNT(*) FROM users) AS totalUsers,
  (SELECT COUNT(*) FROM cat) AS totalCats,
  (SELECT IFNULL(SUM(m.amount), 0) + 0.0
 FROM monetarydonation m
 JOIN donation d ON m.donation_id = d.donation_id) AS totalDonations,

  (SELECT COUNT(*) FROM users 
     WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
       AND YEAR(created_at) = YEAR(CURRENT_DATE())) AS newUsers,

  (SELECT COUNT(*) 
   FROM cat 
   WHERE adoption_status = 'Adopted') AS catsAdopted,

  (SELECT IFNULL(SUM(m.amount), 0) + 0.0
 FROM monetarydonation m
 JOIN donation d ON m.donation_id = d.donation_id
 WHERE MONTH(d.date_donated) = MONTH(CURRENT_DATE()) 
   AND YEAR(d.date_donated) = YEAR(CURRENT_DATE())) AS monthlyDonations`
    );

    res.json(rows[0]);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

AdminRoute.get("/feeders", async (req, res) => {
  const db = getDB();

  try {
    const [volunteers] = await db.query(`
           SELECT v.feeder_id, u.firstname, u.lastname, u.contactnumber, u.email,
       DATE_FORMAT(v.feeding_date, '%Y-%m-%d %H:%i') AS feeding_date, v.status
FROM volunteer v
JOIN users u ON v.feeder_id = u.user_id
WHERE v.status = 'Approved';
        `);

    return res.json(volunteers);
  } catch (err) {
    return res.status(500).json({ err: "Failed to retrieve volunteers!" });
  }
});

AdminRoute.post(
  "/adoptions/upload-certificate",
  certificateUpload.single("certificate"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { adoption_id } = req.body;
    if (!adoption_id)
      return res.status(400).json({ error: "Missing adoption ID" });

    try {
      const db = await getDB();
      await db.query(
        "UPDATE adoption SET certificate = ? WHERE adoption_id = ?",
        [req.file.filename, adoption_id]
      );
      res.json({ success: true, message: "Certificate uploaded!" });
    } catch (err) {
      console.error("Error saving certificate:", err);
      res.status(500).json({ error: "Failed to save certificate" });
    }
  }
);

export default AdminRoute;
