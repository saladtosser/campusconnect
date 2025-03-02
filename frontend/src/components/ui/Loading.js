import React from 'react';

const Loading = ({ size = 'md', fullPage = false, text = 'Loading...' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <div className={`animate-spin rounded-full ${spinnerSize} border-t-primary-600 border-primary-200 mx-auto`}></div>
          {text && <p className="mt-4 text-gray-700">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`animate-spin rounded-full ${spinnerSize} border-t-primary-600 border-primary-200`}></div>
      {text && <p className="mt-2 text-gray-700 text-sm">{text}</p>}
    </div>
  );
};

export default Loading; 