import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import QrCodeIcon from '@mui/icons-material/QrCode';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'admin';
  
  const userMenuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
    {
      title: 'Events',
      path: '/events',
      icon: <EventIcon />,
    },
    {
      title: 'My Registrations',
      path: '/my-registrations',
      icon: <QrCodeIcon />,
    },
    {
      title: 'Confirm Attendance',
      path: '/confirm-attendance',
      icon: <QrCodeScannerIcon />,
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: <PersonIcon />,
    },
  ];
  
  const adminMenuItems = [
    {
      title: 'Admin Dashboard',
      path: '/admin/dashboard',
      icon: <AdminPanelSettingsIcon />,
    },
    {
      title: 'Manage Events',
      path: '/admin/events',
      icon: <EventIcon />,
    },
    {
      title: 'Manage Users',
      path: '/admin/users',
      icon: <PeopleIcon />,
    },
    {
      title: 'Manage Registrations',
      path: '/admin/registrations',
      icon: <QrCodeIcon />,
    },
    {
      title: 'Settings',
      path: '/admin/settings',
      icon: <SettingsIcon />,
    },
  ];
  
  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          CampusConnect
        </Typography>
      </Box>
      <Divider />
      <List>
        {userMenuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      {isAdmin && (
        <>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Admin
            </Typography>
          </Box>
          <List>
            {adminMenuItems.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
  
  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar; 