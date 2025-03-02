import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getEventById, generateEventQRCode } from '../../store/slices/eventSlice';
import QRCode from 'qrcode.react';

const EventQRCode = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrError, setQrError] = useState('');
  
  const { event, isLoading, error } = useSelector((state) => state.events);
  
  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (event && event.qr_code) {
      setQrGenerated(true);
    } else {
      setQrGenerated(false);
    }
  }, [event]);
  
  const handleGenerateQRCode = () => {
    setQrError('');
    dispatch(generateEventQRCode(id))
      .unwrap()
      .then(() => {
        setQrGenerated(true);
      })
      .catch((error) => {
        setQrError(error);
      });
  };
  
  const handleDownloadQRCode = () => {
    const canvas = document.getElementById('event-qr-code');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `event-${event.id}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };
  
  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (!event) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          Event not found. Please try again.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/events')}
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Event QR Code
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/admin/events/${id}`)}
          >
            Back to Event
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {qrError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {qrError}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center'
              }}
            >
              {qrGenerated && event.qr_code ? (
                <>
                  <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <QRCode
                      id="event-qr-code"
                      value={event.qr_code}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                    Generated: {new Date(event.qr_code_generated_at).toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleGenerateQRCode}
                    >
                      Regenerate
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadQRCode}
                    >
                      Download
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <QrCodeIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" gutterBottom>
                    No QR code has been generated for this event yet.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<QrCodeIcon />}
                    onClick={handleGenerateQRCode}
                    sx={{ mt: 2 }}
                  >
                    Generate QR Code
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" paragraph>
                This QR code is used for attendees to confirm their attendance at the event.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>How it works:</strong>
              </Typography>
              <Typography component="div" variant="body2">
                <ol>
                  <li>Display this QR code at the event entrance or share it with attendees.</li>
                  <li>Registered attendees can scan this QR code using the CampusConnect app.</li>
                  <li>Guest users will need to enter their unique attendance code instead.</li>
                  <li>Attendance is automatically recorded in the system.</li>
                </ol>
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Note:</strong> You can regenerate the QR code if needed, but this will invalidate the previous code.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default EventQRCode; 