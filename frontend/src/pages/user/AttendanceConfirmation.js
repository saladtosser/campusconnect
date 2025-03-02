import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { QrReader } from 'react-qr-reader';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { confirmAttendance } from '../../store/slices/registrationSlice';
import { resetEventState } from '../../store/slices/eventSlice';
import { resetRegistrationState } from '../../store/slices/registrationSlice';

const AttendanceConfirmation = () => {
  const [scanning, setScanning] = useState(false);
  const [attendanceCode, setAttendanceCode] = useState('');
  const [scanData, setScanData] = useState('');
  const [scanError, setScanError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { isLoading, error, currentRegistration } = useSelector((state) => state.registrations);
  
  useEffect(() => {
    // Reset states when component mounts
    dispatch(resetEventState());
    dispatch(resetRegistrationState());
    
    return () => {
      // Reset states when component unmounts
      dispatch(resetEventState());
      dispatch(resetRegistrationState());
    };
  }, [dispatch]);
  
  const handleScan = (data) => {
    if (data) {
      setScanData(data?.text || data);
      setScanning(false);
      
      // Submit the scanned QR code
      handleSubmit(data?.text || data);
    }
  };
  
  const handleError = (err) => {
    console.error(err);
    setScanError('Error scanning QR code. Please try again.');
    setScanning(false);
  };
  
  const handleSubmit = (eventQRCode = null) => {
    const qrCode = eventQRCode || scanData;
    
    if (!qrCode && !attendanceCode) {
      setScanError('Please scan a QR code or enter an attendance code.');
      return;
    }
    
    // Dispatch action to confirm attendance
    dispatch(confirmAttendance({ 
      eventQRCode: qrCode, 
      attendanceCode: attendanceCode 
    }))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setScanError('');
        // Clear form
        setScanData('');
        setAttendanceCode('');
      })
      .catch((error) => {
        setScanError(error);
        setSuccess(false);
      });
  };
  
  const resetScanner = () => {
    setScanData('');
    setScanError('');
    setSuccess(false);
    setScanning(true);
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Confirm Event Attendance
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Attendance Confirmed!
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Your attendance has been successfully recorded.
            </Typography>
            {currentRegistration && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Event: {currentRegistration.event_name}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(currentRegistration.event_date).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            <Button 
              variant="contained" 
              sx={{ mt: 3 }} 
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </Box>
        ) : (
          <>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {scanning ? (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom align="center">
                      Scan Event QR Code
                    </Typography>
                    <QrReader
                      constraints={{ facingMode: 'environment' }}
                      onResult={handleScan}
                      onError={handleError}
                      style={{ width: '100%' }}
                    />
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      sx={{ mt: 2 }}
                      onClick={() => setScanning(false)}
                    >
                      Cancel Scanning
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Scan Event QR Code
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<QrCodeScannerIcon />}
                          fullWidth
                          onClick={() => setScanning(true)}
                        >
                          Start Scanning
                        </Button>
                      </Box>
                      
                      <Divider>OR</Divider>
                      
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Enter Attendance Code (Guest Users)
                        </Typography>
                        <TextField
                          label="Attendance Code"
                          variant="outlined"
                          fullWidth
                          value={attendanceCode}
                          onChange={(e) => setAttendanceCode(e.target.value)}
                          margin="normal"
                        />
                        <Button
                          variant="contained"
                          fullWidth
                          disabled={!attendanceCode}
                          onClick={() => handleSubmit()}
                          sx={{ mt: 1 }}
                        >
                          Confirm Attendance
                        </Button>
                      </Box>
                    </Stack>
                    
                    {scanData && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        QR Code scanned successfully. Confirming attendance...
                      </Alert>
                    )}
                  </Box>
                )}
                
                {scanError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {scanError}
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
              </>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AttendanceConfirmation; 