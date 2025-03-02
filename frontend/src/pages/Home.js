import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../store/slices/eventSlice';
import EventCard from '../components/events/EventCard';
import Button from '../components/ui/Button';
import Loading from '../components/ui/Loading';

const Home = () => {
  const dispatch = useDispatch();
  const { events, isLoading } = useSelector((state) => state.events);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEvents({ upcoming: true }));
  }, [dispatch]);

  // Get only the first 3 events for the featured section
  const featuredEvents = events.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 rounded-lg mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover and Join Campus Events
            </h1>
            <p className="text-xl mb-8">
              CampusConnect makes it easy to find, register, and check in to university events.
              Never miss an opportunity to connect with your campus community.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                to="/events"
                size="lg"
                variant="secondary"
                className="font-semibold"
              >
                Browse Events
              </Button>
              {!isAuthenticated && (
                <Button
                  to="/register"
                  size="lg"
                  variant="outline"
                  className="bg-white text-primary-700 border-white hover:bg-primary-50 font-semibold"
                >
                  Sign Up Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <Link to="/events" className="text-primary-600 hover:text-primary-700 font-medium">
            View All Events →
          </Link>
        </div>

        {isLoading ? (
          <Loading text="Loading events..." />
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Upcoming Events</h3>
            <p className="text-gray-600 mb-4">
              There are no upcoming events scheduled at the moment.
            </p>
            <Button to="/events" variant="outline">
              Browse All Events
            </Button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Use CampusConnect?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Events</h3>
            <p className="text-gray-600">
              Browse and search for events happening across campus. Filter by date, location, or type.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Registration</h3>
            <p className="text-gray-600">
              Register for events with just a few clicks. Receive confirmation and reminders.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">QR Code Check-in</h3>
            <p className="text-gray-600">
              Skip the lines with our QR code check-in system. Fast and contactless entry to events.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Join CampusConnect today and never miss another campus event. Our platform makes it easy to
          discover, register, and attend events that matter to you.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/events" size="lg">
            Browse Events
          </Button>
          {!isAuthenticated && (
            <Button to="/register" variant="outline" size="lg">
              Create Account
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 