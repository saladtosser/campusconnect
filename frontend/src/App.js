import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layout components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Public pages
import Home from './pages/Home';
import EventList from './pages/events/EventList';
import EventDetail from './pages/events/EventDetail';

// User pages
import Profile from './pages/user/Profile';
import MyRegistrations from './pages/user/MyRegistrations';
import QRCode from './pages/user/QRCode';
import AttendanceConfirmation from './pages/user/AttendanceConfirmation';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import AdminEventList from './pages/admin/events/EventList';
import AdminEventDetail from './pages/admin/events/EventDetail';
import AdminEventForm from './pages/admin/events/EventForm';
import AdminUserList from './pages/admin/users/UserList';
import AdminUserDetail from './pages/admin/users/UserDetail';
import AdminRegistrationList from './pages/admin/registrations/RegistrationList';
import CheckInScanner from './pages/admin/registrations/CheckInScanner';
import EventQRCode from './pages/admin/EventQRCode';
import EventAttendees from './pages/admin/events/EventAttendees';

// Not found page
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="events" element={<EventList />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />} />
          <Route path="my-registrations" element={<MyRegistrations />} />
          <Route path="registrations/:id/qr-code" element={<QRCode />} />
          <Route path="confirm-attendance" element={<AttendanceConfirmation />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin/dashboard" element={<Dashboard />} />
          <Route path="admin/events" element={<AdminEventList />} />
          <Route path="admin/events/new" element={<AdminEventForm />} />
          <Route path="admin/events/:id" element={<AdminEventDetail />} />
          <Route path="admin/events/:id/edit" element={<AdminEventForm />} />
          <Route path="admin/events/:id/qr-code" element={<EventQRCode />} />
          <Route path="admin/events/:id/attendees" element={<EventAttendees />} />
          <Route path="admin/users" element={<AdminUserList />} />
          <Route path="admin/users/:id" element={<AdminUserDetail />} />
          <Route path="admin/registrations" element={<AdminRegistrationList />} />
          <Route path="admin/check-in" element={<CheckInScanner />} />
        </Route>

        {/* Not found route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App; 