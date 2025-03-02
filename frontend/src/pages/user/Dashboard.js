import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PersonIcon from '@mui/icons-material/Person';
import { getUpcomingEvents } from '../../store/slices/eventSlice';
import { getMyRegistrations } from '../../store/slices/registrationSlice';
import Loading from '../../components/ui/Loading';
import EventCard from '../../components/events/EventCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user } = useSelector((state) => state.auth);
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { registrations, isLoading: registrationsLoading } = useSelector((state) => state.registrations);
  
  useEffect(() => {
    dispatch(getUpcomingEvents());
    dispatch(getMyRegistrations());
  }, [dispatch]);
  
  const isLoading = eventsLoading || registrationsLoading;
  
  if (isLoading) {
    return <Loading />;
  }
  
  const upcomingRegistrations = registrations?.filter(
    (reg) => new Date(reg.event_date) >= new Date() && reg.status === 'confirmed'
  ) || [];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.first_name || user?.username}!
      </Typography>
      
      <Divider sx={{ mb: 4 }} />
      
      <Grid container spacing={4}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Browse Events
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Discover upcoming events happening on campus and register for those that interest you.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EventIcon />}
              onClick={() => navigate('/events')}
              sx={{ mt: 2 }}
            >
              View Events
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                My Registrations
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage your event registrations, including upcoming and past events.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<QrCodeIcon />}
              onClick={() => navigate('/my-registrations')}
              sx={{ mt: 2 }}
            >
              View Registrations
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Confirm Attendance
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Scan an event QR code or enter your attendance code to confirm your presence at an event.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<QrCodeScannerIcon />}
              onClick={() => navigate('/confirm-attendance')}
              sx={{ mt: 2 }}
            >
              Confirm Attendance
            </Button>
          </Paper>
        </Grid>
        
        {/* Upcoming Registered Events */}
        {upcomingRegistrations.length > 0 && (
          <>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h5" gutterBottom>
                Your Upcoming Events
              </Typography>
            </Grid>
            
            {upcomingRegistrations.map((registration) => (
              <Grid item xs={12} md={6} lg={4} key={registration.id}>
                <EventCard 
                  event={{
                    id: registration.event_id,
                    title: registration.event_name,
                    date: registration.event_date,
                    time: registration.event_time,
                    location: registration.event_location,
                    description: registration.event_description,
                    capacity: registration.event_capacity,
                    registered_count: registration.event_registered_count,
                  }}
                  isRegistered={true}
                  onClick={() => navigate(`/events/${registration.event_id}`)}
                />
              </Grid>
            ))}
          </>
        )}
        
        {/* Profile Section */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h5" gutterBottom>
            Profile
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              </Grid>
              <Grid item xs>
                <Typography variant="h6">
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.is_student ? 'Student' : 'Guest User'}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 