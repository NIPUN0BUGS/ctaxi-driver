import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
} from '@mui/material';
import { Alert } from '@mui/material';

const DriverLogin = () => {
  const [vehicleLicencePlate, setVehicleLicencePlate] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleLicencePlate || !driverPassword) {
      setError(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleLicencePlate, driverPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/driver-ui', { state: { driverData: data } });
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      width: '100%',
      background: '#f4f6f8' // Optional background color for the full height
    }}>
      <Paper elevation={3} style={{ padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90%', maxWidth: '400px' }}>
        <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
          Driver Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Vehicle Licence Plate"
            variant="outlined"
            fullWidth
            margin="normal"
            value={vehicleLicencePlate}
            onChange={(e) => setVehicleLicencePlate(e.target.value)}
            required
          />
          <TextField
            label="Driver Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={driverPassword}
            onChange={(e) => setDriverPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
          >
            Login
          </Button>
        </form>
      </Paper>

      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
          Invalid login credentials!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DriverLogin;
