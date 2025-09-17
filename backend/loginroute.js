import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // frontend
    credentials: true, // allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password] // ⚠️ for production: hash passwords!
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // Save user info in a cookie (not password!)
    res.cookie(
      "user",
      JSON.stringify({
        user_id: user.user_id,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
      }),
      {
        httpOnly: false, // frontend React can read it
        secure: false, // true if using https
        sameSite: "lax",
      }
    );

    res.json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  res.json({ message: "Logged out" });
});
