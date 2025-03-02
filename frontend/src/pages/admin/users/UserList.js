import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers, toggleUserActive } from '../../../store/slices/userSlice';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';
import Badge from '../../../components/ui/Badge';

const AdminUserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userStatusUpdating, setUserStatusUpdating] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter((user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [users, searchTerm]);

  const handleToggleActive = async (userId, currentStatus) => {
    setUserStatusUpdating(userId);
    try {
      await dispatch(toggleUserActive({ userId, isActive: !currentStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update user status:', error);
    } finally {
      setUserStatusUpdating(null);
    }
  };

  if (isLoading) {
    return <Loading text="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found.</p>
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
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-medium">
                          {user.full_name.split(' ').map(name => name[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      color={user.is_active ? 'green' : 'red'}
                      text={user.is_active ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      color={user.is_admin ? 'blue' : 'gray'}
                      text={user.is_admin ? 'Admin' : 'User'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        to={`/admin/users/${user.id}`}
                        variant="secondary"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        variant={user.is_active ? 'danger' : 'success'}
                        size="sm"
                        disabled={userStatusUpdating === user.id}
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                      >
                        {userStatusUpdating === user.id
                          ? 'Updating...'
                          : user.is_active
                          ? 'Deactivate'
                          : 'Activate'}
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
  );
};

export default AdminUserList; 