import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../../styles/common/ErrorMessage.css';

const ErrorMessage = ({ 
  message = 'An error occurred. Please try again later.', 
  onRetry,
  className = ''
}) => {
  return (
    <div className={`error-message ${className}`}>
      <div className="error-icon">
        <FaExclamationCircle />
      </div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="retry-button"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
