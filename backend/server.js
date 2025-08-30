import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import session from 'express-session';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

// Root route
app.get('/', (req, res) => {
  res.json('This is the backend.');
});

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
    res.status(500).json({ error: 'Internal server error' });
  }
});





// Get logged-in user details by ID
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




// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
