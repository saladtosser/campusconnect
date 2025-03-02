import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { forgotPassword, reset } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading, error, message } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Define validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  // Initial form values
  const initialValues = {
    email: '',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setFormError(null);
    setFormSuccess(null);
    
    dispatch(forgotPassword(values.email))
      .unwrap()
      .then(() => {
        setFormSuccess('Password reset instructions have been sent to your email.');
        resetForm();
      })
      .catch((err) => {
        setFormError(
          typeof err === 'string'
            ? err
            : 'Failed to send password reset email. Please try again.'
        );
      });
    
    setSubmitting(false);
  };

  // Handle errors and success messages from Redux state
  useEffect(() => {
    if (error) {
      setFormError(
        typeof error === 'string'
          ? error
          : 'Failed to send password reset email. Please try again.'
      );
    }

    if (message) {
      setFormSuccess(message);
    }

    // Reset auth state on unmount
    return () => {
      dispatch(reset());
    };
  }, [error, message, dispatch]);

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to reset your password</p>
        </div>

        {formError && (
          <Alert
            type="error"
            message={formError}
            className="mb-6"
            dismissible
            onDismiss={() => setFormError(null)}
          />
        )}

        {formSuccess && (
          <Alert
            type="success"
            message={formSuccess}
            className="mb-6"
            dismissible
            onDismiss={() => setFormSuccess(null)}
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="mb-6">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  Send Reset Link
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default ForgotPassword; 