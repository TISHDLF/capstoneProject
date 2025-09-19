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

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // your DB username
  password: "Password123", // your DB password
  database: "whiskerwatch", // your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

dotenv.config();
const app = express();

// ---------------- PATH UTILS ---------------- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads/cats",
  cors({ origin: "http://localhost:5173" }), // allow your frontend
  express.static(path.join(process.cwd(), "FileUploads/cats"))
);

// ---------------- MULTER STORAGE ---------------- //
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
      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
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

  return res.status(200).json({ message: "File uploaded succesfully!" });
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
    console.error("❌ Error fetching donations:", err.message);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// ---------------- DONATIONS ---------------- //

app.post(
  "/api/donations",
  uploadProof.single("proofImage"),
  async (req, res) => {
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

      const description = `Amount: ${amount || "N/A"} Food: ${
        foodType || "N/A"
      } (${foodQuantity || 0}) Food Desc: ${
        foodDescription || "N/A"
      } Item Desc: ${itemDescription || "N/A"} Other Desc: ${
        otherDescription || "N/A"
      }`;

      // ✅ Handle proof of payment
      let proofBuffer = null;
      if (req.file) {
        proofBuffer = fs.readFileSync(req.file.path);
        fs.unlinkSync(req.file.path); // delete temp file
      }

      const [user] = await db.query(
        "SELECT firstname, lastname FROM users WHERE user_id = ?",
        [donator_id]
      );
      if (user.length === 0) {
        return res.status(404).json({ error: "Donator not found" });
      }
      const donatorName = `${user[0].firstname} ${user[0].lastname}`;

      const [result] = await db.query(
        `INSERT INTO donation (donator_id, donator, donation_type, description, proofimage) 
       VALUES (?, ?, ?, ?, ?)`,
        [donator_id, donatorName, donationType, description, proofBuffer]
      );

      res.status(201).json({
        message: "✅ Donation submitted successfully!",
        donation_id: result.insertId,
      });
    } catch (err) {
      console.error("❌ Error inserting donation:", err);
      res.status(500).json({ error: "Failed to submit donation" });
    }
  }
);

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

// ADOPTION
app.post(
  "/api/adoption",
  upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "id_image", maxCount: 1 },
  ]),
  async (req, res) => {
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
      res.status(201).json({ message: "✅ Adoption PDF stored in DB" });
    } catch (err) {
      console.error("Failed to store adoption PDF:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  }
);

// Get all adoptions
app.get("/api/adoption", async (req, res) => {
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

app.get("/api/adoption/:id/pdf", async (req, res) => {
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

// Create cat profile
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
    if (!name || !age || !gender || !sterilization_status || !adoption_status) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const [result] = await pool.query(
      `INSERT INTO cats (name, age, gender, sterilization_status, adoption_status, description, date_created, date_updated) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, age, gender, sterilization_status, adoption_status, description]
    );
    res.status(201).json({
      message: "Cat created successfully",
      cat_id: result.insertId,
    });
  } catch (err) {
    console.error("Error inserting cat:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- ROUTE ---------------- //
// Upload images
app.post(
  "/upload/catimages/:cat_id",
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { cat_id } = req.params;
      if (req.invalidFiles && req.invalidFiles.length > 0) {
        return res.status(400).json({
          error: `Invalid file types: ${req.invalidFiles.join(", ")}`,
        });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded" });
      }
      const insertPromises = req.files.map((file, index) =>
        pool.query(
          `INSERT INTO Cat_Images (cat_id, image_filename, is_primary) 
           VALUES (?, ?, ?)`,
          [cat_id, file.filename, index === 0 ? 1 : 0]
        )
      );
      await Promise.all(insertPromises);
      // ✅ return URLs directly
      const uploadedImages = req.files.map((f) => ({
        filename: f.filename,
        url: `http://localhost:5000/uploads/cats/${f.filename}`,
      }));
      res.status(200).json({
        message: "Images uploaded successfully",
        uploaded: uploadedImages,
      });
    } catch (err) {
      console.error("Image upload failed:", err);
      res.status(500).json({ error: "Server error while uploading images" });
    }
  }
);

// Get all cat images
app.get("/api/cats/images", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT image_id, cat_id, image_filename, is_primary, 
              CONCAT('http://localhost:5000/uploads/cats/', image_filename) AS url 
       FROM Cat_Images`
    );
    if (!rows.length) {
      return res.status(200).json([]); // no images yet
    }
    res.json(rows);
  } catch (err) {
    console.error("Error fetching cat images:", err);
    res.status(500).json({ error: "Failed to fetch cat images" });
  }
});

// Fetch cat images
app.get("/upload/catimages/:cat_id", async (req, res) => {
  try {
    const { cat_id } = req.params;
    const [rows] = await pool.query(
      `SELECT image_filename FROM Cat_Images WHERE cat_id = ?`,
      [cat_id]
    );
    // ✅ return both filename + url
    const formatted = rows.map((r) => ({
      filename: r.image_filename,
      url: `http://localhost:5000/uploads/cats/${r.image_filename}`,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("❌ Fetch images failed:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Fetch cat images by catId
app.get("/api/cats/:catId/images", async (req, res) => {
  const { catId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT image_filename FROM Cat_Images WHERE cat_id = ?",
      [catId]
    );
    const formatted = rows.map((img) => ({
      filename: img.image_filename,
      url: `http://localhost:5000/uploads/cats/${img.image_filename}`, // ✅ direct URL
    }));
    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching cat images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Delete image
app.delete("/image/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    // Delete from DB
    await pool.query(`DELETE FROM Cat_Images WHERE image_filename = ?`, [
      filename,
    ]);
    // Delete file
    const filepath = path.join(process.cwd(), "FileUploads/cats", filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    res.json({ message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
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
