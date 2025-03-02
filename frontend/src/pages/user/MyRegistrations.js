import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserRegistrations, cancelRegistration } from '../../store/slices/registrationSlice';
import { format } from 'date-fns';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

// Helper function to safely format dates
const formatDate = (dateString, formatString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatString);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'Invalid date';
  }
};

const MyRegistrations = () => {
  const dispatch = useDispatch();
  const { registrations, isLoading, error } = useSelector((state) => state.registrations);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserRegistrations());
  }, [dispatch]);

  const handleCancelRegistration = (registrationId) => {
    if (window.confirm('Are you sure you want to cancel this registration?')) {
      setCancellingId(registrationId);
      setCancelSuccess(false);
      setCancelError(null);
      
      dispatch(cancelRegistration(registrationId))
        .unwrap()
        .then(() => {
          setCancelSuccess(true);
        })
        .catch((err) => {
          setCancelError(
            typeof err === 'string'
              ? err
              : 'Failed to cancel registration. Please try again.'
          );
        })
        .finally(() => {
          setCancellingId(null);
        });
    }
  };

  // Group registrations by status
  const upcomingRegistrations = registrations.filter(
    (reg) => reg.status === 'registered' && new Date(reg.event.start_time) > new Date()
  );
  
  const pastRegistrations = registrations.filter(
    (reg) => reg.status === 'registered' && new Date(reg.event.start_time) <= new Date()
  );
  
  const checkedInRegistrations = registrations.filter(
    (reg) => reg.status === 'checked_in'
  );
  
  const cancelledRegistrations = registrations.filter(
    (reg) => reg.status === 'cancelled'
  );

  if (isLoading) {
    return <Loading text="Loading your registrations..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Registrations</h1>
        <p className="text-gray-600">
          View and manage your event registrations
        </p>
      </div>

      {cancelSuccess && (
        <Alert
          type="success"
          message="Your registration has been cancelled successfully."
          className="mb-6"
          dismissible
          onDismiss={() => setCancelSuccess(false)}
        />
      )}

      {cancelError && (
        <Alert
          type="error"
          message={cancelError}
          className="mb-6"
          dismissible
          onDismiss={() => setCancelError(null)}
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          title="Error loading registrations"
          className="mb-6"
        />
      )}

      {!isLoading && registrations.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No registrations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't registered for any events yet.
            </p>
            <div className="mt-6">
              <Button to="/events">Browse Events</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Registrations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {upcomingRegistrations.length === 0 ? (
              <p className="text-gray-500">You don't have any upcoming event registrations.</p>
            ) : (
              <div className="space-y-4">
                {upcomingRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration.id}
                    registration={registration}
                    onCancel={handleCancelRegistration}
                    isCancelling={cancellingId === registration.id}
                    showCancelButton={true}
                    showQRButton={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Checked-in Registrations */}
          {checkedInRegistrations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Checked-in Events</h2>
              <div className="space-y-4">
                {checkedInRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration.id}
                    registration={registration}
                    showCheckedInBadge={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past Registrations */}
          {pastRegistrations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Past Events</h2>
              <div className="space-y-4">
                {pastRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration.id}
                    registration={registration}
                    isPast={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Cancelled Registrations */}
          {cancelledRegistrations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Cancelled Registrations</h2>
              <div className="space-y-4">
                {cancelledRegistrations.map((registration) => (
                  <RegistrationCard
                    key={registration.id}
                    registration={registration}
                    isCancelled={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RegistrationCard = ({
  registration,
  onCancel,
  isCancelling = false,
  showCancelButton = false,
  showQRButton = false,
  showCheckedInBadge = false,
  isPast = false,
  isCancelled = false,
}) => {
  const { id, event, created_at, checked_in_at } = registration;
  
  // Format dates
  const formattedEventDate = formatDate(event.start_time, 'EEEE, MMMM d, yyyy');
  const formattedEventTime = formatDate(event.start_time, 'h:mm a');
  const formattedRegistrationDate = formatDate(created_at, 'MMM d, yyyy');
  
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Event image */}
        <div className="md:w-1/4">
          <img
            src={event.background_image || 'https://via.placeholder.com/300x200?text=Event'}
            alt={event.name}
            className="w-full h-40 md:h-full object-cover"
          />
        </div>
        
        {/* Event details */}
        <div className="p-4 md:p-6 md:w-3/4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                <Link to={`/events/${event.id}`} className="hover:text-primary-600">
                  {event.name}
                </Link>
              </h3>
              
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>{formattedEventDate} at {formattedEventTime}</span>
              </div>
              
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="mt-2 md:mt-0 flex flex-col items-start md:items-end">
              {/* Status badges */}
              {showCheckedInBadge && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                  Checked In
                </span>
              )}
              
              {isPast && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
                  Past Event
                </span>
              )}
              
              {isCancelled && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mb-2">
                  Cancelled
                </span>
              )}
              
              <div className="text-xs text-gray-500">
                Registered on {formattedRegistrationDate}
              </div>
              
              {checked_in_at && (
                <div className="text-xs text-gray-500 mt-1">
                  Checked in on {formatDate(checked_in_at, 'MMM d, yyyy h:mm a')}
                </div>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          {(showCancelButton || showQRButton) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {showQRButton && (
                <Button
                  to={`/registrations/${id}/qr-code`}
                  variant="outline"
                  size="sm"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    ></path>
                  </svg>
                  View QR Code
                </Button>
              )}
              
              {showCancelButton && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onCancel(id)}
                  isLoading={isCancelling}
                  disabled={isCancelling}
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  Cancel Registration
                </Button>
              )}
              
              <Button
                to={`/events/${event.id}`}
                variant="ghost"
                size="sm"
              >
                Event Details
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MyRegistrations; 