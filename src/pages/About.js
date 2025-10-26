export default function About() {
  return (
    <div className="about-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div className="about-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>Our Story</h1>
        <div className="divider" style={{ 
          height: '3px', 
          width: '80px', 
          backgroundColor: '#007bff', 
          margin: '15px auto 30px' 
        }}></div>
      </div>
      
      <div className="about-content" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p style={{ marginBottom: '20px' }}>
          From hand-painted garments and personalized bookmarks to unique pieces of home décor, 
          each creation carries a part of this philosophy — to bring warmth, soul, and vibrance 
          into everyday living. Art here is not just an object; it is a story, a feeling, and a 
          reminder that beauty often lies in the unexpected.
        </p>
        
        <p style={{ marginBottom: '20px' }}>
          The mission is simple yet profound — to beautify every corner of Indian homes with art 
          that uplifts, inspires, and transforms spaces into places of joy and belonging.
        </p>
        
        <div className="artist-bio" style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '8px',
          marginTop: '40px'
        }}>
          <h3>About Deblina</h3>
          <p>
            Deblina Mukherjee is a contemporary artist specializing in watercolor and acrylic paintings. 
            Her work is a celebration of imperfection and the beauty found in the details that make each 
            piece unique and meaningful.
          </p>
        </div>
      </div>
    </div>
  );
}
