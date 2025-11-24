import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { supabase } from '../supabaseClient';
import { FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa';

// Carousel component
const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Replace these with your actual image paths
  const carouselImages = [
    '/images/imga1.jpg',
    '/images/imga2.jpg',
    '/images/imga3.jpg',
    '/images/imga4.jpg'
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div style={{ 
      width: '100%', 
      overflow: 'hidden',
      margin: '40px 0',
      position: 'relative',
      height: '400px'
    }}>
      <div style={{
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
        transform: `translateX(-${currentSlide * 100}%)`,
        height: '100%'
      }}>
        {carouselImages.map((img, index) => (
          <div 
            key={index}
            style={{
              minWidth: '100%',
              height: '100%',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px'
      }}>
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentSlide === index ? '#8B5CF6' : 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: 0
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Home({ addToCart }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(4);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        // Error fetching featured products
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);
  return (
    <div className="home-container" style={{ width: '100%', overflow: 'hidden' }}>
      {/* Banner Section */}
      <div className="banner-container" style={{
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        position: 'relative',
        margin: '0',
        padding: '0'
      }}>
        <img 
          src="/images/banner.jpg" 
          alt="Artistic Deblina - Handmade Artworks" 
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: '60vh',
            objectFit: 'cover',
            objectPosition: 'center',
            margin: '0',
            padding: '0',
            border: 'none'
          }}
        />
      </div>

      {/* Carousel Section */}
      <ImageCarousel />

      {/* Main Content */}
      <div className="content-container" style={{ 
        padding: "40px 20px", 
        maxWidth: "1200px", 
        margin: "0 auto",
        lineHeight: '1.8',
        fontSize: '1.1rem'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome to Artistic Deblina</h1>
        
        <p style={{ marginBottom: '20px', fontSize: '1.2rem', lineHeight: '1.8' }}>
          Imperfections are not flaws, but marks of life and beauty — like golden lines that hold together something even more precious than before. 
          Artistic Deblina was born from this belief, that true art is not about chasing perfection, but about finding meaning in every stroke, 
          every detail, and every corner it touches.
        </p>

        <p style={{ marginBottom: '20px' }}>
          From hand-painted garments and personalized bookmarks to unique pieces of home décor, 
          each creation carries a part of this philosophy — to bring warmth, soul, and vibrance 
          into everyday living. Art here is not just an object; it is a story, a feeling, and a 
          reminder that beauty often lies in the unexpected.
        </p>
        
        <p style={{ marginBottom: '30px' }}>
          The mission is simple yet profound — to beautify every corner of Indian homes with art 
          that uplifts, inspires, and transforms spaces into places of joy and belonging.
        </p>
        
        <div className="cta-buttons" style={{ 
          display: 'flex', 
          justifyContent: 'center',
          gap: '15px',
          marginTop: '40px',
          marginBottom: '40px'
        }}>
          <Link 
            to="/products" 
            className="btn btn-primary" 
            style={{
              padding: '12px 24px',
              backgroundColor: '#8B5CF6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              textAlign: 'center',
              minWidth: '150px'
            }}
          >
            View Gallery
          </Link>
          <Link 
            to="/customized" 
            className="btn btn-outline" 
            style={{
              padding: '12px 24px',
              border: '2px solid #8B5CF6',
              color: '#8B5CF6',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: '500',
              transition: 'all 0.2s',
              textAlign: 'center',
              minWidth: '150px'
            }}
          >
            Custom Orders
          </Link>
        </div>
        
        {/* Featured Products Section */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: '#000000ff',
            position: 'relative',
            paddingBottom: '10px',
            fontSize: '2em',
            fontWeight: '600'
          }}>
            Featured Artworks
            <div style={{
              height: '3px',
              width: '80px',
              backgroundColor: '#8B5CF6',
              margin: '15px auto 0',
              borderRadius: '3px'
            }}></div>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '25px',
            margin: '30px 0 50px',
            padding: '0 10px'
          }}>
            {loading ? (
              <div>Loading products...</div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  addToCart={addToCart}
                />
              ))
            ) : (
              <div>No featured products available</div>
            )}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link 
              to="/products" 
              style={{
                display: 'inline-block',
                padding: '10px 25px',
                backgroundColor: '#8B5CF6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: '500',
                transition: 'background-color 0.2s',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1em',
                marginTop: '10px',
                ':hover': {
                  backgroundColor: '#7C3AED'
                }
              }}
            >
              View All Products
            </Link>
          </div>
        </div>
        

        {/* Contact Section */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          padding: '30px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '25px',
            color: '#333',
            position: 'relative',
            paddingBottom: '10px',
            fontSize: '1.8em',
            fontWeight: '600'
          }}>
            Contact Us
            <div style={{
              height: '3px',
              width: '80px',
              backgroundColor: '#8B5CF6',
              margin: '15px auto 0',
              borderRadius: '3px'
            }}></div>
          </h2>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '400px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaEnvelope size={20} color="#8B5CF6" />
              <span>Email: artisticdeblina@gmail.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FaWhatsapp size={20} color="#25D366" />
              <span>+91 9051233055</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <a 
                href="https://www.instagram.com/artisticdeblina/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  color: '#333',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#8B5CF6'}
                onMouseOut={(e) => e.currentTarget.style.color = '#333'}
              >
                <FaInstagram size={20} color="#E1306C" />
                <span>@artisticdeblina</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
