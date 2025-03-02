import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = isAuthenticated && user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            CampusConnect
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/events" className="hover:text-primary-200">
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/my-registrations" className="hover:text-primary-200">
                  My Registrations
                </Link>

                {isAdmin && (
                  <Link to="/admin/dashboard" className="hover:text-primary-200">
                    Admin
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center hover:text-primary-200">
                    {user?.name || 'User'}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-primary-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              to="/events"
              className="block hover:text-primary-200"
              onClick={() => setIsOpen(false)}
            >
              Events
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-registrations"
                  className="block hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  My Registrations
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="block hover:text-primary-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="block hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left hover:text-primary-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-primary-200"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-primary-600 px-4 py-2 rounded-md hover:bg-primary-100 inline-block"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 