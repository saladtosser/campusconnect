import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchUserById, toggleUserActive, toggleUserAdmin } from '../../../store/slices/userSlice';
import { fetchUserRegistrations } from '../../../store/slices/registrationSlice';
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

const AdminUserDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading: userLoading, error: userError } = useSelector((state) => state.users);
  const { registrations, isLoading: registrationsLoading, error: registrationsError } = useSelector((state) => state.registrations);
  const [activeTab, setActiveTab] = useState('details');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      dispatch(fetchUserRegistrations(id));
    }
  }, [dispatch, id]);

  const handleToggleActive = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await dispatch(toggleUserActive({ userId: id, isActive: !user.is_active })).unwrap();
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAdmin = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await dispatch(toggleUserAdmin({ userId: id, isAdmin: !user.is_admin })).unwrap();
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (userLoading || registrationsLoading) {
    return <Loading text="Loading user details..." />;
  }

  if (userError) {
    return <Alert type="error" message={userError} />;
  }

  if (!user) {
    return <Alert type="error" message="User not found" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{user.full_name}</h1>
        <Button
          onClick={() => navigate('/admin/users')}
          variant="outline"
        >
          Back to Users
        </Button>
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
          User Details
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'registrations'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('registrations')}
        >
          Event Registrations ({registrations?.length || 0})
        </button>
      </div>

      {activeTab === 'details' ? (
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Joined</p>
                  <p>{formatDate(user.date_joined, 'PPP')}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Status & Role</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center mt-1">
                    <Badge
                      color={user.is_active ? 'green' : 'red'}
                      text={user.is_active ? 'Active' : 'Inactive'}
                    />
                    <Button
                      variant={user.is_active ? 'danger' : 'success'}
                      size="sm"
                      className="ml-4"
                      disabled={isUpdating}
                      onClick={handleToggleActive}
                    >
                      {isUpdating ? 'Updating...' : user.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <div className="flex items-center mt-1">
                    <Badge
                      color={user.is_admin ? 'blue' : 'gray'}
                      text={user.is_admin ? 'Admin' : 'User'}
                    />
                    <Button
                      variant={user.is_admin ? 'danger' : 'primary'}
                      size="sm"
                      className="ml-4"
                      disabled={isUpdating}
                      onClick={handleToggleAdmin}
                    >
                      {isUpdating ? 'Updating...' : user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Activity</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p>{formatDate(user.last_login, 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Event Registrations</p>
                  <p>{registrations?.length || 0} registrations</p>
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
          
          {registrations?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No event registrations found for this user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                  {registrations.map((registration) => (
                    <tr key={registration.id}>
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
                        <Button
                          to={`/admin/events/${registration.event.id}`}
                          variant="secondary"
                          size="sm"
                        >
                          View Event
                        </Button>
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

export default AdminUserDetail; 