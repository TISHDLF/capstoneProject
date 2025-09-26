import express from "express";
import { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";

import { getDB } from "../database.js";

const WhiskerMeterRoute = Router();
WhiskerMeterRoute.use(express.json());
function getBadgeFromPoints(points) {
  if (points >= 160) return "The Catnip Captain";
  if (points >= 120) return "Meowtain Mover"; // DB enum: "Meowtain Mover"
  if (points >= 80) return "Furmidable Friend";
  if (points >= 40) return "Snuggle"; // ⚠️ But enum is "Snuggle" or "Snuggle Scout"?
  return "Toe bean trainee";
}

WhiskerMeterRoute.post("/api/whiskermeter/:userId/add", async (req, res) => {
  const db = getDB();
  const { amount } = req.body; // e.g., +20 points
  try {
    await db.query(
      "UPDATE whiskermeter SET points = points + ?, last_updated = NOW() WHERE user_id = ?",
      [amount, req.params.userId]
    );

    const [[row]] = await db.query(
      "SELECT points FROM whiskermeter WHERE user_id = ?",
      [req.params.userId]
    );

    const points = row?.points || 0;
    const badge = getBadgeFromPoints(points);

    await db.query("UPDATE users SET badge = ? WHERE user_id = ?", [
      badge,
      req.params.userId,
    ]);

    res.json({ points, badge });
  } catch (err) {
    console.error("Error updating whiskermeter:", err.message);
    res.status(500).json({ error: "Failed to update whiskermeter" });
  }
});

WhiskerMeterRoute.get("/api/whiskermeter/:userId", async (req, res) => {
  const db = getDB();
  try {
    const [[row]] = await db.query(
      "SELECT points FROM whiskermeter WHERE user_id = ?",
      [req.params.userId]
    );

    const points = row?.points || 0;
    const badge = getBadgeFromPoints(points);

    // Keep user table badge in sync
    await db.query("UPDATE users SET badge = ? WHERE user_id = ?", [
      badge,
      req.params.userId,
    ]);

    res.json({ points, badge });
  } catch (err) {
    console.error("Error fetching whiskermeter:", err.message);
    res.status(500).json({ error: "Failed to fetch whiskermeter" });
  }
});

export default WhiskerMeterRoute;
