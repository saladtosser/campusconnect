import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Helper function to safely format dates
const formatDate = (dateString, formatString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatString);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'Invalid date';
  }
};

const EventCard = ({ event }) => {
  const {
    id,
    name,
    description,
    location,
    start_time,
    end_time,
    capacity,
    active,
    background_image,
  } = event;

  // Format dates
  const formattedStartDate = formatDate(start_time, 'MMM d, yyyy');
  const formattedStartTime = formatDate(start_time, 'h:mm a');
  const formattedEndTime = formatDate(end_time, 'h:mm a');

  // Check if event is in the past
  const isPast = end_time ? new Date(end_time) < new Date() : false;

  // Truncate description
  const truncatedDescription = description ? 
    (description.length > 120 ? `${description.substring(0, 120)}...` : description) : 
    'No description available';

  return (
    <Card
      className="h-full flex flex-col"
      hoverable
    >
      <div className="relative">
        <img
          src={background_image || 'https://via.placeholder.com/400x200?text=Event'}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {!active && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Inactive
          </div>
        )}
        {isPast && (
          <div className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded">
            Past Event
          </div>
        )}
      </div>

      <div className="flex-grow p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 text-sm">{truncatedDescription}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="text-gray-700">{location}</span>
          </div>

          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
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
            <div>
              <div className="text-gray-700">{formattedStartDate}</div>
              <div className="text-gray-600 text-sm">
                {formattedStartTime} - {formattedEndTime}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="h-5 w-5 text-gray-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span className="text-gray-700">Capacity: {capacity}</span>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 mt-auto">
        <Button to={`/events/${id}`} fullWidth>
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default EventCard; 