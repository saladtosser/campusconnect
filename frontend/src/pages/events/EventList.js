import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../../store/slices/eventSlice';
import EventCard from '../../components/events/EventCard';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

const EventList = () => {
  const dispatch = useDispatch();
  const { events, isLoading, error } = useSelector((state) => state.events);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true);
  const [sortBy, setSortBy] = useState('start_time');
  
  useEffect(() => {
    dispatch(fetchEvents({ upcoming: showUpcomingOnly }));
  }, [dispatch, showUpcomingOnly]);
  
  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'start_time') {
      return new Date(a.start_time) - new Date(b.start_time);
    } else if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'location') {
      return a.location.localeCompare(b.location);
    }
    return 0;
  });
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Campus Events</h1>
        <p className="text-lg text-gray-600">
          Discover and register for upcoming events at your university.
        </p>
      </div>
      
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <label htmlFor="search" className="sr-only">
              Search events
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search events by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter toggle */}
            <div className="flex items-center">
              <input
                id="upcoming-only"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={showUpcomingOnly}
                onChange={() => setShowUpcomingOnly(!showUpcomingOnly)}
              />
              <label htmlFor="upcoming-only" className="ml-2 block text-sm text-gray-700">
                Show upcoming events only
              </label>
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mr-2">
                Sort by:
              </label>
              <select
                id="sort-by"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="start_time">Date (Soonest first)</option>
                <option value="name">Name (A-Z)</option>
                <option value="location">Location (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <Loading text="Loading events..." />
      ) : error ? (
        <Alert
          type="error"
          message={error}
          title="Error loading events"
          className="mb-4"
        />
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? `No events match your search "${searchTerm}"`
              : showUpcomingOnly
              ? "There are no upcoming events scheduled at this time."
              : "There are no events to display."}
          </p>
          {searchTerm && (
            <button
              className="mt-4 text-sm text-primary-600 hover:text-primary-500"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 