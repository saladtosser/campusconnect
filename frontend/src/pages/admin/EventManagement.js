import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents, deleteEvent } from '../../store/slices/eventSlice';
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

const EventManagement = () => {
  const dispatch = useDispatch();
  const { events, isLoading, error } = useSelector((state) => state.events);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('start_time');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Delete state
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  useEffect(() => {
    dispatch(fetchEvents({ admin: true }));
  }, [dispatch]);
  
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setDeletingId(eventId);
      setDeleteSuccess(false);
      setDeleteError(null);
      
      dispatch(deleteEvent(eventId))
        .unwrap()
        .then(() => {
          setDeleteSuccess(true);
        })
        .catch((err) => {
          setDeleteError(
            typeof err === 'string'
              ? err
              : 'Failed to delete event. Please try again.'
          );
        })
        .finally(() => {
          setDeletingId(null);
        });
    }
  };
  
  // Filter and sort events
  const filteredEvents = events
    ? events.filter((event) => {
        // Search filter
        const matchesSearch =
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Status filter
        const now = new Date();
        const eventDate = new Date(event.start_time);
        const isPast = eventDate < now;
        const isActive = event.active;
        
        if (filterStatus === 'all') return matchesSearch;
        if (filterStatus === 'active') return matchesSearch && isActive;
        if (filterStatus === 'inactive') return matchesSearch && !isActive;
        if (filterStatus === 'upcoming') return matchesSearch && !isPast && isActive;
        if (filterStatus === 'past') return matchesSearch && isPast;
        
        return matchesSearch;
      })
    : [];
  
  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'location') {
      comparison = a.location.localeCompare(b.location);
    } else if (sortBy === 'start_time') {
      comparison = new Date(a.start_time) - new Date(b.start_time);
    } else if (sortBy === 'created_at') {
      comparison = new Date(a.created_at) - new Date(b.created_at);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  if (isLoading) {
    return <Loading text="Loading events..." />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
        <Button to="/admin/events/new">
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Create Event
        </Button>
      </div>
      
      {deleteSuccess && (
        <Alert
          type="success"
          message="Event has been deleted successfully."
          className="mb-6"
          dismissible
          onDismiss={() => setDeleteSuccess(false)}
        />
      )}
      
      {deleteError && (
        <Alert
          type="error"
          message={deleteError}
          className="mb-6"
          dismissible
          onDismiss={() => setDeleteError(null)}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          title="Error loading events"
          className="mb-6"
        />
      )}
      
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="sr-only">
              Search events
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
                placeholder="Search events by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status filter */}
            <div>
              <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="filter-status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
                <option value="upcoming">Upcoming Only</option>
                <option value="past">Past Only</option>
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
                <option value="start_time">Date</option>
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="created_at">Created Date</option>
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
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {sortedEvents.length === 0 ? (
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No events match your search "${searchTerm}"`
              : "There are no events to display."}
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
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Registrations
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
              {sortedEvents.map((event) => {
                const isPast = new Date(event.end_time) < new Date();
                
                return (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={event.background_image || 'https://via.placeholder.com/150?text=Event'}
                            alt={event.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.name}</div>
                          <div className="text-sm text-gray-500">ID: {event.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(event.start_time, 'MMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(event.start_time, 'h:mm a')} - {formatDate(event.end_time, 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {event.active ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                        
                        {isPast && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Past
                          </span>
                        )}
                        
                        {event.is_full && !isPast && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Full
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.registration_count || 0} / {event.capacity || 'Unlimited'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/admin/events/${event.id}/registrations`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Registrations
                        </Link>
                        <Link
                          to={`/admin/events/${event.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deletingId === event.id}
                        >
                          {deletingId === event.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventManagement; 