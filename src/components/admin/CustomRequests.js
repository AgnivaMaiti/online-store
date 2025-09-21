import React, { useState } from 'react';
import { FaImage, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCheck, FaTimes, FaEllipsisH } from 'react-icons/fa';
import '../../styles/admin/CustomRequests.css';

// Mock data - replace with actual data from your API
const customRequests = [
  {
    id: 1,
    user: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1 (555) 123-4567',
    date: '2023-10-15',
    status: 'pending',
    description: 'I would like a custom portrait of my dog in watercolor style.',
    referenceImage: 'https://via.placeholder.com/150',
    size: '16x20 inches',
    medium: 'Watercolor',
    deadline: '2023-11-15',
    budget: 5000
  },
  {
    id: 2,
    user: 'Michael Wilson',
    email: 'michael@example.com',
    phone: '+1 (555) 987-6543',
    date: '2023-10-14',
    status: 'in_progress',
    description: 'Looking for an abstract painting for my living room wall. I like bold colors and geometric shapes.',
    referenceImage: 'https://via.placeholder.com/150',
    size: '24x36 inches',
    medium: 'Acrylic',
    deadline: '2023-11-30',
    budget: 7500
  }
];

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'status-pending'
  },
  in_progress: {
    label: 'In Progress',
    className: 'status-in-progress'
  },
  completed: {
    label: 'Completed',
    className: 'status-completed'
  },
  cancelled: {
    label: 'Cancelled',
    className: 'status-cancelled'
  }
};

const CustomRequests = () => {
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [requests, setRequests] = useState(customRequests);

  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const updateStatus = (id, newStatus) => {
    // TODO: Implement API call to update status
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: newStatus } : request
    ));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="custom-requests">
      <div className="section-header">
        <h3>Custom Art Requests</h3>
        <span className="badge">{requests.length}</span>
      </div>
      
      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="no-requests">
            <p>No custom requests found</p>
          </div>
        ) : (
          requests.map((request) => (
            <div 
              key={request.id} 
              className={`request-card ${expandedRequest === request.id ? 'expanded' : ''}`}
            >
              <div 
                className="request-summary"
                onClick={() => toggleExpand(request.id)}
              >
                <div className="request-image">
                  {request.referenceImage ? (
                    <img src={request.referenceImage} alt="Reference" />
                  ) : (
                    <div className="image-placeholder">
                      <FaImage className="placeholder-icon" />
                    </div>
                  )}
                </div>
                
                <div className="request-info">
                  <div className="user-details">
                    <h4>{request.user}</h4>
                    <div className="meta">
                      <span className="date">
                        <FaCalendarAlt className="meta-icon" />
                        {formatDate(request.date)}
                      </span>
                      <span className={`status ${statusConfig[request.status]?.className || ''}`}>
                        {statusConfig[request.status]?.label || request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="request-preview">
                    <p>{request.description.length > 100 
                      ? `${request.description.substring(0, 100)}...` 
                      : request.description}</p>
                  </div>
                  
                  <div className="request-meta">
                    <span className="budget">
                      <strong>Budget:</strong> {formatCurrency(request.budget)}
                    </span>
                    <span className="deadline">
                      <strong>Deadline:</strong> {formatDate(request.deadline)}
                    </span>
                  </div>
                </div>
                
                <div className="expand-icon">
                  <FaEllipsisH />
                </div>
              </div>
              
              {expandedRequest === request.id && (
                <div className="request-details">
                  <div className="details-grid">
                    <div className="detail-item">
                      <h5>Contact Information</h5>
                      <p><FaEnvelope className="detail-icon" /> {request.email}</p>
                      <p><FaPhone className="detail-icon" /> {request.phone}</p>
                    </div>
                    
                    <div className="detail-item">
                      <h5>Project Details</h5>
                      <p><strong>Size:</strong> {request.size}</p>
                      <p><strong>Medium:</strong> {request.medium}</p>
                      <p><strong>Deadline:</strong> {formatDate(request.deadline)}</p>
                      <p><strong>Budget:</strong> {formatCurrency(request.budget)}</p>
                    </div>
                    
                    <div className="detail-item full-width">
                      <h5>Description</h5>
                      <p>{request.description}</p>
                    </div>
                    
                    {request.referenceImage && (
                      <div className="detail-item full-width">
                        <h5>Reference Image</h5>
                        <div className="reference-image">
                          <img src={request.referenceImage} alt="Reference" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-accept"
                          onClick={() => updateStatus(request.id, 'in_progress')}
                        >
                          <FaCheck className="action-icon" /> Accept Request
                        </button>
                        <button 
                          className="btn btn-reject"
                          onClick={() => updateStatus(request.id, 'cancelled')}
                        >
                          <FaTimes className="action-icon" /> Reject
                        </button>
                      </>
                    )}
                    
                    {request.status === 'in_progress' && (
                      <>
                        <button 
                          className="btn btn-complete"
                          onClick={() => updateStatus(request.id, 'completed')}
                        >
                          Mark as Completed
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => updateStatus(request.id, 'pending')}
                        >
                          Move Back to Pending
                        </button>
                      </>
                    )}
                    
                    <button 
                      className="btn btn-text"
                      onClick={() => setExpandedRequest(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="view-all-container">
        <button className="view-all-btn">
          View All Requests
        </button>
      </div>
    </div>
  );
};

export default CustomRequests;
