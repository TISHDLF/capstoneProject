import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';
import session from "express-session";

import multer from 'multer';
import fs from 'fs';
// import { promises as fs } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { error } from "console";

const UserRoute = Router();
UserRoute.use(express.json());

UserRoute.use(
    cors({ origin: "http://localhost:5173",
        credentials: true, 
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }), 
);

UserRoute.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    // credentials: true,
  })
);

UserRoute.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,           // prevent JS access to cookie
    secure: false,            // true if using HTTPS
    sameSite: 'lax',          // allow session in cross-site (for dev)
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


UserRoute.use(cookieParser());
UserRoute.use('/FileUploads', express.static(path.join(__dirname, 'FileUploads')));

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


const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dir = path.join(process.cwd(), "FileUploads")
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        } 
        callback(null, dir);
    },
    
    // PURPOSE: Upload pdf files
    // const upload = multer({ storage, fileFilter });
    
    
    filename: function (req, file, callback) {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({
  storage,
  fileFilter: function(req, file, callback) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf' 
    ) {
      callback(null, true)
    } else {
      req.err = 'File is invalid!'
      // callback(null, false)

      if (!req.invalidFiles) req.invalidFiles = [];
      req.invalidFiles.push(file.originalname);
      callback(null, false);
    };
  },
});


UserRoute.post('/signup', async (req, res) => {
    try {
        let db = getDB();
        const { firstname, lastname, contactnumber, birthday, email, username, address, password } = req.body;

        const [result] = await db.query(
        `INSERT INTO users 
            (firstname, lastname, contactnumber, birthday, email, username, address, password) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ? )`,
            [firstname, lastname, contactnumber, birthday, email, username, address, password]
        );

        res.status(200).json({
        message: 'Account created!',
        newUser: {
            user_id: result.insertId,
            role: 'regular',
            badge: 'Toe Bean Trainee',
        }
        })

    } catch(err) {
        console.error('Login error:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
})


UserRoute.post('/login', async (req, res) => {
    let db = getDB();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ? and password = ?', [email, password]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        req.session.user = {
            user_id: user.user_id,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
        };


        res.status(200).json({
            message: 'Login successful',
            user: {
                user_id: user.user_id,
                role: user.role,
                firstname: user.firstname,
                lastname: user.lastname,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ err: 'Internal server error' });
    }
});

UserRoute.get("/api/session", (req, res) => {
  if (req.session.user) {
    console.log('api/session is currently in progress!');
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false, user: null });
  }
});


UserRoute.get('/logged', async (req, res) => {
    let db = getDB();
    try {
        const userId = req.query.user_id;
        
        if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
        }
        
        const [data] = await db.query(
        'SELECT user_id, firstname, lastname, role FROM users WHERE user_id = ?', [userId]
        );
        
        if (data.length === 0) {
        return res.status(404).json({ error: 'User not found' });
        }
        
        return res.status(200).json(data[0]); // ✅ returns { id, firstname, lastname, role }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});


// UserRoute.post('/adminlogin', async (req, res) => {
//     try {
//         let db = getDB();
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ error: 'Username and password are required' });
//         }

//         const [users] = await db.query(
//             'SELECT * FROM users WHERE username = ? and password = ?', [username, password]
//         );

//         if (users.length === 0) {
//             return res.status(401).json({ error: 'Invalid credentials!' });
//         } 
        
    
//         const user = users[0];
//         req.session.user = {
//             user_id: user.user_id,
//             role: user.role,
//             firstname: user.firstname,
//             lastname: user.lastname,
//         };

//         res.status(200).json({
//         message: 'Login successful',
//         user: {
//             user_id: user.user_id,
//             role:user.role
//         },
//         });
//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ err: 'Internal server error' });
//     }
// });


UserRoute.post('/adminlogin', async (req, res) => {
  try {
    let db = getDB();
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? and password = ?',
      [username, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }

    const user = users[0];

    // Store user data in session
    req.session.user = {
      user_id: user.user_id,
      role: user.role,
      firstname: user.firstname,
      lastname: user.lastname,
      profile_image: user.profile_image
    };

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Failed to save session' });
      }
      res.status(200).json({
        message: 'Login successful',
        user: {
          user_id: user.user_id,
          role: user.role,
          firstname: user.firstname,
          lastname: user.lastname,
          profile_image: user.profile_image, // Include in response
        },
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ err: 'Internal server error' });
  }
});

