const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/hello', (req, res) => {
  try {
    res.json({ message: 'Hello from the backend!' });
  } catch (error) {
    console.error('Error in /api/hello:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});