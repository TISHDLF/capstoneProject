// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import session from "express-session";
import cookieParser from "cookie-parser";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// ---------------- PATH UTILS ---------------- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- MULTER STORAGE ---------------- //
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const dir = path.join(__dirname, "FileUploads/cats");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    callback(null, dir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadImages = multer({
  storage,
  fileFilter: function (req, file, callback) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      callback(null, true);
    } else {
      !req.invalidFiles
        ? (req.invalidFiles = [file.originalname])
        : req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});

// ---------------- MIDDLEWARE ---------------- //
app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use("/FileUploads", express.static(path.join(__dirname, "FileUploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "geloy_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" },
  })
);

// ---------------- MYSQL DB CONNECTION ---------------- //
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Password123",
      database: process.env.DB_NAME || "whiskerwatch",
    });
    console.log("✅ Connected to MySQL database!");
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err);
    process.exit(1);
  }
}
connectDB();

// ---------------- ROUTES ---------------- //
// Health check
app.get("/api", (req, res) => {
  res.json("This is the backend.");
});

// ---------------- USERS ---------------- //
// Login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    req.session.user = {
      user_id: user.user_id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    res.status(200).json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Session check
app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false, user: null });
  }
});

// ✅ Logout (fixed endpoint)
app.post("/api/logout", (req, res) => {
  console.log("Logout endpoint hit");
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully", loggedIn: false });
  });
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, firstname, lastname, contactnumber, birthday, email, username, role, address, badge FROM users WHERE user_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------- WHISKER METER ---------------- //
app.get("/api/whiskermeter/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT points FROM whiskermeter WHERE user_id = ?",
      [req.params.userId]
    );

    res.json(rows[0] || { points: 0 });
  } catch (err) {
    console.error("❌ Error fetching whiskermeter:", err.message);
    res.status(500).json({ error: "Failed to fetch whiskermeter" });
  }
});

// ---------------- DONATIONS ---------------- //
app.get("/api/donations", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          d.donation_id AS donationId,
          u.user_id AS userId,
          CONCAT(u.firstname, ' ', u.lastname) AS name,
          d.donation_type AS type,
          DATE_FORMAT(d.date_donated, '%m-%d-%y') AS date,
          d.description,
          d.status
      FROM donation d
      JOIN users u ON d.donator_id = u.user_id
      ORDER BY d.date_donated DESC
    `);

    const formatted = rows.map((r) => ({
      ...r,
      type: r.type ? r.type.split(",") : [],
      status: r.status || "Pending", // default to Pending if null
    }));

    res.json(formatted);
  } catch (err) {
    console.error(
      "❌ Error fetching donations:",
      err.sqlMessage || err.message
    );
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// Post donation
app.post("/api/donations", async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const donator_id = req.session.user.user_id;
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

    const description = `
      Amount: ${amount || "N/A"}
      Food: ${foodType || "N/A"} (${foodQuantity || 0})
      Food Desc: ${foodDescription || "N/A"}
      Item Desc: ${itemDescription || "N/A"}
      Other Desc: ${otherDescription || "N/A"}
    `;

    const [user] = await db.query(
      "SELECT firstname, lastname FROM users WHERE user_id = ?",
      [donator_id]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "Donator not found" });
    }

    const donatorName = `${user[0].firstname} ${user[0].lastname}`;

    const [result] = await db.query(
      `INSERT INTO donation (donator_id, donator, donation_type, description) 
       VALUES (?, ?, ?, ?)`,
      [donator_id, donatorName, donationType, description]
    );

    res.status(201).json({
      message: "✅ Donation submitted successfully!",
      donation_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error inserting donation:", err);
    res.status(500).json({ error: "Failed to submit donation" });
  }
});

// Approve donation + reward user points
app.post("/api/donations/:id/approve", async (req, res) => {
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

    await db.query(
      "UPDATE donation SET status = 'Approved' WHERE donation_id = ?",
      [donationId]
    );

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

    res.json({ message: "Donation approved and points rewarded!" });
  } catch (err) {
    console.error("❌ Error approving donation:", err);
    res.status(500).json({ error: "Failed to approve donation" });
  }
});

// ---------------- CATS ---------------- //
app.get("/api/cats", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM cats`);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching cats:", err);
    res.status(500).json({ error: "Failed to fetch cats" });
  }
});

app.get("/api/cats/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM cats WHERE cat_id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Cat not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cat" });
  }
});

app.post("/cat/create", async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      sterilization_status,
      adoption_status,
      description,
    } = req.body;

    if (!name || !age || !gender) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO Cats (name, age, gender, sterilization_status, adoption_status, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, age, gender, sterilization_status, adoption_status, description]
    );

    res.status(201).json({
      cat_id: result.insertId,
      message: "Cat profile created successfully",
    });
  } catch (error) {
    console.error("Error creating cat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload images
app.post(
  "/upload/catimages/:cat_id",
  uploadImages.array("images"),
  async (req, res) => {
    if (req.invalidFiles) {
      return res.status(200).json({
        warning: true,
        message:
          "Some documents did not upload due to invalid file type: " +
          req.invalidFiles.join(", "),
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(200).json({
        warning: true,
        message: "No valid Images were uploaded.",
      });
    }

    const cat_id = req.params.cat_id;

    try {
      for (const file of req.files) {
        const filename = file.filename;
        await db.query(
          `INSERT INTO Cat_Images (cat_id, image_filename) VALUES (?, ?)`,
          [cat_id, filename]
        );
      }

      return res
        .status(200)
        .json({ warning: false, message: "Images uploaded successfully!" });
    } catch (err) {
      console.error("MySQL Error:", err.sqlMessage);
      return res
        .status(500)
        .json({ message: "Database error while saving image info!" });
    }
  }
);

app.get("/image/:cat_id", async (req, res) => {
  try {
    const [images] = await db.query(
      `SELECT image_filename FROM Cat_Images WHERE cat_id = ?`,
      [req.params.cat_id]
    );

    res.json(images);
  } catch (err) {
    console.error("Error fetching cat images:", err);
    return res.status(500).json({ error: "Failed to fetch cat images" });
  }
});

// ---------------- GLOBAL ERROR HANDLER ---------------- //
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// ---------------- START SERVER ---------------- //
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});
