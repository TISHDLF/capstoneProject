import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import session from 'express-session';

// route
import catProfiles from './routes/cat-profiles.js'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'geloy_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' },
  })
);

// MySQL pool connection
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'whiskerwatch',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to MySQL database!');
  } catch (err) {
    console.error('Failed to connect to MySQL:', err);
    process.exit(1);
  }
}
connectDB();
const port = process.env.PORT || 5000;



// ********************** LOGIN/SIGNUP ENDPOINT ************************** //
// Signup endpoint
app.post('/users/signup', async (req, res) => {
  try {
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

// Login endpoint
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? and password = ?', [email, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ err: 'Internal server error' });
  }
});

// Login for non-basic user
app.post('/users/adminlogin', async (req, res) => {
  try {
    const { username, role, password } = req.body;

    if (!username || !role || !password) {
      return res.status(400).json({ error: 'Username, role and password are required' });
    }

    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? and role = ? and password = ?', [username, role, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    } 
     
 
    const user = users[0];

    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ err: 'Internal server error' });
  }
});

// GET REQUEST: logged-in user details by ID
app.get('/users/logged', async (req, res) => {
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


// ********************** ADMIN/ CAT ENDPOINT ************************** //

// POST REQUEST: Create cat profile
app.post('/cat/create', async (req, res) => {
  try {
    const { name, age, gender, sterilization_status, adoption_status, description } = req.body;

    if (!['Intact', 'Neutered', 'Spayed'].includes(sterilization_status)) {
      return res.status(400).json({ error: 'Invalid sterilization status' });
    }
    
    const [profile] = await db.query(
      `INSERT INTO cat (name, age, gender, sterilization_status, adoption_status, description) 
      VALUES ( ?, ?, ?, ?, ?, ?)`,
      [name, age, gender, sterilization_status, adoption_status, description]
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

// GET REQUEST: Get all the lists of cats
app.get('/list', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM cat')
      return res.json(rows)
    } catch(err) {
      console.error('Error fetching cat profiles:', err);
      return res.status(500).json({ err: 'Failed to fetch cat profiles' });    
    }
})

// GET REQUEST: Get the information for a single Cat Profile
app.get('/catprofile/:cat_id', async (req, res) => {
  const cat_id = req.params.cat_id;

  try {
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

//POST REQUEST: Upload cat Image
app.post('/catimage/:cat_id', async (req, res) => {
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

//GET REQUEST: Fetch image data per cat_id and display
app.get('/image/:cat_id', async (req, res) => {
  const cat_id = req.params.cat_id;
  try {
    const [images] = await db.query(
      `SELECT image FROM cat_images WHERE cat_id = ?`, [cat_id]
    );

    const base64Images = images.map(img => {
      return Buffer.from(img.image).toString('base64');
    });

    res.send(base64Images);

  } catch(err) {
    console.error('Error fetching cat images:', err);
    return res.status(500).json({ error: 'Failed to fetch cat Images' });
  }
})

// PATCH REQUEST: Update the cat profile 
app.patch('/cat/update/:cat_id', async (req, res) => {
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





// ********************** ADMIN/ MANAGE ENDPOINT ************************** //

// GET REQUEST: Fetch the data of all the users and display
app.get('/manage/users', async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users WHERE role IN ('regular','head_volunteer', 'admin')");
    return res.json(users);

  } catch(err) {
      console.error('Error fetching user profiles:', err);
      return res.status(500).json({ err: 'Failed to fetch user list.' });
  }
});


// GET REQUEST: Fetch the data of the users where the role = 'admin'
app.get('/manage/admin', async (req, res) => {
  try {
    const [admin] = await db.query(
      "SELECT user_id, firstname, lastname, email, DATE_FORMAT(last_login, '%Y-%m-%d') AS last_login FROM users WHERE role = 'admin'")
    return res.json(admin)
  } catch(err) {
    console.error('Error fetching user profiles: ', err);
    return res.status(500).json({err: 'Failed to fetch admin list.'})
  }
})


// ********************** CLIENT/ CAT ENDPOINT ************************** //
app.get('/catlist', async (req, res) => {
  try{  
    const [rows] = await db.query(`
      SELECT 
        c.cat_id, c.name, c.gender, c.age, c.description,
        ci.image AS thumbnail
      FROM Cat c
      LEFT JOIN cat_images ci ON c.cat_id = ci.cat_id 
      AND ci.image_id = (
        SELECT image_id 
        FROM cat_images
        WHERE cat_id = c.cat_id 
        ORDER BY is_primary DESC, uploaded_at DESC 
        LIMIT 1
      );
    `)

    const formattedRows = rows.map(row => {
      return {
        ...row,
        thumbnail: row.thumbnail ? row.thumbnail.toString('base64') : null
      };
    });

    return res.json(formattedRows)
  } catch(err) {
      console.error('Error fetching cat profiles:', err);
      return res.status(500).json({ err: 'Failed to fetch cat profiles' });   
  }
})


app.get('/manage/userprofile/:user_id', async (req, res) => {
  const user_id = req.params.user_id
  try {
    const [userprofile] = await db.query(
      `SELECT 
        user_id, firstname, lastname, contactnumber, DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, email, username, role, badge, address, 
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






// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});


