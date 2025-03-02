import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkInRegistration } from '../../../store/slices/registrationSlice';
import { getEvents } from '../../../store/slices/eventSlice';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';

const CheckInScanner = () => {
  const dispatch = useDispatch();
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { isLoading, error, success } = useSelector((state) => state.registrations);
  
  const [selectedEvent, setSelectedEvent] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [manualEntry, setManualEntry] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  // Reset scan result when scanner is toggled
  useEffect(() => {
    if (!scannerActive) {
      setScanResult(null);
    }
  }, [scannerActive]);

  // Handle event selection
  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
    setScanResult(null);
  };

  // Toggle scanner
  const toggleScanner = () => {
    if (!selectedEvent) {
      setCameraError('Please select an event first');
      return;
    }
    setScannerActive(!scannerActive);
    setCameraError(null);
    setScanResult(null);
  };

  // Toggle between camera scanner and manual entry
  const toggleCamera = () => {
    setManualEntry(!manualEntry);
    setScanResult(null);
  };

  // Handle QR code scan
  const handleScan = (data) => {
    if (data && scannerActive) {
      setScannerActive(false);
      setQrCode(data);
      
      // Process the QR code
      dispatch(checkInRegistration({ 
        qr_code: data,
        event_id: selectedEvent 
      }))
        .unwrap()
        .then((result) => {
          setScanResult({
            success: true,
            message: `Successfully checked in ${result.admin_user.name} for ${result.event.name}`,
            data: result
          });
        })
        .catch((error) => {
          setScanResult({
            success: false,
            message: typeof error === 'string' 
              ? error 
              : 'Failed to check in. Invalid QR code or already checked in.'
          });
        });
    }
  };

  // Handle manual QR code entry
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!qrCode) return;
    
    dispatch(checkInRegistration({ 
      qr_code: qrCode,
      event_id: selectedEvent 
    }))
      .unwrap()
      .then((result) => {
        setScanResult({
          success: true,
          message: `Successfully checked in ${result.admin_user.name} for ${result.event.name}`,
          data: result
        });
      })
      .catch((error) => {
        setScanResult({
          success: false,
          message: typeof error === 'string' 
            ? error 
            : 'Failed to check in. Invalid QR code or already checked in.'
        });
      });
  };

  // Handle scan error
  const handleScanError = (error) => {
    setCameraError(`Camera error: ${error.message || 'Failed to access camera'}`);
    setScannerActive(false);
  };

  // Reset scanner
  const resetScanner = () => {
    setScanResult(null);
    setQrCode('');
    setScannerActive(false);
  };

  if (eventsLoading) {
    return <Loading text="Loading events..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Check-In Scanner</h1>
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Select Event</h2>
        
        <div className="mb-4">
          <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1">
            Event
          </label>
          <select
            id="event"
            value={selectedEvent}
            onChange={handleEventChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={scannerActive}
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} - {new Date(event.start_time).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={toggleScanner}
            disabled={!selectedEvent || isLoading}
            variant={scannerActive ? "danger" : "primary"}
          >
            {scannerActive ? "Stop Scanner" : "Start Scanner"}
          </Button>
          
          <Button
            onClick={toggleCamera}
            disabled={!selectedEvent || isLoading}
            variant="secondary"
          >
            {manualEntry ? "Use Camera" : "Manual Entry"}
          </Button>
        </div>
      </Card>
      
      {cameraError && (
        <Alert
          type="error"
          message={cameraError}
          className="mb-6"
          dismissible
          onDismiss={() => setCameraError(null)}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={typeof error === 'string' ? error : 'An error occurred during check-in'}
          className="mb-6"
          dismissible
        />
      )}
      
      {scannerActive && !manualEntry && (
        <Card className="mb-6">
          <div className="text-center">
            <p className="mb-4">Scanning... Please show the QR code to the camera.</p>
            <div className="w-full max-w-md mx-auto h-64 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              {/* This would be replaced with an actual QR scanner component */}
              <p className="text-gray-500">Camera view would appear here</p>
            </div>
          </div>
        </Card>
      )}
      
      {manualEntry && (
        <Card className="mb-6">
          <h3 className="text-lg font-medium mb-4">Manual QR Code Entry</h3>
          <form onSubmit={handleManualSubmit}>
            <div className="mb-4">
              <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700 mb-1">
                QR Code
              </label>
              <input
                type="text"
                id="qrCode"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter QR code value"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading || !qrCode}>
              Check In
            </Button>
          </form>
        </Card>
      )}
      
      {scanResult && (
        <Card className={`mb-6 ${scanResult.success ? 'border-green-500' : 'border-red-500'}`}>
          <div className="text-center">
            <h3 className={`text-lg font-medium mb-2 ${scanResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {scanResult.success ? 'Check-In Successful' : 'Check-In Failed'}
            </h3>
            <p className="mb-4">{scanResult.message}</p>
            
            {scanResult.success && scanResult.data && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                <p><strong>Name:</strong> {scanResult.data.admin_user.name}</p>
                <p><strong>Email:</strong> {scanResult.data.admin_user.email}</p>
                <p><strong>Event:</strong> {scanResult.data.event.name}</p>
                <p><strong>Check-in time:</strong> {new Date().toLocaleString()}</p>
              </div>
            )}
            
            <Button onClick={resetScanner} variant="secondary">
              Scan Another
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CheckInScanner; 