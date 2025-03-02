import React from 'react';

const Card = ({
  children,
  className = '',
  title = null,
  subtitle = null,
  footer = null,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${hoverable ? 'transition-transform duration-200 hover:shadow-lg hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="p-4 border-b">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className="p-4">{children}</div>
      
      {footer && <div className="p-4 bg-gray-50 border-t">{footer}</div>}
    </div>
  );
};

export default Card; 