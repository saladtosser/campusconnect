import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEvents, deleteEvent } from '../../../store/slices/eventSlice';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';

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

const AdminEventList = () => {
  const dispatch = useDispatch();
  const { events, isLoading, error } = useSelector((state) => state.events);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events) {
      setFilteredEvents(
        events.filter((event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [events, searchTerm]);

  const handleDeleteClick = (eventId) => {
    setDeleteConfirm(eventId);
  };

  const confirmDelete = (eventId) => {
    dispatch(deleteEvent(eventId));
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return <Loading text="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manage Events</h1>
        <Button to="/admin/events/new" variant="primary">
          Create New Event
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No events found. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl font-semibold text-gray-800">{event.name}</h2>
                  <p className="text-gray-600">{event.location}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(event.start_time, 'PPP')} at {formatDate(event.start_time, 'p')}
                  </p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      event.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {event.active ? 'Active' : 'Inactive'}
                    </span>
                    {event.is_past && (
                      <span className="inline-block ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Past
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {deleteConfirm === event.id ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => confirmDelete(event.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelDelete}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        to={`/admin/events/${event.id}/edit`}
                        variant="secondary"
                        size="sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(event.id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventList; 