UserRoute.get('/profile', async (req, res) => {
    let db = getDB();
    try {
        // Step 1: Get and decode the cookie
        // const rawUserCookie = req.cookies.user;

        // if (!rawUserCookie) {
        //     return res.status(401).json({ error: 'User not authenticated (no cookie)' });
        // }

        // const decodedUserCookie = decodeURIComponent(rawUserCookie);
        // const userData = JSON.parse(decodedUserCookie);

        // // Step 2: Validate user ID from cookie
        // if (!userData.user_id || isNaN(userData.user_id)) {
        //     return res.status(400).json({ error: 'Invalid user ID in cookie' });
        // }

        const sessionUser = req.session.user;

        if (!sessionUser || !sessionUser.user_id) {
            return res.status(401).json({ error: 'Please login to submit application.' });
        }

        console.log('Authenticated user ID:', sessionUser.user_id);

        // Step 3: Query the database
        const [userprofile] = await db.query(
            `SELECT 
                user_id, firstname, lastname, profile_image, contactnumber,
                DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
                email, username, role, badge, address,
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
                DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
            FROM users
            WHERE user_id = ?;`,
            [sessionUser.user_id]
        );

        // Step 4: Handle if user not found
        if (!userprofile.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Step 5: Return user profile
        return res.json(userprofile[0]);

    } catch (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

UserRoute.post("/logout", (req, res) => {
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

UserRoute.patch('/profile/update', upload.single('profile_image'), async (req, res) => {
    const db = getDB();
    const {
        firstname = '',
        lastname = '',
        address = '',
        email = '',
        birthday = '',
        profile_image = '',  // assume this is the new filename
        old_image = ''       // send this from frontend when uploading new image
    } = req.body;

    const newImage = req.file ? req.file.filename : null;
    try {
        // const rawUserCookie = req.cookies.user;

        // if (!rawUserCookie) {
        //     return res.status(401).json({ error: 'User not authenticated (no cookie)' });
        // }

        // const decodedUserCookie = decodeURIComponent(rawUserCookie);
        // const userData = JSON.parse(decodedUserCookie);

        // if (!userData.user_id || isNaN(userData.user_id)) {
        //     return res.status(400).json({ error: 'Invalid user ID in cookie' });
        // }

        // 1. Remove old image if new one is uploaded
        // if (newImage && old_image && old_image !== newImage) {
        //     const filePath = path.join(__dirname, 'FileUploads', old_image);
        //     fs.unlink(filePath, (err) => {
        //         if (err && err.code !== 'ENOENT') {
        //         console.error(`Error deleting file: ${old_image}`, err);
        //         }
        //     });
        // }

        const sessionUser = req.session.user;

        if (!sessionUser || !sessionUser.user_id) {
            console.log('No session user found');
            return res.status(401).json({ error: 'User not authenticated (no session)' });
        }

        console.log('Updating profile for user ID:', sessionUser.user_id);

        // 1. Remove old image if a new one is uploaded
        if (newImage && old_image && old_image !== newImage) {
            const filePath = path.join(__dirname, 'FileUploads', old_image);
            try {
                fs.unlink(filePath);
                console.log(`Deleted old image: ${old_image}`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                console.error(`Error deleting file: ${old_image}`, err);
                }
            }
        }

        // 2. Update user info
        const [update] = await db.query(`
            UPDATE users SET
                firstname = ?,
                lastname = ?,
                address = ?,
                email = ?,
                birthday = ?,
                profile_image = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?`,
            [
                firstname, 
                lastname, 
                address, 
                email, 
                birthday, 
                newImage || old_image, 
                sessionUser.user_id
            ]
        );

        if (update.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [updatedProfile] = await db.query(
            `
            SELECT 
                user_id, firstname, lastname, profile_image, contactnumber,
                DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday,
                email, username, role, badge, address,
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
                DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
            FROM users
            WHERE user_id = ?`,
            [sessionUser.user_id]
        );

        if (!updatedProfile.length) {
        return res.status(404).json({ error: 'User not found after update' });
        }

        return res.status(200).json({
            message: 'User profile updated successfully!',
            profile_image: newImage || old_image  // return updated image filename
        });

    } catch (err) {
        console.error('Error updating user profile: ', err);
        return res.status(500).json({ error: 'Failed to update profile.' });
    }
});

UserRoute.post('/feeding/form', upload.single('file'), async (req, res) => {
    const db = getDB();
    const { user_id } = req.body;
    const file = req.file;

    try {
        if (!file || !user_id) {
            return res.status(400).json({error: 'Missing data'});
        }

        const [existing] = await db.query(`
            SELECT * FROM volunteer_application
            WHERE user_id = ? AND status = 'Pending'    
        `, [user_id]);

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'You already have a pending application. Please wait for it to be reviewed before submitting again.',
            });
        }

        const [activeVolunteer] = await db.query(`
            SELECT * FROM volunteer
            WHERE feeder_id = ? 
                AND status = 'Approved'
                AND feeding_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        `, [user_id]);

        if (activeVolunteer.length > 0) {
            return res.status(409).json({
                error: 'You already have an approved volunteer application. Please wait until it expires before applying again.',
                
            });
        }

        const feeding_form = file.filename;
        await db.query(`
            INSERT INTO volunteer_application
                (user_id, application_form)
                VALUES (?, ?)`,
                [user_id, feeding_form]
            );

        return res.json({ message: 'File uploaded and DB updated successfully.' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ err: 'Internal server error' });
    } 
})





export default UserRoute;