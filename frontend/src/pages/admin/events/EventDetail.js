import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEventById } from '../../../store/slices/eventSlice';
import { fetchRegistrationsByEvent, approveRegistration, rejectRegistration } from '../../../store/slices/registrationSlice';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';
import QrCodeIcon from '@mui/icons-material/QrCode';
import PeopleIcon from '@mui/icons-material/People';

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

const AdminEventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, isLoading: eventLoading, error: eventError } = useSelector((state) => state.events);
  const { registrations, isLoading: registrationsLoading, error: registrationsError } = useSelector((state) => state.registrations);
  const [activeTab, setActiveTab] = useState('details');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
      dispatch(fetchRegistrationsByEvent(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (registrations) {
      setFilteredRegistrations(
        registrations.filter((reg) =>
          reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [registrations, searchTerm]);

  const handleApprove = (registrationId) => {
    dispatch(approveRegistration(registrationId));
  };

  const handleReject = (registrationId) => {
    dispatch(rejectRegistration(registrationId));
  };

  if (eventLoading || registrationsLoading) {
    return <Loading text="Loading event details..." />;
  }

  if (eventError) {
    return <Alert type="error" message={eventError} />;
  }

  if (!event) {
    return <Alert type="error" message="Event not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{event.name}</h1>
        <div className="flex space-x-2">
          <Button
            to={`/admin/events/${id}/edit`}
            variant="secondary"
          >
            Edit Event
          </Button>
          <Button
            onClick={() => navigate('/admin/events')}
            variant="outline"
          >
            Back to Events
          </Button>
          <Button
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={() => navigate(`/admin/events/${id}/qr-code`)}
            sx={{ mr: 1 }}
          >
            Event QR Code
          </Button>
          <Button
            variant="outlined"
            startIcon={<PeopleIcon />}
            onClick={() => navigate(`/admin/events/${id}/attendees`)}
            sx={{ mr: 1 }}
          >
            View Attendees
          </Button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'details'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('details')}
        >
          Event Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'registrations'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('registrations')}
        >
          Registrations ({registrations?.length || 0})
        </button>
      </div>

      {activeTab === 'details' ? (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Event Name</p>
                  <p className="font-medium">{event.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p>{event.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p>{event.location}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Date & Time</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Start Time</p>
                  <p>{formatDate(event.start_time, 'PPP')} at {formatDate(event.start_time, 'p')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Time</p>
                  <p>{formatDate(event.end_time, 'PPP')} at {formatDate(event.end_time, 'p')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Deadline</p>
                  <p>{formatDate(event.registration_deadline, 'PPP')} at {formatDate(event.registration_deadline, 'p')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Capacity & Status</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p>{event.capacity} attendees</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered</p>
                  <p>{registrations?.length || 0} registrations</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    color={event.active ? 'green' : 'red'}
                    text={event.active ? 'Active' : 'Inactive'}
                  />
                  {event.is_past && (
                    <Badge color="gray" text="Past" className="ml-2" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrationsError && (
            <Alert type="error" message={registrationsError} />
          )}
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search registrations..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No registrations found for this event.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {registration.user.full_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {registration.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(registration.created_at, 'PPP')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(registration.created_at, 'p')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          color={
                            registration.status === 'approved'
                              ? 'green'
                              : registration.status === 'rejected'
                              ? 'red'
                              : 'yellow'
                          }
                          text={
                            registration.status === 'approved'
                              ? 'Approved'
                              : registration.status === 'rejected'
                              ? 'Rejected'
                              : 'Pending'
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {registration.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(registration.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        {registration.status === 'approved' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(registration.id)}
                          >
                            Reject
                          </Button>
                        )}
                        {registration.status === 'rejected' && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(registration.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminEventDetail; 