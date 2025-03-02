import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegistrationQRCode } from '../../store/slices/registrationSlice';
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

const QRCode = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentRegistration, qrCodeData, isLoading, error } = useSelector(
    (state) => state.registrations
  );
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchRegistrationQRCode(id));
    }
  }, [dispatch, id]);

  // Calculate time left until QR code expires
  useEffect(() => {
    if (!currentRegistration?.qr_code_expires_at) return;

    const calculateTimeLeft = () => {
      const expiresAt = new Date(currentRegistration.qr_code_expires_at);
      const now = new Date();
      const difference = expiresAt - now;

      if (difference <= 0) {
        return 'Expired';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else if (hours > 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [currentRegistration]);

  if (isLoading) {
    return <Loading text="Loading QR code..." />;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Alert
          type="error"
          title="Error loading QR code"
          message={error}
          className="mb-4"
        />
        <Button onClick={() => navigate('/my-registrations')}>
          Back to My Registrations
        </Button>
      </div>
    );
  }

  if (!currentRegistration || !qrCodeData) {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <h2 className="text-xl font-semibold mb-4">QR Code Not Found</h2>
          <p className="text-gray-600 mb-6">
            The registration or QR code you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/my-registrations')}>
            Back to My Registrations
          </Button>
        </Card>
      </div>
    );
  }

  const { event, status, qr_code_expires_at } = currentRegistration;
  const isExpired = qr_code_expires_at ? new Date(qr_code_expires_at) < new Date() : false;
  const isPast = event.end_time ? new Date(event.end_time) < new Date() : false;
  const isCheckedIn = status === 'checked_in';
  const isCancelled = status === 'cancelled';

  // Format dates
  const formattedEventDate = formatDate(event.start_time, 'EEEE, MMMM d, yyyy');
  const formattedEventTime = `${formatDate(event.start_time, 'h:mm a')} - ${formatDate(
    event.end_time,
    'h:mm a'
  )}`;
  const formattedExpiryDate = formatDate(qr_code_expires_at, 'MMMM d, yyyy h:mm a');

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Check-in QR Code</h1>
          <p className="text-gray-600">
            Present this QR code at the event for check-in
          </p>
        </div>

        {/* Event details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">{event.name}</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2 text-gray-500"
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
              <span>{formattedEventDate}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>{formattedEventTime}</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-4 w-4 mr-2 text-gray-500"
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
        </div>

        {/* Status messages */}
        {isCheckedIn && (
          <Alert
            type="success"
            title="Already Checked In"
            message="You have already checked in to this event."
            className="mb-6"
          />
        )}

        {isCancelled && (
          <Alert
            type="error"
            title="Registration Cancelled"
            message="This registration has been cancelled and cannot be used for check-in."
            className="mb-6"
          />
        )}

        {isPast && !isCheckedIn && !isCancelled && (
          <Alert
            type="warning"
            title="Event Ended"
            message="This event has already ended."
            className="mb-6"
          />
        )}

        {isExpired && !isCheckedIn && !isCancelled && !isPast && (
          <Alert
            type="warning"
            title="QR Code Expired"
            message="This QR code has expired and can no longer be used for check-in."
            className="mb-6"
          />
        )}

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          {isCheckedIn || isCancelled || isExpired || isPast ? (
            <div className="relative">
              <img
                src={qrCodeData}
                alt="QR Code"
                className="w-64 h-64 opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-75 px-4 py-2 rounded-lg text-lg font-bold text-red-600 transform rotate-45">
                  {isCheckedIn
                    ? 'CHECKED IN'
                    : isCancelled
                    ? 'CANCELLED'
                    : 'EXPIRED'}
                </div>
              </div>
            </div>
          ) : (
            <img
              src={qrCodeData}
              alt="QR Code"
              className="w-64 h-64"
            />
          )}
        </div>

        {/* Expiry info */}
        {!isCheckedIn && !isCancelled && !isPast && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600">
              {isExpired
                ? `QR code expired on ${formattedExpiryDate}`
                : `QR code expires in ${timeLeft} (${formattedExpiryDate})`}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col space-y-3">
          <Button
            to={`/events/${event.id}`}
            variant="outline"
            fullWidth
          >
            View Event Details
          </Button>
          <Button
            onClick={() => navigate('/my-registrations')}
            variant="ghost"
            fullWidth
          >
            Back to My Registrations
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QRCode; 