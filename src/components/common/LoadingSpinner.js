import React from 'react';
import '../../styles/common/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4',
  };

  const spinner = (
    <div className="spinner-container">
      <div className={`spinner ${sizeClasses[size] || sizeClasses.md}`}></div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="full-page-spinner">
        {spinner}
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
