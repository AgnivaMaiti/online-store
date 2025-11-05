import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { useAuth } from '../contexts/AuthContext';

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews');
  const { user } = useAuth();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Product not found');

      setProduct(data);
      return data;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product');
      toast.error('Product not found');
      navigate('/products');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to add items to cart');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading product...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '40px' }}>{error}</div>;
  if (!product) return null;

  return (
    <div className="product-detail" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '40px' }}>
          {/* Product Image */}
          <div style={{ flex: 1, maxWidth: '600px' }}>
            <img 
              src={product.image} 
              alt={product.name}
              style={{ 
                width: '100%', 
                height: 'auto', 
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }} 
            />
          </div>

          {/* Product Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '10px' }}>{product.name}</h1>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '20px',
              color: '#666'
            }}>
              <div style={{ display: 'flex', marginRight: '15px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    style={{ 
                      color: star <= (product.average_rating || 0) ? '#ffd700' : '#ddd',
                      fontSize: '1.2rem'
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ marginLeft: '8px', fontSize: '0.9rem' }}>
                  ({product.review_count || 0} reviews)
                </span>
              </div>
            </div>

            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: '#4C1D95',
              margin: '20px 0'
            }}>
              ₹{product.price}
            </p>

            <p style={{ 
              marginBottom: '25px',
              lineHeight: '1.6',
              color: '#444'
            }}>
              {product.short_description || product.description?.substring(0, 200) + '...'}
            </p>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Quantity:
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  style={{
                    padding: '8px 15px',
                    border: '1px solid #ddd',
                    background: '#f8f8f8',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  -
                </button>
                <span style={{ 
                  display: 'inline-block', 
                  padding: '8px 20px',
                  borderTop: '1px solid #ddd',
                  borderBottom: '1px solid #ddd',
                }}>
                  {quantity}
                </span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  style={{
                    padding: '8px 15px',
                    border: '1px solid #ddd',
                    background: '#f8f8f8',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: '#8B5CF6',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                fontSize: '1rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%',
                maxWidth: '300px',
                marginBottom: '15px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#7C3AED'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#8B5CF6'}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #ddd',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => setActiveTab('description')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'description' ? '2px solid #8B5CF6' : 'none',
                color: activeTab === 'description' ? '#8B5CF6' : '#666',
                fontWeight: activeTab === 'description' ? '600' : '400'
              }}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'reviews' ? '2px solid #8B5CF6' : 'none',
                color: activeTab === 'reviews' ? '#8B5CF6' : '#666',
                fontWeight: activeTab === 'reviews' ? '600' : '400'
              }}
            >
              Reviews ({product.review_count || 0})
            </button>
          </div>

          <div style={{ padding: '20px 0' }}>
            {activeTab === 'description' && (
              <div>
                <h3>Product Details</h3>
                <p style={{ lineHeight: '1.7', color: '#444' }}>
                  {product.description || 'No description available.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
<ReviewList 
  productId={product.id} 
  onRatingUpdate={(avgRating, count) => {
    // Update the product's rating display
    setProduct(prev => ({
      ...prev,
      average_rating: avgRating,
      review_count: count
    }));
  }} 
/>                {user ? (
                  <div style={{ marginTop: '40px' }}>
                    <ReviewForm 
                      productId={product.id} 
                      onReviewSubmitted={() => {
                        // Refresh product data to update review count and rating
                        fetchProduct();
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <p>Please <a href="/login" style={{ color: '#8B5CF6', textDecoration: 'underline' }}>sign in</a> to write a review.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
