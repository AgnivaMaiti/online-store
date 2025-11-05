import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { toast } from 'react-toastify';

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [existingReview, setExistingReview] = useState(null);

  // Get the current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        checkExistingReview(user.id);
      }
    };
    getUser();
  }, [productId]);

  // Check if user already has a review for this product
  const checkExistingReview = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', userId)
        .single();

      if (data) {
        setExistingReview(data);
        setRating(data.rating);
        setComment(data.comment || '');
      }
    } catch (error) {
      console.log('No existing review found');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      let error;
      
      if (existingReview) {
        // Update existing review
        const { error: updateError } = await supabase
          .from('ratings')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);

        error = updateError;
      } else {
        // Insert new review
        const { error: insertError } = await supabase
          .from('ratings')
          .insert({
            product_id: productId,
            user_id: user.id,
            rating,
            comment
          });

        error = insertError;
      }

      if (error) throw error;

      toast.success(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
      
      // Refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      // If this was a new review, clear the form
      if (!existingReview) {
        setRating(0);
        setComment('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div style={{ margin: '20px 0', padding: '20px', textAlign: 'center' }}>
        <p>Please sign in to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="review-form" style={{ margin: '20px 0', padding: '20px' }}>
      <h3>{existingReview ? 'Update Your Review' : 'Write a Review'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  color: star <= rating ? '#ffd700' : '#ddd',
                  padding: '0 5px'
                }}
                aria-label={`${star} star`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="comment" style={{ display: 'block', marginBottom: '5px' }}>Review:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? 'Submitting...' : (existingReview ? 'Update Review' : 'Submit Review')}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;