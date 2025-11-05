import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ratings')
        .select(`
          *,
          products (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // Use the Supabase client directly with RLS policies
      const { error } = await supabase
        .from('ratings')
        .delete()
        .eq('id', reviewId);

      if (error) {
        console.error('Delete error details:', error);
        throw error;
      }

      toast.success('Review deleted successfully');
      // Remove the deleted review from the local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error(`Failed to delete review: ${err.message || 'Unknown error'}`);
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (loading) return <div className="loading">Loading reviews...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-reviews">
      <div className="admin-header">
        <h1>Manage Reviews</h1>
        <p>View and manage all product reviews</p>
      </div>

      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.products?.name || 'N/A'}</td>
                  <td>
                    <div style={{ color: '#ffd700' }}>
                      {Array(5).fill(0).map((_, i) => (
                        <span key={i} style={{ fontSize: '16px' }}>
                          {i < review.rating ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="comment-cell">
                    {review.comment || 'No comment'}
                  </td>
                  <td>{new Date(review.created_at).toLocaleDateString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDeleteReview(review.id)}
                      className="delete-btn"
                      title="Delete Review"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <style>{`
        .admin-reviews {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-header {
          margin-bottom: 30px;
        }
        .admin-header h1 {
          margin: 0 0 10px 0;
          color: #333;
        }
        .reviews-table-container {
          overflow-x: auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .reviews-table {
          width: 100%;
          border-collapse: collapse;
        }
        .reviews-table th, 
        .reviews-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }
        .reviews-table th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #555;
        }
        .reviews-table tr:hover {
          background-color: #f9f9f9;
        }
        .comment-cell {
          max-width: 300px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .delete-btn {
          background-color: #ff4444;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        .delete-btn:hover {
          background-color: #cc0000;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 20px;
        }
        .pagination button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .loading, .error {
          padding: 20px;
          text-align: center;
          font-size: 16px;
        }
        .error {
          color: #dc3545;
        }
      `}</style>
    </div>
  );
};

export default AdminReviews;
