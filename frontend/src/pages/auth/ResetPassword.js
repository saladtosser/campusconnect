import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { resetPassword, reset } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { isLoading, error, message } = useSelector((state) => state.auth);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Define validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
  });

  // Initial form values
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setFormError(null);
    setFormSuccess(null);
    
    dispatch(resetPassword({ token, password: values.password }))
      .unwrap()
      .then(() => {
        setFormSuccess('Your password has been reset successfully.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      })
      .catch((err) => {
        setFormError(
          typeof err === 'string'
            ? err
            : 'Failed to reset password. Please try again or request a new reset link.'
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
          : 'Failed to reset password. Please try again or request a new reset link.'
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

  // Validate token exists
  useEffect(() => {
    if (!token) {
      setFormError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [token]);

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-600">Enter your new password</p>
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

        {!token ? (
          <div className="text-center mb-6">
            <p className="mb-4">
              The reset link appears to be invalid or expired. Please request a new password reset link.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Request New Link
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <ErrorMessage
                    name="confirmPassword"
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
                    Reset Password
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
        )}
      </Card>
    </div>
  );
};

export default ResetPassword; 