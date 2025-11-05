import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ReviewList = ({ productId, onRatingUpdate }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      console.log('Fetching reviews for product:', productId);
      
      // Fetch all ratings for the product
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      console.log('Raw ratings data:', ratingsData);
      
      if (ratingsError) throw ratingsError;

      // If no ratings found, set empty array and return
      if (!ratingsData || ratingsData.length === 0) {
        console.log('No ratings found for this product');
        setReviews([]);
        setAverageRating(0);
        setReviewCount(0);
        if (onRatingUpdate) onRatingUpdate(0, 0);
        return;
      }

      // Calculate average rating
      const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = Math.round((sum / ratingsData.length) * 10) / 10; // Round to 1 decimal place
      
      setAverageRating(avg);
      setReviewCount(ratingsData.length);
      
      // Notify parent component about the updated rating
      if (onRatingUpdate) onRatingUpdate(avg, ratingsData.length);

      // Format the reviews with user data
      const formattedReviews = ratingsData.map(review => ({
        ...review,
        user: {
          id: review.user_id,
          name: 'User', // Default name
          avatar: null
        }
      }));

      console.log('Formatted reviews:', formattedReviews);
      setReviews(formattedReviews);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="reviews-list" style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Customer Reviews</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginRight: '20px' 
          }}>
            <span style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginRight: '10px' 
            }}>
              {averageRating.toFixed(1)}
            </span>
            <div style={{ color: '#ffd700' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ fontSize: '18px' }}>
                  {star <= Math.round(averageRating) ? '★' : '☆'}
                </span>
              ))}
            </div>
          </div>
          <span style={{ color: '#666' }}>
            {reviewCount} Review{reviewCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      {reviews.length === 0 ? (
        <p>No reviews yet. Be the first to review!</p>
      ) : (
        reviews.map((review) => (
          <div 
            key={review.id} 
            style={{
              borderBottom: '1px solid #eee',
              padding: '15px 0',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '10px',
                overflow: 'hidden'
              }}>
                {review.user?.avatar ? (
                  <img 
                    src={review.user.avatar} 
                    alt={review.user?.name || 'User'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '20px' }}>👤</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'User'}</div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ color: '#ffd700' }}>
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i} style={{ fontSize: '18px' }}>
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {review.comment && (
              <p style={{ margin: '10px 0 0 50px', lineHeight: '1.5' }}>{review.comment}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;