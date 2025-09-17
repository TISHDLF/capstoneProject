// server.js or routes/session.js
import express from "express";

const router = express.Router();

router.post("/logout", (req, res) => {
  // Destroy session if using express-session
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Error destroying session:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid"); // clear cookie (default name for express-session)
      return res.json({ message: "✅ Logged out successfully" });
    });
  } else {
    return res.status(200).json({ message: "No active session" });
  }
});

export default router;
