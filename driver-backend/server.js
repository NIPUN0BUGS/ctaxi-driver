const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const path = require('path'); // Import path for serving static files

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

// Serve static files (driver photos)
app.use('/uploads/driverPhotos', express.static(path.join(__dirname, 'uploads/driverPhotos')));

// API route for driver login
app.post('/login', (req, res) => {
  const { vehicleLicencePlate, driverPassword } = req.body;

  if (!vehicleLicencePlate || !driverPassword) {
    return res.status(400).send('Missing vehicle license plate or password');
  }

  const query = 'SELECT * FROM drivers WHERE vehicleLicencePlate = ? AND driverPassword = ?';
  db.query(query, [vehicleLicencePlate, driverPassword], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Server error');
    }

    if (result.length > 0) {
      const driverData = result[0];
      return res.json(driverData); // Ensure profilePhoto and all fields are returned
    } else {
      return res.status(401).send('Invalid credentials');
    }
  });
});

// API route to update driver availability status
app.put('/drivers/:id/status', (req, res) => {
  const driverId = req.params.id;
  const { driverAvailability } = req.body;

  if (driverAvailability === undefined) {
    return res.status(400).send('Missing driver availability status');
  }

  db.query('UPDATE drivers SET driverAvailability = ? WHERE id = ?', [driverAvailability, driverId], (err) => {
    if (err) {
      console.error('Error updating driver status:', err);
      return res.status(500).send('Error updating driver status');
    }
    res.send('Driver status updated successfully');
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
