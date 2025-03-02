import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { fetchEventById, createEvent, updateEvent } from '../../store/slices/eventSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';
import Input from '../../components/ui/Input';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentEvent, isLoading, error } = useSelector((state) => state.events);
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  
  useEffect(() => {
    if (id) {
      setIsEdit(true);
      dispatch(fetchEventById(id));
    } else {
      setIsEdit(false);
    }
  }, [dispatch, id]);
  
  // Define validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Event name is required')
      .max(100, 'Event name must be at most 100 characters'),
    description: Yup.string()
      .required('Description is required')
      .max(2000, 'Description must be at most 2000 characters'),
    location: Yup.string()
      .required('Location is required')
      .max(100, 'Location must be at most 100 characters'),
    start_time: Yup.date()
      .required('Start time is required'),
    end_time: Yup.date()
      .required('End time is required')
      .min(
        Yup.ref('start_time'),
        'End time must be after start time'
      ),
    capacity: Yup.number()
      .nullable()
      .transform((value, originalValue) => 
        originalValue.trim() === '' ? null : value
      )
      .min(1, 'Capacity must be at least 1')
      .max(10000, 'Capacity must be at most 10,000'),
    background_image: Yup.string()
      .url('Must be a valid URL')
      .nullable(),
    active: Yup.boolean(),
  });
  
  const handleSubmit = (values, { setSubmitting }) => {
    setFormSuccess(false);
    setFormError(null);
    
    const eventData = {
      ...values,
      capacity: values.capacity || null,
      background_image: values.background_image || null,
    };
    
    const action = isEdit
      ? updateEvent({ id, eventData })
      : createEvent(eventData);
    
    dispatch(action)
      .unwrap()
      .then((response) => {
        setFormSuccess(true);
        if (!isEdit) {
          // Redirect to edit page for the new event
          navigate(`/admin/events/${response.id}/edit`);
        }
      })
      .catch((err) => {
        setFormError(
          typeof err === 'string'
            ? err
            : 'Failed to save event. Please try again.'
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };
  
  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };
  
  if (isLoading && isEdit) {
    return <Loading text="Loading event data..." />;
  }
  
  const initialValues = isEdit && currentEvent
    ? {
        name: currentEvent.name || '',
        description: currentEvent.description || '',
        location: currentEvent.location || '',
        start_time: formatDateForInput(currentEvent.start_time),
        end_time: formatDateForInput(currentEvent.end_time),
        capacity: currentEvent.capacity || '',
        background_image: currentEvent.background_image || '',
        active: currentEvent.active || false,
      }
    : {
        name: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
        capacity: '',
        background_image: '',
        active: true,
      };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Event' : 'Create New Event'}
        </h1>
        <p className="text-gray-600">
          {isEdit
            ? 'Update the details of your event'
            : 'Fill in the details to create a new event'}
        </p>
      </div>
      
      {formSuccess && (
        <Alert
          type="success"
          message={`Event ${isEdit ? 'updated' : 'created'} successfully.`}
          className="mb-6"
          dismissible
          onDismiss={() => setFormSuccess(false)}
        />
      )}
      
      {formError && (
        <Alert
          type="error"
          message={formError}
          className="mb-6"
          dismissible
          onDismiss={() => setFormError(null)}
        />
      )}
      
      {error && (
        <Alert
          type="error"
          message={error}
          title="Error loading event"
          className="mb-6"
        />
      )}
      
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, touched, errors, values, setFieldValue }) => (
            <Form>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter event name"
                    error={touched.name && errors.name}
                  />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    id="description"
                    rows="5"
                    placeholder="Enter event description"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      touched.description && errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as={Input}
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Enter event location"
                    error={touched.location && errors.location}
                  />
                  <ErrorMessage
                    name="location"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      type="datetime-local"
                      name="start_time"
                      id="start_time"
                      error={touched.start_time && errors.start_time}
                    />
                    <ErrorMessage
                      name="start_time"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                      End Time <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as={Input}
                      type="datetime-local"
                      name="end_time"
                      id="end_time"
                      error={touched.end_time && errors.end_time}
                    />
                    <ErrorMessage
                      name="end_time"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity (Optional)
                  </label>
                  <Field
                    as={Input}
                    type="number"
                    name="capacity"
                    id="capacity"
                    placeholder="Leave blank for unlimited capacity"
                    error={touched.capacity && errors.capacity}
                  />
                  <ErrorMessage
                    name="capacity"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of attendees. Leave blank for unlimited capacity.
                  </p>
                </div>
                
                <div>
                  <label htmlFor="background_image" className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image URL (Optional)
                  </label>
                  <Field
                    as={Input}
                    type="text"
                    name="background_image"
                    id="background_image"
                    placeholder="https://example.com/image.jpg"
                    error={touched.background_image && errors.background_image}
                  />
                  <ErrorMessage
                    name="background_image"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    URL to an image that will be displayed as the event background.
                  </p>
                </div>
                
                {values.background_image && (
                  <div>
                    <p className="block text-sm font-medium text-gray-700 mb-1">Image Preview</p>
                    <div className="mt-1 relative rounded-md overflow-hidden h-40">
                      <img
                        src={values.background_image}
                        alt="Background preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="active"
                    id="active"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Event is active and open for registration
                  </label>
                </div>
                
                <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/events')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isEdit ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default EventForm; 