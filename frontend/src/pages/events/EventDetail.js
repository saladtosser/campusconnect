import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById } from '../../store/slices/eventSlice';
import { registerForEvent } from '../../store/slices/registrationSlice';
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

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEvent, isLoading: eventLoading, error: eventError } = useSelector((state) => state.events);
  const { isLoading: registrationLoading, error: registrationError, registrations } = useSelector((state) => state.registrations);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  
  const isUserRegistered = registrations && registrations.some(
    (reg) => reg.event && reg.event.id === parseInt(id)
  );
  
  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);
  
  const handleRegister = () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }
    
    dispatch(registerForEvent(id))
      .unwrap()
      .then(() => {
        setRegistrationSuccess(true);
      })
      .catch((error) => {
        console.error('Registration failed:', error);
      });
  };
  
  if (eventLoading) {
    return <Loading text="Loading event details..." />;
  }
  
  if (eventError) {
    return (
      <Alert
        type="error"
        title="Error loading event"
        message={eventError}
        className="mb-4"
      />
    );
  }
  
  if (!currentEvent) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Event not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button
          className="mt-4"
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </div>
    );
  }
  
  const {
    name,
    description,
    location,
    start_time,
    end_time,
    capacity,
    active,
    background_image,
    is_past,
    is_full,
    available_spots,
  } = currentEvent;
  
  // Format dates
  const formattedStartDate = formatDate(start_time, 'EEEE, MMMM d, yyyy');
  const formattedStartTime = formatDate(start_time, 'h:mm a');
  const formattedEndTime = formatDate(end_time, 'h:mm a');
  
  return (
    <div>
      {/* Event header with background image */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <img
          src={background_image || 'https://via.placeholder.com/1200x400?text=Event'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
            <div className="flex items-center text-sm md:text-base">
              <svg
                className="h-5 w-5 mr-2"
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
              <span>{location}</span>
            </div>
          </div>
        </div>
        
        {/* Status badges */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          {!active && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              Inactive
            </span>
          )}
          {is_past && (
            <span className="bg-gray-700 text-white text-xs px-2 py-1 rounded">
              Past Event
            </span>
          )}
          {is_full && !is_past && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">
              Sold Out
            </span>
          )}
        </div>
      </div>
      
      {/* Alerts */}
      {showLoginAlert && (
        <Alert
          type="info"
          message="You need to be logged in to register for events."
          className="mb-6"
          dismissible
          onDismiss={() => setShowLoginAlert(false)}
          title="Login Required"
        />
      )}
      
      {registrationSuccess && (
        <Alert
          type="success"
          message="You have successfully registered for this event!"
          className="mb-6"
          dismissible
          onDismiss={() => setRegistrationSuccess(false)}
          title="Registration Successful"
        />
      )}
      
      {registrationError && (
        <Alert
          type="error"
          message={registrationError}
          className="mb-6"
          dismissible
          title="Registration Failed"
        />
      )}
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event details */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{description}</p>
            </div>
          </Card>
        </div>
        
        {/* Registration sidebar */}
        <div>
          <Card className="sticky top-4">
            <h3 className="text-xl font-semibold mb-4">Event Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
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
                <div>
                  <div className="font-medium">Date & Time</div>
                  <div className="text-gray-700">{formattedStartDate}</div>
                  <div className="text-gray-600">
                    {formattedStartTime} - {formattedEndTime}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
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
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-gray-700">{location}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
                <div>
                  <div className="font-medium">Capacity</div>
                  <div className="text-gray-700">
                    {capacity ? (
                      <>
                        {available_spots === 0
                          ? 'Sold out'
                          : `${available_spots} spots left out of ${capacity}`}
                      </>
                    ) : (
                      'Unlimited'
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration button */}
            {!is_past ? (
              isUserRegistered ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
                    <div className="flex">
                      <svg
                        className="h-5 w-5 text-green-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <div>
                        <p className="font-medium">You're registered!</p>
                        <p className="text-sm mt-1">
                          You can view your registration details in your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    to="/my-registrations"
                    variant="outline"
                    fullWidth
                  >
                    View My Registrations
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={is_full || !active || registrationLoading}
                  isLoading={registrationLoading}
                  fullWidth
                >
                  {is_full
                    ? 'Event Full'
                    : !active
                    ? 'Registration Closed'
                    : 'Register for Event'}
                </Button>
              )
            ) : (
              <Button disabled fullWidth variant="ghost">
                Event has ended
              </Button>
            )}
            
            {/* Share buttons */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Share this event</h4>
              <div className="flex space-x-4">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        name
                      )}&url=${encodeURIComponent(window.location.href)}`,
                      '_blank'
                    );
                  }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.href
                      )}`,
                      '_blank'
                    );
                  }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 