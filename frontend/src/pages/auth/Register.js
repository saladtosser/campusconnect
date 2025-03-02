import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { register, reset } from '../../store/slices/authSlice';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);
  const [registerError, setRegisterError] = useState(null);

  // Define validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    password2: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    role: Yup.string()
      .required('Please select a role')
      .oneOf(['student', 'guest'], 'Invalid role'),
    guest_code: Yup.string()
      .when('role', {
        is: 'guest',
        then: Yup.string().required('Guest code is required for guest accounts'),
        otherwise: Yup.string(),
      }),
  });

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student',
    guest_code: '',
    phone: '',
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setRegisterError(null);
    dispatch(register(values));
    setSubmitting(false);
  };

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    // Set error message if registration fails
    if (error) {
      setRegisterError(
        typeof error === 'string'
          ? error
          : 'Registration failed. Please check your information and try again.'
      );
    }

    // Reset auth state on unmount
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, error, navigate, dispatch]);

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-600">Join CampusConnect to register for events</p>
        </div>

        {registerError && (
          <Alert
            type="error"
            message={registerError}
            className="mb-6"
            dismissible
            onDismiss={() => setRegisterError(null)}
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors, values }) => (
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
                  placeholder="John Doe"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

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

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <Field
                  type="tel"
                  name="phone"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="role"
                  id="role"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    touched.role && errors.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="student">Student</option>
                  <option value="guest">Guest</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {values.role === 'guest' && (
                <div className="mb-4">
                  <label htmlFor="guest_code" className="block text-sm font-medium text-gray-700 mb-1">
                    Guest Code <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="guest_code"
                    id="guest_code"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      touched.guest_code && errors.guest_code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your guest code"
                  />
                  <ErrorMessage
                    name="guest_code"
                    component="p"
                    className="mt-1 text-sm text-red-600"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Guest codes are provided by event organizers.
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
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
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <Field
                  type="password"
                  name="password2"
                  id="password2"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    touched.password2 && errors.password2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <ErrorMessage
                  name="password2"
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
                  Create Account
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;

 