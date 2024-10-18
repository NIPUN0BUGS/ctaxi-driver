import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Switch,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Divider,
  Snackbar,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Alert } from '@mui/material';

const DriverUI = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const driverData = state?.driverData;

  const [online, setOnline] = React.useState(driverData?.driverAvailability || false);
  const [callActive, setCallActive] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleStatusChange = async () => {
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
    <Box
    >
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
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar
              alt="Driver Profile"
              src={driverData?.profilePhoto || "https://via.placeholder.com/100"}
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold">{driverData?.driverName}</Typography>
              <Typography variant="body2" color="text.secondary">License: {driverData?.vehicleLicencePlate}</Typography>
              <Typography variant="body2" color="text.secondary">Contact: {driverData?.driverPhone}</Typography>
              <Typography variant="body2" color="text.secondary">Color: {driverData?.vehicleColor}</Typography>
              <Typography variant="body2" color="text.secondary">Location: {driverData?.driverLocation}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Driver Status and Call Control */}
          <Typography variant="h5" gutterBottom textAlign="center">
            Driver Dashboard
          </Typography>

          <Typography
            variant="body1"
            color={online ? 'green' : 'red'}
            sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}
          >
            Status: {online ? 'Online' : 'Offline'}
            {online ? <CheckCircleIcon sx={{ color: 'green', ml: 1 }} /> : <CancelIcon sx={{ color: 'red', ml: 1 }} />}
          </Typography>

          <Button
            variant="contained"
            color={online ? 'success' : 'error'}
            onClick={handleStatusChange}
            fullWidth
            sx={{ mb: 2, textTransform: 'none' }} // Prevent uppercase text transformation
          >
            {online ? 'Go Offline' : 'Go Online'}
          </Button>

          {/* Logout Button */}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            fullWidth
            sx={{ mt: 2 }} // Add margin top for spacing
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Snackbar for error feedback */}
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(false)}>
        <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
          Error updating driver status!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DriverUI;
