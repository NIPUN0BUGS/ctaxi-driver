const express = require('express');
const cors = require('cors');
const mysql = require('mysql'); // Or use another database if needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password
  database: 'taxidb' // Add your database name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

// API route for driver login
app.post('/login', (req, res) => {
  const { vehicleLicencePlate, driverPassword } = req.body;

  const query = 'SELECT * FROM drivers WHERE vehicleLicencePlate = ? AND driverPassword = ?';
  db.query(query, [vehicleLicencePlate, driverPassword], (err, result) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (result.length > 0) {
      return res.json(result[0]); // Ensure profilePhoto is included in the response
    } else {
      return res.status(401).send('Invalid credentials');
    }
  });
});



// API route to update driver availability status
app.put('/drivers/:id/status', (req, res) => {
  const driverId = req.params.id;
  const { driverAvailability } = req.body;
  db.query('UPDATE drivers SET driverAvailability = ? WHERE id = ?', [driverAvailability, driverId], (err) => {
    if (err) {
      return res.status(500).send('Error updating driver status');
    }
    res.send('Driver status updated');
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
