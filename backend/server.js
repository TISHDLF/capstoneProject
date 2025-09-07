// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import session from "express-session";

dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "geloy_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" },
  })
);

// MySQL connection
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Password123",
      database: process.env.DB_NAME || "whiskerwatch",
    });
    console.log("Connected to MySQL database!");
  } catch (err) {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  }
}
connectDB();

const port = process.env.PORT || 5000;

// ✅ Health check
app.get("/api", (req, res) => {
  res.json("This is the backend.");
});

// ✅ Login
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
    req.session.user = { user_id: user.user_id, role: user.role };

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
app.get("/api/donations", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          ik.ikDonationID AS applicationNo,
          u.user_id AS userId,
          CONCAT(u.firstname, ' ', u.lastname) AS name,
          ik.donationType AS type,
          DATE_FORMAT(ik.dateSubmitted, '%m-%d-%y') AS date,
          ik.status
      FROM InKindDonation ik
      JOIN users u ON ik.user_id = u.user_id
      ORDER BY ik.dateSubmitted DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(
      "❌ Error fetching donations:",
      err.sqlMessage || err.message
    );
    res.status(500).json({
      error: "Failed to fetch donations",
      details: err.sqlMessage || err.message,
    });
  }
});

// ✅ Get user by ID
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
// User Meter routes
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      "SELECT points, level FROM user_meter WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User meter not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
