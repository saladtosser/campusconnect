import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchAllRegistrations, approveRegistration, rejectRegistration } from '../../../store/slices/registrationSlice';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';

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

const AdminRegistrationList = () => {
  const dispatch = useDispatch();
  const { registrations, isLoading, error } = useSelector((state) => state.registrations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [registrationUpdating, setRegistrationUpdating] = useState(null);

  useEffect(() => {
    dispatch(fetchAllRegistrations());
  }, [dispatch]);

  useEffect(() => {
    if (registrations) {
      let filtered = [...registrations];
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filtered = filtered.filter(reg => reg.status === statusFilter);
      }
      
      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(reg => 
          reg.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reg.event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredRegistrations(filtered);
    }
  }, [registrations, searchTerm, statusFilter]);

  const handleApprove = async (registrationId) => {
    setRegistrationUpdating(registrationId);
    try {
      await dispatch(approveRegistration(registrationId)).unwrap();
    } catch (error) {
      console.error('Failed to approve registration:', error);
    } finally {
      setRegistrationUpdating(null);
    }
  };

  const handleReject = async (registrationId) => {
    setRegistrationUpdating(registrationId);
    try {
      await dispatch(rejectRegistration(registrationId)).unwrap();
    } catch (error) {
      console.error('Failed to reject registration:', error);
    } finally {
      setRegistrationUpdating(null);
    }
  };

  if (isLoading) {
    return <Loading text="Loading registrations..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Registrations</h1>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <Card>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by user or event..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/2">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No registrations found.</p>
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
                      Event
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
                        <div className="text-sm font-medium text-gray-900">
                          {registration.event.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(registration.event.start_time, 'PPP')}
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
                        <div className="flex space-x-2">
                          {registration.status === 'pending' && (
                            <>
                              <Button
                                variant="success"
                                size="sm"
                                disabled={registrationUpdating === registration.id}
                                onClick={() => handleApprove(registration.id)}
                              >
                                {registrationUpdating === registration.id ? 'Updating...' : 'Approve'}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                disabled={registrationUpdating === registration.id}
                                onClick={() => handleReject(registration.id)}
                              >
                                {registrationUpdating === registration.id ? 'Updating...' : 'Reject'}
                              </Button>
                            </>
                          )}
                          {registration.status === 'approved' && (
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={registrationUpdating === registration.id}
                              onClick={() => handleReject(registration.id)}
                            >
                              {registrationUpdating === registration.id ? 'Updating...' : 'Reject'}
                            </Button>
                          )}
                          {registration.status === 'rejected' && (
                            <Button
                              variant="success"
                              size="sm"
                              disabled={registrationUpdating === registration.id}
                              onClick={() => handleApprove(registration.id)}
                            >
                              {registrationUpdating === registration.id ? 'Updating...' : 'Approve'}
                            </Button>
                          )}
                          <Button
                            to={`/admin/events/${registration.event.id}`}
                            variant="secondary"
                            size="sm"
                          >
                            View Event
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminRegistrationList; 