import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchEventById, createEvent, updateEvent } from '../../../store/slices/eventSlice';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import Loading from '../../../components/ui/Loading';

// Helper function to safely format dates
const formatDate = (dateString, formatString) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), formatString);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return '';
  }
};

const AdminEventForm = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, isLoading, error } = useSelector((state) => state.events);
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    start_time: '',
    end_time: '',
    registration_deadline: '',
    capacity: 50,
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        location: event.location || '',
        start_time: formatDate(event.start_time, "yyyy-MM-dd'T'HH:mm"),
        end_time: formatDate(event.end_time, "yyyy-MM-dd'T'HH:mm"),
        registration_deadline: formatDate(event.registration_deadline, "yyyy-MM-dd'T'HH:mm"),
        capacity: event.capacity || 50,
        active: event.active !== undefined ? event.active : true,
      });
    }
  }, [event, isEditMode]);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Event name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.start_time) errors.start_time = 'Start time is required';
    if (!formData.end_time) errors.end_time = 'End time is required';
    if (!formData.registration_deadline) errors.registration_deadline = 'Registration deadline is required';
    
    if (formData.start_time && formData.end_time) {
      const startTime = new Date(formData.start_time);
      const endTime = new Date(formData.end_time);
      if (endTime <= startTime) {
        errors.end_time = 'End time must be after start time';
      }
    }
    
    if (formData.registration_deadline && formData.start_time) {
      const regDeadline = new Date(formData.registration_deadline);
      const startTime = new Date(formData.start_time);
      if (regDeadline >= startTime) {
        errors.registration_deadline = 'Registration deadline must be before start time';
      }
    }
    
    if (formData.capacity <= 0) errors.capacity = 'Capacity must be greater than 0';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await dispatch(updateEvent({ id, eventData: formData })).unwrap();
        navigate(`/admin/events/${id}`);
      } else {
        const result = await dispatch(createEvent(formData)).unwrap();
        navigate(`/admin/events/${result.id}`);
      }
    } catch (err) {
      console.error('Failed to save event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && isEditMode) {
    return <Loading text="Loading event data..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        <Button
          onClick={() => navigate('/admin/events')}
          variant="outline"
        >
          Cancel
        </Button>
      </div>

      {error && (
        <Alert type="error" message={error} />
      )}

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Event Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.location ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Date & Time</h2>
              
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                  Start Time*
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.start_time ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.start_time && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.start_time}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                  End Time*
                </label>
                <input
                  type="datetime-local"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.end_time ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.end_time && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.end_time}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="registration_deadline" className="block text-sm font-medium text-gray-700">
                  Registration Deadline*
                </label>
                <input
                  type="datetime-local"
                  id="registration_deadline"
                  name="registration_deadline"
                  value={formData.registration_deadline}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.registration_deadline ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.registration_deadline && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.registration_deadline}</p>
                )}
              </div>
            </div>
            
            {/* Capacity & Status */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Capacity & Status</h2>
              
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity*
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.capacity ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500`}
                />
                {formErrors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
                )}
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                  Active (visible to users)
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminEventForm; 