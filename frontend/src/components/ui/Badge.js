import React from 'react';
import PropTypes from 'prop-types';

const colorClasses = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-800',
  purple: 'bg-purple-100 text-purple-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  pink: 'bg-pink-100 text-pink-800',
};

const Badge = ({ color = 'gray', text, className = '' }) => {
  const colorClass = colorClasses[color] || colorClasses.gray;
  
  return (
    <span 
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClass} ${className}`}
    >
      {text}
    </span>
  );
};

Badge.propTypes = {
  color: PropTypes.oneOf(Object.keys(colorClasses)),
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Badge; 