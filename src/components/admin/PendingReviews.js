import React, { useState } from 'react';
import { FaStar, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import '../../styles/admin/PendingReviews.css';

// Mock data - replace with actual data from your API
const pendingReviews = [
  {
    id: 1,
    user: 'John Doe',
    product: 'Sunset Painting',
    rating: 5,
    comment: 'Absolutely love this painting! The colors are even more vibrant in person.',
    date: '2023-10-15',
    avatar: null
  },
  {
    id: 2,
    user: 'Jane Smith',
    product: 'Abstract Art',
    rating: 4,
    comment: 'Great quality and fast shipping. The artwork looks amazing on my wall.',
    date: '2023-10-14',
    avatar: null
  },
  {
    id: 3,
    user: 'Robert Johnson',
    product: 'Floral Watercolor',
    rating: 5,
    comment: 'Exceeded my expectations! The details are incredible.',
    date: '2023-10-13',
    avatar: null
  }
];

const PendingReviews = () => {
  const [reviews, setReviews] = useState(pendingReviews);

  const handleApprove = (id) => {
    // TODO: Implement API call to approve review
    setReviews(reviews.filter(review => review.id !== id));
  };

  const handleReject = (id) => {
    // TODO: Implement API call to reject review
    setReviews(reviews.filter(review => review.id !== id));
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''}`} 
      />
    ));
  };

  if (reviews.length === 0) {
    return (
      <div className="pending-reviews">
        <div className="section-header">
          <h3>Pending Reviews</h3>
          <span className="badge">0</span>
        </div>
        <div className="no-reviews">
          <p>No pending reviews</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-reviews">
      <div className="section-header">
        <h3>Pending Reviews</h3>
        <span className="badge">{reviews.length}</span>
      </div>
      
      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="user-avatar">
                {review.avatar ? (
                  <img src={review.avatar} alt={review.user} />
                ) : (
                  <div className="avatar-placeholder">
                    <FaUser className="user-icon" />
                  </div>
                )}
              </div>
              <div className="user-info">
                <h4>{review.user}</h4>
                <div className="rating">
                  {renderStars(review.rating)}
                  <span className="product-name">for {review.product}</span>
                </div>
                <span className="review-date">{review.date}</span>
              </div>
            </div>
            
            <div className="review-content">
              <p>{review.comment}</p>
            </div>
            
            <div className="review-actions">
              <button 
                className="btn-approve"
                onClick={() => handleApprove(review.id)}
              >
                <FaCheck className="action-icon" />
                Approve
              </button>
              <button 
                className="btn-reject"
                onClick={() => handleReject(review.id)}
              >
                <FaTimes className="action-icon" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="view-all-container">
        <button className="view-all-btn">
          View All Reviews
        </button>
      </div>
    </div>
  );
};

export default PendingReviews;
