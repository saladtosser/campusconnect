import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getEventById } from '../../../store/slices/eventSlice';
import { getEventRegistrations } from '../../../store/slices/registrationSlice';
import { format } from 'date-fns';

const EventAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  
  const { event, isLoading: eventLoading } = useSelector((state) => state.events);
  const { registrations, isLoading: registrationsLoading } = useSelector((state) => state.registrations);
  
  useEffect(() => {
    if (id) {
      dispatch(getEventById(id));
      dispatch(getEventRegistrations(id));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (registrations) {
      setFilteredRegistrations(
        registrations.filter((reg) => {
          const searchLower = searchTerm.toLowerCase();
          const userEmail = reg.admin_user?.email?.toLowerCase() || '';
          const userName = reg.admin_user?.name?.toLowerCase() || '';
          
          return (
            userEmail.includes(searchLower) ||
            userName.includes(searchLower) ||
            reg.attendance_code?.toLowerCase().includes(searchLower)
          );
        })
      );
    }
  }, [registrations, searchTerm]);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'primary';
      case 'checked_in':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (error) {
      return dateString;
    }
  };
  
  const isLoading = eventLoading || registrationsLoading;
  
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (!event) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          Event not found.
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
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Event Attendees
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
            {event.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {new Date(event.start_time).toLocaleDateString()} at {format(new Date(event.start_time), 'p')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: {event.location}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email or attendance code"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h5">{registrations?.length || 0}</Typography>
              <Typography variant="body2">Total Registrations</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h5">
                {registrations?.filter(r => r.status === 'checked_in').length || 0}
              </Typography>
              <Typography variant="body2">Checked In</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h5">
                {registrations?.filter(r => r.status === 'registered').length || 0}
              </Typography>
              <Typography variant="body2">Registered</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="h5">
                {registrations?.filter(r => r.status === 'cancelled').length || 0}
              </Typography>
              <Typography variant="body2">Cancelled</Typography>
            </Box>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Attendee</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Registered On</TableCell>
                <TableCell>Checked In</TableCell>
                <TableCell>Attendance Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {registration.admin_user?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {registration.admin_user?.email || 'N/A'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={registration.admin_user?.role || 'N/A'} 
                        color={registration.admin_user?.role === 'guest' ? 'secondary' : 'primary'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        size="small" 
                        label={registration.status} 
                        color={getStatusColor(registration.status)}
                      />
                    </TableCell>
                    <TableCell>{formatDate(registration.created_at)}</TableCell>
                    <TableCell>
                      {registration.checked_in_at 
                        ? formatDate(registration.checked_in_at) 
                        : registration.status === 'cancelled'
                          ? 'Cancelled'
                          : 'Not checked in'
                      }
                    </TableCell>
                    <TableCell>
                      {registration.attendance_code || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    {searchTerm 
                      ? 'No attendees match your search.'
                      : 'No attendees for this event yet.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default EventAttendees; 