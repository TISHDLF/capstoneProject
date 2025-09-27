// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";

import { connectDB, getDB } from "./database.js";
import CatRoute from "./routes/Cat.js";
import UserRoute from "./routes/User.js";
import AdminRoute from "./routes/Admin.js";
import WhiskerMeterRoute from "./routes/WhiskerMeter.js";
import DonationRoute from "./routes/Donation.js";
import HVAdoptionRoute from "./routes/AdoptionHV.js";
import FeederRoute from "./routes/Feeder.js";
import ReportRoute from "./routes/reports.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// ---------------- PATH UTILS ---------------- //

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(
  "/uploads/cats",
  express.static(path.join(process.cwd(), "FileUploads/cats"))
);
app.use("/static", express.static(path.join(process.cwd(), "public")));

await connectDB();
app.use("/cats", CatRoute);
app.use("/user", UserRoute);
app.use("/admin", AdminRoute);
app.use("/whisker", WhiskerMeterRoute);
app.use("/donate", DonationRoute);
app.use("/adopt", HVAdoptionRoute);
app.use("/feeder", FeederRoute);
app.use("/report", ReportRoute);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/FileUploads", express.static(path.join(__dirname, "FileUploads")));

app.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    // credentials: true,
  })
);
app.use(express.json());

const port = process.env.PORT || 5000;

// ********************** DONATION ENDPOINT ************************** //
// app.get("/api/donations", async (req, res) => {
//   const db = connectDB();
//   try {
//     const [rows] = await db.query(`
//       SELECT
//           ik.ikDonationID AS applicationNo,
//           u.user_id AS userId,
//           CONCAT(u.firstname, ' ', u.lastname) AS name,
//           ik.donationType AS type,
//           DATE_FORMAT(ik.dateSubmitted, '%m-%d-%y') AS date,
//           ik.status
//       FROM InKindDonation ik
//       JOIN users u ON ik.user_id = u.user_id
//       ORDER BY ik.dateSubmitted DESC
//     `);

//     res.json(rows);
//   } catch (err) {

//     console.error('Login error:', err);
//     res.status(500).json({ err: 'Internal server error' });
//   }
// });

// **************** MULTER CONDITIONS FOR FILE FILTERING ****************** //
// const storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     const dir = 'FileUploads';
//     if(!fs.existsSync(dir)) {
//       fs.mkdirSync(dir)
//     }

//     callback(null, dir);
//   },
//   filename: function(req, file, callback) {
//     callback(null, Date.now() + path.extname(file.originalname))
//   }
// })

// const fileFilter = function(req, file, callback) {
//   if (file.mimetype == 'application/pdf') {
//     callback(null, true)
//   } else {
//     req.err = 'File is invalid!'
//     callback(null, false)
//   }
// }

// const uploadImages = multer({
//   storage,
//   fileFilter: function(req, file, callback) {
//     if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
//       callback(null, true)
//     } else {
//       !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname)
//       callback(null, false)
//     }
//   }
// });

// const upload = multer({ storage, fileFilter });

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
      // req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    }
  },
});

// POST REQUEST: Upload image to a file path 'FileUploads'
app.post("/upload/file", upload.single("document"), async (req, res) => {
  console.log(req.file);

  if (req.err) {
    return res.status(422).json({ message: req.err });
  }

  return res.status(200).json({ message: "File uploaded succesfully!" });
});

// Debug: list all registered routes
function listRoutes(app) {
  if (!app._router) {
    console.log("⚠️ No routes registered yet.");
    return;
  }

  console.log("📌 Registered routes:");
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Route directly on app
      const methods = Object.keys(middleware.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      // Router mounted with app.use()
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .map((m) => m.toUpperCase())
            .join(", ");
          console.log(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
