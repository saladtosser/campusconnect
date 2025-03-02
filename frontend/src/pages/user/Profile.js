import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateProfile, fetchProfile } from '../../store/slices/userSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Loading from '../../components/ui/Loading';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, message } = useSelector((state) => state.users);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setUpdateSuccess(true);
    }
    if (error) {
      setUpdateError(error);
    }
  }, [message, error]);

  // Define validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    phone: Yup.string()
      .matches(/^[0-9+\-() ]*$/, 'Invalid phone number format'),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    setUpdateSuccess(false);
    setUpdateError(null);
    
    dispatch(updateProfile(values))
      .unwrap()
      .then(() => {
        setUpdateSuccess(true);
      })
      .catch((err) => {
        setUpdateError(
          typeof err === 'string'
            ? err
            : 'Failed to update profile. Please try again.'
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (isLoading) {
    return <Loading text="Loading profile..." />;
  }

  if (!user) {
    return (
      <Alert
        type="error"
        title="Error loading profile"
        message="Unable to load your profile information. Please try again later."
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and account settings
        </p>
      </div>

      {updateSuccess && (
        <Alert
          type="success"
          message="Your profile has been updated successfully."
          className="mb-6"
          dismissible
          onDismiss={() => setUpdateSuccess(false)}
        />
      )}

      {updateError && (
        <Alert
          type="error"
          message={updateError}
          className="mb-6"
          dismissible
          onDismiss={() => setUpdateError(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            
            <Formik
              initialValues={{
                name: user.name || '',
                phone: user.phone || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, touched, errors }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        touched.name && errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={user.role === 'admin' ? 'Administrator' : user.role === 'student' ? 'Student' : 'Guest'}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                    />
                  </div>

                  {user.role === 'guest' && (
                    <div className="mb-4">
                      <label htmlFor="guest_code" className="block text-sm font-medium text-gray-700 mb-1">
                        Guest Code
                      </label>
                      <input
                        type="text"
                        id="guest_code"
                        value={user.guest_code || 'N/A'}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      id="phone"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                        touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(123) 456-7890"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            
            <div className="space-y-4">
              <div>
                <Button
                  to="/change-password"
                  variant="outline"
                  fullWidth
                >
                  Change Password
                </Button>
              </div>
              
              <div>
                <Button
                  to="/my-registrations"
                  variant="outline"
                  fullWidth
                >
                  My Event Registrations
                </Button>
              </div>
              
              {user.role === 'admin' && (
                <div>
                  <Button
                    to="/admin/dashboard"
                    variant="outline"
                    fullWidth
                  >
                    Admin Dashboard
                  </Button>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      // Implement account deletion logic
                      alert('Account deletion is not implemented in this demo.');
                    }
                  }}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile; 