import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import { fetchEvents } from '../../store/slices/eventSlice';
import { fetchUsers } from '../../store/slices/userSlice';
import { fetchRegistrations } from '../../store/slices/registrationSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);
  const { registrations, loading: registrationsLoading, error: registrationsError } = useSelector(
    (state) => state.registrations
  );

  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    checkedInRegistrations: 0,
  });

  useEffect(() => {
    dispatch(fetchEvents({ admin: true }));
    dispatch(fetchUsers());
    dispatch(fetchRegistrations({ admin: true }));
  }, [dispatch]);

  useEffect(() => {
    if (events && users && registrations) {
      const now = new Date();
      
      setStats({
        totalEvents: events.length,
        upcomingEvents: events.filter(event => new Date(event.start_time) > now).length,
        totalUsers: users.length,
        totalRegistrations: registrations.length,
        checkedInRegistrations: registrations.filter(reg => reg.status === 'checked_in').length,
      });
    }
  }, [events, users, registrations]);

  const isLoading = eventsLoading || usersLoading || registrationsLoading;
  const hasError = eventsError || usersError || registrationsError;

  if (isLoading) {
    return <Loading text="Loading dashboard data..." />;
  }

  if (hasError) {
    return (
      <Alert
        type="error"
        title="Error loading dashboard"
        message="There was an error loading the dashboard data. Please try again later."
      />
    );
  }

  // Get recent events (last 5)
  const recentEvents = [...(events || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Get recent registrations (last 5)
  const recentRegistrations = [...(registrations || [])]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button to="/admin/events/new" variant="primary">
            Create Event
          </Button>
          <Button to="/admin/check-in" variant="secondary">
            Check-In Scanner
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary-50 border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-800">Events</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-3xl font-bold text-primary-600">{stats.totalEvents}</p>
                <p className="ml-2 text-sm text-primary-500">
                  ({stats.upcomingEvents} upcoming)
                </p>
              </div>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Button to="/admin/events" variant="outline" size="sm" fullWidth>
              View All Events
            </Button>
          </div>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-secondary-800">Users</h3>
              <div className="mt-1">
                <p className="text-3xl font-bold text-secondary-600">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Button to="/admin/users" variant="outline" size="sm" fullWidth>
              View All Users
            </Button>
          </div>
        </Card>

        <Card className="bg-green-50 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-800">Registrations</h3>
              <div className="mt-1 flex items-baseline">
                <p className="text-3xl font-bold text-green-600">{stats.totalRegistrations}</p>
                <p className="ml-2 text-sm text-green-500">
                  ({stats.checkedInRegistrations} checked in)
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Button to="/admin/registrations" variant="outline" size="sm" fullWidth>
              View All Registrations
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card title="Recent Events">
          {recentEvents.length > 0 ? (
            <div className="divide-y">
              {recentEvents.map((event) => (
                <div key={event.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <Link
                      to={`/admin/events/${event.id}/edit`}
                      className="text-primary-600 hover:text-primary-800 text-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No events found</p>
          )}
        </Card>

        {/* Recent Registrations */}
        <Card title="Recent Registrations">
          {recentRegistrations.length > 0 ? (
            <div className="divide-y">
              {recentRegistrations.map((registration) => (
                <div key={registration.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {registration.admin_user.name} 
                        <span className="ml-1 text-sm text-gray-500">
                          ({registration.admin_user.email})
                        </span>
                      </h4>
                      <p className="text-sm text-gray-500">
                        Registered for: {registration.event.name}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          registration.status === 'checked_in'
                            ? 'bg-green-100 text-green-800'
                            : registration.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {registration.status === 'checked_in'
                          ? 'Checked In'
                          : registration.status === 'cancelled'
                          ? 'Cancelled'
                          : 'Registered'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No registrations found</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 