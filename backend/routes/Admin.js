import express from "express";
import cors from "cors";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';

import multer from 'multer';
import fs, { stat } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const AdminRoute = Router();
AdminRoute.use(express.json());

AdminRoute.use(
    cors({ origin: "http://localhost:5173",
        credentials: true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }), 
);

AdminRoute.use(
  cors({
    origin: [/http:\/\/localhost:\d+$/], // allow any localhost:port
    // credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


AdminRoute.use(cookieParser());
AdminRoute.use('/FileUploads', express.static(path.join(__dirname, 'FileUploads')));


const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    const dir = 'FileUploads';
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    callback(null, dir);
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname))
  } 
})

const fileFilter = function(req, file, callback) {
  if (file.mimetype == 'application/pdf') {
    callback(null, true)
  } else {
    req.err = 'File is invalid!'
    callback(null, false)
  }
}

const uploadImages = multer({
  storage,
  fileFilter: function(req, file, callback) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      callback(null, true)
    } else {
      !req.invalidFiles ? req.invalidFiles = [file.originalname] : req.invalidFiles.push(file.originalname)
      callback(null, false)
    }
  }
});

const upload = multer({ storage, fileFilter });


AdminRoute.get('/manage/users', async (req, res) => {
    const db = getDB();
    try {
        const [users] = await db.query("SELECT * FROM users WHERE role IN ('regular','head_volunteer', 'admin')");
        return res.json(users);

    } catch(err) {
        console.error('Error fetching user profiles:', err);
        return res.status(500).json({ err: 'Failed to fetch user list.' });
    }
});

AdminRoute.get('/manage/adminlist', async (req, res) => {
    const db = getDB();
    try {
        const [admin] = await db.query(
        "SELECT user_id, firstname, lastname, email, DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login FROM users WHERE role = 'admin'")

        return res.json(admin)

    } catch(err) {
        console.error('Error fetching admin profiles: ', err);
        return res.status(500).json({err: 'Failed to fetch admin list.'})
    }
})

AdminRoute.get('/manage/non_admin', async (req, res) => {
    const db = getDB();
    try {
        const [admin] = await db.query(
        "SELECT user_id, firstname, lastname, email FROM users WHERE role NOT IN ('admin')")
        return res.json(admin)
    } catch(err) {
        console.error('Error fetching user profiles: ', err);
        return res.status(500).json({err: 'Failed to fetch admin list.'})
    }
})


AdminRoute.patch('/manage/userupdate/:user_id' , async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;
    const {
        firstname = '',
        lastname = '',
        role = '',
        email = '',
        contactnumber = '',
        birthday = '',
        address = '',
    } = req.body

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
        [firstname, lastname, role, email, contactnumber, birthday, address, user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'User not found!'});
        }

        res.status(200).json({ message: 'User updated successfully' });

    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})


// GET REQUEST: FETCHES THE USER DATA FOR ROLE UPDATE
AdminRoute.get('/manage/role/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;

    try {
        const [role] = await db.query(`SELECT firstname, lastname, email, role FROM users WHERE user_id = ?`, [user_id]);
        
        return res.json(role[0])
    } catch (err) {
        console.error('Error fetching user: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
});

// PATCH REQUEST: UPDATE THE ROLE OF A USER INTO ADMIN/HEAD VOLUNTEER/REGULAR
AdminRoute.patch('/manage/update/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id;
    const {
        firstname = '',
        lastname = '',
        email = '',
        role = ''
    } = req.body

    try {
        const [update] = await db.query(`
            UPDATE users SET
                firstname = ?, 
                lastname = ?,
                email = ?,
                role = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?`,
            [firstname, lastname, email, role, user_id]);

            if (update.affectedRows === 0) {
                return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated successfully!' });

        console.log(update)
    } catch (err) {
        console.error('Error updating user role: ', err);
        return res.status(500).json({err: 'Failed to update role.'})
    }
});

AdminRoute.patch('/manage/update_admin', async (req, res) => {
    const db = getDB();
    const {user_id} = req.body
    try {
        const query = await db.query(` 
            UPDATE users SET role = 'admin' WHERE user_id = ?
        `, [user_id])

        return res.json({ success: true, result: query });

    } catch (err) {
        return res.status(500).json({err: 'Failed to update user role to admin!'})
    }
});


AdminRoute.get('/manage/userprofile/:user_id', async (req, res) => {
    const db = getDB();
    const user_id = req.params.user_id 

    try {
        const [userprofile] = await db.query(
            `SELECT 
                user_id, firstname, lastname, profile_image, contactnumber, DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, email, username, role, badge, address, 
                DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at, DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at 
            FROM users
            WHERE user_id = ?;`, [user_id]
        );
        return res.json(userprofile[0])
    } catch(err) {
        console.error('Error fetching user data: ', err);
        return res.status(500).json({err: 'Failed to fetch user data.'});
    }
});


AdminRoute.get('/feeders/application', async (req, res) => {
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

        return res.json(applications)
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
});

AdminRoute.get('/form/:application_id', async (req, res) => {
    const db = getDB();
    const application_id = req.params.application_id;

    try {
        const [application] = await db.query(`
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
        `, [application_id]);

        return res.json(application[0]);
    } catch (err) {
        console.error('Error fetching application data: ', err)
        res.status(500).json({error: 'Internal Server failed!'})
    }
})


AdminRoute.patch('/form/status_update/:application_id', async (req, res) => {
    const db = getDB();
    const application_id = req.params.application_id;
    const { status } = req.body;

    console.log('Incoming PATCH request');
    console.log('Application ID:', application_id);
    console.log('Status:', status);

    try {
        const [statusupdate] = await db.query(`
            UPDATE volunteer_application SET
                status = ? 
            WHERE application_id = ?
        `, [status, application_id]);

        if (status === 'Accepted') {
            // 2.1 Get user info linked to this application
            const [userData] = await db.query(`
                SELECT va.user_id, u.firstname, u.lastname, va.application_date
                FROM volunteer_application va
                JOIN users u ON va.user_id = u.user_id
                WHERE va.application_id = ?
            `, [application_id]);

            if (userData.length === 0) {
                return res.status(404).json({ error: 'User not found for this application' });
            }

            const { user_id, firstname, lastname, application_date } = userData[0];
            const fullName = `${firstname} ${lastname}`;

            // 2.2 Insert into volunteer table
            await db.query(`
                INSERT INTO volunteer (feeder_id, name, feeding_date, application_date, status)
                VALUES (?, ?, NOW(), ?, 'Approved')
            `, [user_id, fullName, application_date]);

            console.log('Volunteer record created for user_id:', user_id);
            console.log('User Info:', { user_id, firstname, lastname, application_date });

        } 

        console.log('Status received:', status);
        return res.json({ success: true, result: statusupdate});
    } catch (err) {
        return res.status(500).json({err: 'Failed to update status!'})
    }
});



AdminRoute.get('/feeders', async (req, res) => {
    const db = getDB();

    try {
        const [volunteers] = await db.query(`
            SELECT v.feeder_id, u.firstname, u.lastname, u.contactnumber, 
                DATE_FORMAT(v.feeding_date, '%Y-%m-%d') AS feeding_date, v.status
            FROM volunteer v
            JOIN users u ON v.feeder_id = u.user_id
            WHERE v.status = 'Approved';
        `);

        return res.json(volunteers);
    } catch (err) {
        return res.status(500).json({err: 'Failed to retrieve volunteers!'})
    }
})




export default AdminRoute;