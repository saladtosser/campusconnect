import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, updateUserRole, deleteUser } from '../../store/slices/userSlice';
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

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Action states
  const [actionSuccess, setActionSuccess] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [processingUserId, setProcessingUserId] = useState(null);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  const handleRoleChange = (userId, newRole) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      setProcessingUserId(userId);
      setActionSuccess(false);
      setActionError(null);
      
      dispatch(updateUserRole({ userId, role: newRole }))
        .unwrap()
        .then(() => {
          setActionSuccess(true);
          setActionMessage(`User role has been updated to ${newRole}.`);
        })
        .catch((err) => {
          setActionError(
            typeof err === 'string'
              ? err
              : 'Failed to update user role. Please try again.'
          );
        })
        .finally(() => {
          setProcessingUserId(null);
        });
    }
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setProcessingUserId(userId);
      setActionSuccess(false);
      setActionError(null);
      
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          setActionSuccess(true);
          setActionMessage('User has been deleted successfully.');
        })
        .catch((err) => {
          setActionError(
            typeof err === 'string'
              ? err
              : 'Failed to delete user. Please try again.'
          );
        })
        .finally(() => {
          setProcessingUserId(null);
        });
    }
  };
  
  // Filter and sort users
  const filteredUsers = users
    ? users.filter((user) => {
        // Search filter
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone && user.phone.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Role filter
        if (filterRole === 'all') return matchesSearch;
        return matchesSearch && user.role === filterRole;
      })
    : [];
  
  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortBy === 'role') {
      comparison = a.role.localeCompare(b.role);
    } else if (sortBy === 'created_at') {
      comparison = new Date(a.created_at) - new Date(b.created_at);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  if (isLoading) {
    return <Loading text="Loading users..." />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button to="/admin/users/invite" variant="primary">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            ></path>
          </svg>
          Invite User
        </Button>
      </div>
      
      {actionSuccess && (
        <Alert
          type="success"
          message={actionMessage}
          className="mb-6"
          dismissible
          onDismiss={() => setActionSuccess(false)}
        />
      )}
      
      {actionError && (
        <Alert
          type="error"
          message={actionError}
          className="mb-6"
          dismissible
          onDismiss={() => setActionError(null)}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          title="Error loading users"
          className="mb-6"
        />
      )}
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="sr-only">
              Search users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search users by name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Role filter */}
            <div>
              <label htmlFor="filter-role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="filter-role"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="student">Students</option>
                <option value="guest">Guests</option>
              </select>
            </div>
            
            {/* Sort options */}
            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort-by"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="created_at">Registration Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="role">Role</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <select
                id="sort-order"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {sortedUsers.length === 0 ? (
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No users match your search "${searchTerm}"`
              : "There are no users to display."}
          </p>
          {searchTerm && (
            <button
              className="mt-4 text-sm text-primary-600 hover:text-primary-500"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registered
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Events
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-semibold text-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user.id === currentUser.id && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'student'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.role === 'admin'
                        ? 'Administrator'
                        : user.role === 'student'
                        ? 'Student'
                        : 'Guest'}
                    </span>
                    {user.role === 'guest' && user.guest_code && (
                      <div className="text-xs text-gray-500 mt-1">
                        Code: {user.guest_code}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at, 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.registration_count || 0} registrations
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {user.id !== currentUser.id && (
                        <>
                          <div className="relative">
                            <button
                              className="text-indigo-600 hover:text-indigo-900 group"
                              disabled={processingUserId === user.id}
                            >
                              Change Role
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                                <div className="py-1">
                                  {user.role !== 'admin' && (
                                    <button
                                      onClick={() => handleRoleChange(user.id, 'admin')}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      Make Administrator
                                    </button>
                                  )}
                                  {user.role !== 'student' && (
                                    <button
                                      onClick={() => handleRoleChange(user.id, 'student')}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      Make Student
                                    </button>
                                  )}
                                  {user.role !== 'guest' && (
                                    <button
                                      onClick={() => handleRoleChange(user.id, 'guest')}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      Make Guest
                                    </button>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={processingUserId === user.id}
                          >
                            {processingUserId === user.id ? 'Processing...' : 'Delete'}
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => window.location.href = `/admin/users/${user.id}/registrations`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View Registrations
                      </button>
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

export default UserManagement; 