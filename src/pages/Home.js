import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-container" style={{ width: '100%', overflow: 'hidden' }}>
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
      <div className="content-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Welcome to Artistic Deblina</h1>
        <p className="intro-text">
          Imperfections are not flaws, but marks of life and beauty — like golden lines that hold together something even more precious than before. 
          Artistic Deblina was born from this belief, that true art is not about chasing perfection, but about finding meaning in every stroke, 
          every detail, and every corner it touches.
        </p>
        <div className="cta-buttons" style={{ marginTop: '2rem' }}>
          <Link to="/products" className="btn btn-primary" style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            marginRight: '10px'
          }}>
            View Gallery
          </Link>
          <Link to="/about" className="btn btn-outline" style={{
            padding: '10px 20px',
            border: '1px solid #007bff',
            color: '#007bff',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
