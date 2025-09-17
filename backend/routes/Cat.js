import express from "express";
import { Router } from "express";
import {getDB} from "../database.js"

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CatRoute = Router();
CatRoute.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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



CatRoute.post('/create', async (req, res) => {
  try {
    const db =  getDB();
    const { name, age, gender, sterilization_status, description } = req.body;
    
    const [profile] = await db.query(
      `INSERT INTO cat (name, age, gender, sterilization_status, description) 
      VALUES ( ?, ?, ?, ?, ?)`,
      [name, age, gender, sterilization_status, description]
    );

    res.status(200).json({
      message: 'Cat profile created!',
      cat_id: profile.insertId,

      
    });

    console.log(res.status)

  } catch(err) {
      console.error('There was an error creating cat profile: ', err);
      res.status(500).json({ err: 'Internal server error' });
  }
})

CatRoute.get('/list', async (req, res) => {
    try {
    const db =  getDB();
      const [rows] = await db.query('SELECT * FROM cat')
      return res.json(rows)
    } catch(err) {
      console.error('Error fetching cat profiles:', err);
      return res.status(500).json({ err: 'Failed to fetch cat profiles' });    
    }
})

// Client Side fetching
CatRoute.get('/catlist', async (req, res) => {
    const db = getDB();
    try{  
        const [rows] = await db.query(`
        SELECT 
          c.cat_id, 
          c.name, 
          c.gender, 
          c.age, 
          c.description, 
          c.adoption_status,
          ci.image_filename AS thumbnail
        FROM Cat c
        LEFT JOIN cat_images ci ON c.cat_id = ci.cat_id 
        AND ci.image_id = (
          SELECT image_id 
          FROM cat_images
          WHERE cat_id = c.cat_id
          ORDER BY is_primary DESC, uploaded_at DESC 
          LIMIT 1
        )
        WHERE c.adoption_status = 'Available';
        `)

        return res.json(rows);

    } catch(err) {
        console.error('Error fetching cat profiles:', err);
        return res.status(500).json({ err: 'Failed to fetch cat profiles' });   
    }
})

CatRoute.get('/catprofile/:cat_id', async (req, res) => {
  const cat_id = req.params.cat_id;

  try {
    const db = getDB()
    const [rows] = await db.query(
      `SELECT 
        cat_id, name, age, gender, sterilization_status, adoption_status, description,
        DATE_FORMAT(date_created, '%Y-%m-%d') AS date_created,
        DATE_FORMAT(date_updated, '%Y-%m-%d') AS date_updated
        FROM cat WHERE cat_id = ?`,
      [cat_id]
    );
    console.log(rows[0])
    return res.json(rows[0]); // Return the first (and only) row
    
  } catch (err) {
    console.error('Error fetching cat profile:', err);
    return res.status(500).json({ error: 'Failed to fetch cat profile' });
  }
});

CatRoute.post('/catimage/:cat_id', async (req, res) => {
    const db = getDB();
  const cat_id = req.params.cat_id;
  const { images } = req.body;

   if (!Array.isArray(images)) {
    return res.status(400).json({ message: 'Images must be an array' });
  }

  try {
    const values = images.map(base64Str => {
      const buffer = Buffer.from(base64Str.split(',')[1], 'base64');
      return [cat_id, buffer]
    })

    const [rows] = await db.query(
      `INSERT INTO cat_images (cat_id, image) VALUES ?`,
      [values]
    );

    res.status(200).json({ message: 'Images uploaded successfully' });
  } catch(err) {
      console.error('DB Error:', err);
      res.status(500).json({ message: 'Server error' });
  }
});

CatRoute.get('/image/:cat_id', async (req, res) => {
    const db = getDB();
  const cat_id = req.params.cat_id;

  try {
    const [images] = await db.query(
      `SELECT image_filename FROM cat_images WHERE cat_id = ?`,
      [cat_id]
    );  

    const filenames = images.map(img => img.image_filename)

    res.json(filenames);
    console.log(filenames)
  } catch(err) {
    console.error('Error fetching cat images: ', err);
    return res.status(500).json({error: 'Failed to fetch cat images'})
  }
})


CatRoute.post('/uploadcatimages/:cat_id', uploadImages.array('images'), async (req, res) => {
    console.log(req.files)
    const db = getDB();
    
    if (req.invalidFiles) {
        return res.status(200).json({
            warning: true,
            message: 'Some documents did not upload due to invalid file type: ' + req.invalidFiles.join(', '),
        }) 
    }

    if (!req.files || req.files.length === 0) {
            return res.status(200).json({
                warning: true,
                message: 'No valid Images were uploaded.',
        });
    }

    const cat_id = req.params.cat_id

    try {
        for (const file of req.files) {
        const filename = file.filename;

        await db.query(
            `INSERT INTO cat_images (cat_id, image_filename) VALUES (?, ?)`, 
            [cat_id, filename]
        );
        }

        return res.status(200).json({ 
            warning: false, 
            message: 'Images uploaded succesfully!',
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({message: 'Database error while saving image info!'})
    }
});

CatRoute.delete('/image/:filename', async (req, res) => {
    const db = getDB();
    const filename = req.params.filename;

    try {
        const filePath = path.join(__dirname, 'FileUploads', filename);

        // Delete the file
        fs.unlink(filePath, async (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error(`Error deleting file: ${filename}`, err);
            return res.status(500).json({ error: 'Failed to delete image file' });
        }

        // Delete DB record
        await db.query(`DELETE FROM cat_images WHERE image_filename = ?`, [filename]);

        res.json({ message: `Deleted image ${filename}` });
        console.log({ message: `Deleted image ${filename}` })
        });

    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});


CatRoute.patch('/update/:cat_id', async (req, res) => {
    const db = getDB();
    const cat_id = req.params.cat_id;
    const {
        name = '',
        gender = '',
        age = '',
        adoption_status = '',
        sterilization_status = '',
        description = ''
    } = req.body; 

    console.log("REQ.BODY:", req.body);
    console.log("REQ.PARAMS:", req.params);

    try {
        const [result] = await db.query(
            `UPDATE cat SET
                name = ?,
                gender = ?,
                age = ?,
                adoption_status = ?,
                sterilization_status = ?,
                description = ?,
                date_updated = CURRENT_TIMESTAMP
            WHERE cat_id = ?`,
            [name, gender, age, adoption_status, sterilization_status, description, cat_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cat not found' });
        }

        if (!name || !gender || !age || !adoption_status || !sterilization_status) {
            return res.status(400).json({ error: 'All fields must be filled out' });
        }

        res.status(200).json({ message: 'Cat updated successfully' });
    } catch(err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


CatRoute.get('/image/:cat_id', async (req, res) => {
    const db = getDB();
    const cat_id = req.params.cat_id;

    try {
        const [images] = await db.query(
            `SELECT image_filename FROM cat_images WHERE cat_id = ?`,
            [cat_id]
        );  

        const filenames = images.map(img => img.image_filename)

        res.json(filenames);
        console.log(filenames)
    } catch(err) {
        console.error('Error fetching cat images: ', err);
        return res.status(500).json({error: 'Failed to fetch cat images'})
    }
})

export default CatRoute;