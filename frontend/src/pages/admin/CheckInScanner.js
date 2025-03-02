import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { QrReader } from 'react-qr-reader';
import { checkInAttendee } from '../../store/slices/registrationSlice';
import { fetchEvents } from '../../store/slices/eventSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import { format } from 'date-fns';

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

const CheckInScanner = () => {
  const dispatch = useDispatch();
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { isLoading: checkInLoading } = useSelector((state) => state.registrations);
  
  const [selectedEventId, setSelectedEventId] = useState('');
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [attendeeInfo, setAttendeeInfo] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' for back camera, 'user' for front
  
  useEffect(() => {
    dispatch(fetchEvents({ admin: true }));
  }, [dispatch]);
  
  // Filter for active events only
  const activeEvents = events
    ? events.filter((event) => {
        const eventEndTime = new Date(event.end_time);
        const now = new Date();
        return event.active && eventEndTime >= now;
      })
    : [];
  
  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
    setScannerEnabled(false);
    setScanResult(null);
    setScanError(null);
    setScanSuccess(false);
    setAttendeeInfo(null);
  };
  
  const toggleScanner = () => {
    if (!selectedEventId) {
      setScanError('Please select an event before scanning.');
      return;
    }
    
    setScannerEnabled(!scannerEnabled);
    setScanResult(null);
    setScanError(null);
    setScanSuccess(false);
    setAttendeeInfo(null);
  };
  
  const toggleCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };
  
  const handleScan = (data) => {
    if (data && data.text) {
      setScannerEnabled(false);
      setScanResult(data.text);
      
      try {
        // Parse the QR code data
        const qrData = JSON.parse(data.text);
        
        if (!qrData.registration_id || !qrData.token) {
          setScanError('Invalid QR code format.');
          return;
        }
        
        // Process the check-in
        dispatch(
          checkInAttendee({
            registrationId: qrData.registration_id,
            eventId: selectedEventId,
            token: qrData.token,
          })
        )
          .unwrap()
          .then((response) => {
            setScanSuccess(true);
            setAttendeeInfo(response.registration);
          })
          .catch((error) => {
            setScanError(
              typeof error === 'string'
                ? error
                : 'Failed to check in attendee. Please try again.'
            );
          });
      } catch (error) {
        setScanError('Invalid QR code data. Please try again.');
      }
    }
  };
  
  const handleScanError = (error) => {
    console.error('QR scan error:', error);
    setScanError('Error accessing camera. Please check permissions and try again.');
  };
  
  const resetScanner = () => {
    setScannerEnabled(true);
    setScanResult(null);
    setScanError(null);
    setScanSuccess(false);
    setAttendeeInfo(null);
  };
  
  if (eventsLoading) {
    return <Loading text="Loading events..." />;
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Check-In Scanner</h1>
        <p className="text-gray-600">
          Scan attendee QR codes to check them in to your event
        </p>
      </div>
      
      <Card className="mb-6">
        <div className="mb-4">
          <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Event <span className="text-red-500">*</span>
          </label>
          <select
            id="event-select"
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={selectedEventId}
            onChange={handleEventChange}
            disabled={scannerEnabled}
          >
            <option value="">-- Select an event --</option>
            {activeEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} ({formatDate(event.start_time, 'MMM d, yyyy h:mm a')})
              </option>
            ))}
          </select>
          {activeEvents.length === 0 && (
            <p className="mt-2 text-sm text-yellow-600">
              No active upcoming events found. Please create or activate an event first.
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            onClick={toggleScanner}
            disabled={!selectedEventId || activeEvents.length === 0}
            variant={scannerEnabled ? 'danger' : 'primary'}
          >
            {scannerEnabled ? (
              <>
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
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                Stop Scanner
              </>
            ) : (
              <>
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
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  ></path>
                </svg>
                Start Scanner
              </>
            )}
          </Button>
          
          {scannerEnabled && (
            <Button onClick={toggleCamera} variant="outline">
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Switch Camera
            </Button>
          )}
        </div>
      </Card>
      
      {scanError && (
        <Alert
          type="error"
          message={scanError}
          className="mb-6"
          dismissible
          onDismiss={() => setScanError(null)}
        />
      )}
      
      {scanSuccess && attendeeInfo && (
        <Alert
          type="success"
          title="Check-in Successful!"
          message={`${attendeeInfo.user.name} has been checked in to the event.`}
          className="mb-6"
          dismissible
          onDismiss={() => setScanSuccess(false)}
        />
      )}
      
      {scannerEnabled && (
        <Card className="mb-6 overflow-hidden">
          <div className="aspect-w-4 aspect-h-3">
            <QrReader
              constraints={{ facingMode }}
              onResult={handleScan}
              className="w-full"
              scanDelay={500}
              videoId="qr-reader-video"
              onError={handleScanError}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Position the QR code within the scanner frame
          </div>
        </Card>
      )}
      
      {attendeeInfo && (
        <Card title="Attendee Information">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{attendeeInfo.user.name}</h3>
              <p className="text-gray-600">{attendeeInfo.user.email}</p>
              {attendeeInfo.user.phone && (
                <p className="text-gray-600">{attendeeInfo.user.phone}</p>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Registration Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Registration ID:</div>
                <div className="text-gray-900">{attendeeInfo.id}</div>
                
                <div className="text-gray-500">Registration Date:</div>
                <div className="text-gray-900">
                  {formatDate(attendeeInfo.created_at, 'MMM d, yyyy h:mm a')}
                </div>
                
                <div className="text-gray-500">Check-in Time:</div>
                <div className="text-gray-900">
                  {attendeeInfo.checked_in_at
                    ? formatDate(attendeeInfo.checked_in_at, 'MMM d, yyyy h:mm a')
                    : 'Not checked in'}
                </div>
                
                <div className="text-gray-500">Status:</div>
                <div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      attendeeInfo.status === 'checked_in'
                        ? 'bg-green-100 text-green-800'
                        : attendeeInfo.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {attendeeInfo.status === 'checked_in'
                      ? 'Checked In'
                      : attendeeInfo.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Registered'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <Button onClick={resetScanner}>
                Scan Another Code
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {!scannerEnabled && !attendeeInfo && selectedEventId && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Ready to Scan</h3>
          <p className="mt-1 text-sm text-gray-500">
            Click "Start Scanner" to begin scanning attendee QR codes
          </p>
        </div>
      )}
      
      {!selectedEventId && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Select an Event</h3>
          <p className="mt-1 text-sm text-gray-500">
            Please select an event from the dropdown to begin check-in
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckInScanner; 