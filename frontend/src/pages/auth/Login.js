import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { login, reset } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState(null);

  // Get the return URL from location state or default to home
  const from = location.state?.from || '/';

  // Define validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Initial form values
  const initialValues = {
    email: '',
    password: '',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setLoginError(null);
    dispatch(login(values));
    setSubmitting(false);
  };

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    // Set error message if login fails
    if (error) {
      setLoginError(
        typeof error === 'string'
          ? error
          : 'Invalid email or password. Please try again.'
      );
    }

    // Reset auth state on unmount
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, error, navigate, from, dispatch]);

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CampusConnect account</p>
        </div>

        {loginError && (
          <Alert
            type="error"
            message={loginError}
            className="mb-6"
            dismissible
            onDismiss={() => setLoginError(null)}
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
                  Email Address
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
                <div className="flex justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </Link>
                </div>
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
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isSubmitting || isLoading}
                >
                  Sign In
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign up
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

export default Login; 