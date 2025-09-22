import express from "express";
import { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from 'cookie-parser';

import { getDB } from "../database.js"


const WhiskerMeterRoute = Router();
WhiskerMeterRoute.use(express.json());

WhiskerMeterRoute.get("/api/whiskermeter/:userId", async (req, res) => {
    const db = getDB();
    try {
        const [rows] = await db.query(
        "SELECT points FROM whiskermeter WHERE user_id = ?",
        [req.params.userId]
        );
        res.json(rows[0] || { points: 0 });
    } catch (err) {
        console.error("Error fetching whiskermeter:", err.message);
        res.status(500).json({ error: "Failed to fetch whiskermeter" });
    }
});


export default WhiskerMeterRoute;