import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Snackbar,
  Grid
} from '@mui/material';
import { Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';

const DriverUI = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const driverData = state?.driverData;

  const [online, setOnline] = useState(driverData?.driverAvailability || false);
  const [error, setError] = useState(false);

  const handleStatusChange = async () => {
    if (!driverData?.id) {
      console.error('Driver data is missing.');
      return;
    }

    const newStatus = !online;
    setOnline(newStatus);

    try {
      const response = await fetch(`http://localhost:8081/drivers/${driverData.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverAvailability: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update driver status');
      }

      console.log('Driver status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      setError(true);
    }
  };

  const handleLogout = () => {
    navigate('/'); // Redirect to the login page
  };

  return (
    <Box>
      <Card
        elevation={3}
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 2,
          padding: '20px',
          background: 'linear-gradient(135deg, #ffffff, #eaeaea)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CardContent>
          {/* Driver Profile Section */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar
              alt="Driver Initial"
              sx={{
                width: 60,
                height: 60,
                mr: 2,
                backgroundColor: '#1976d2', // Customize the background color if needed
                color: '#ffffff', // Customize the text color
                fontSize: '24px', // Font size for the initial
              }}
            >
              {driverData?.driverName ? driverData.driverName.charAt(0).toUpperCase() : '?'}
            </Avatar>

            <Box>
              <Typography variant="h6" fontWeight="bold" textAlign="center" mb={1}>
                {driverData?.driverName}
              </Typography>

              <Box display="flex" flexDirection="column">
                <Box display="flex" mb={0.5}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: '75px' }}>License:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeof driverData?.vehicleLicencePlate === 'string' ? driverData?.vehicleLicencePlate : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" mb={0.5}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: '75px' }}>Contact:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeof driverData?.driverPhone === 'string' ? driverData?.driverPhone : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" mb={0.5}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: '75px' }}>Color:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeof driverData?.vehicleColor === 'string' ? driverData?.vehicleColor : 'N/A'}
                  </Typography>
                </Box>

                <Box display="flex" mb={0.5}>
                  <Typography variant="body2" fontWeight="bold" sx={{ minWidth: '75px' }}>Location:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {typeof driverData?.driverLocation === 'string' ? driverData?.driverLocation : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Driver Status and Call Control */}
          <Typography variant="h5" gutterBottom textAlign="center">
            Driver Dashboard
          </Typography>

          {/* Status in pill shape with icons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              padding: '5px 15px',
              backgroundColor: online ? '#a5f5ff' : '#ffb8c3',
              color: online ? '#0288d1' : '#d32f2f',
              borderRadius: '50px',
              fontWeight: 'bold',
            }}
          >
            {online ? (
              <>
                <CheckCircleIcon sx={{ mr: 1 }} /> Online
              </>
            ) : (
              <>
                <CancelIcon sx={{ mr: 1 }} /> Offline
              </>
            )}
          </Box>

          <Button
            variant="contained"
            color={online ? 'success' : 'error'}
            onClick={handleStatusChange}
            fullWidth
            sx={{ textTransform: 'none' }} // Prevent uppercase text transformation
          >
            {online ? 'Go Offline' : 'Go Online'}
          </Button>

          {/* Logout Button */}
          <Button
            variant="contained"
            onClick={handleLogout}
            fullWidth
            sx={{
              mt: 5, // Add margin top for spacing
              bgcolor: 'darkred'
            }}
            startIcon={<LogoutIcon />} // Adding the icon to the left of the text
          >
            Logout
          </Button>

          {/* Error Snackbar */}
          <Snackbar
            open={error}
            autoHideDuration={6000}
            onClose={() => setError(false)}
          >
            <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
              Failed to update driver status!
            </Alert>
          </Snackbar>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DriverUI;
