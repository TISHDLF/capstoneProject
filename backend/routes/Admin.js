import express from "express";
import { Router } from "express";
import {getDB} from "../database.js"
import cookieParser from 'cookie-parser';

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const AdminRoute = Router();
AdminRoute.use(express.json());

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

export default AdminRoute;