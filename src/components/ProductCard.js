// src/components/ProductCard.js
export default function ProductCard({ product, addToCart }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "15px",
      margin: "10px",
      width: "220px",
      textAlign: "center",
      borderRadius: "8px",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      <img 
        src={product.image} 
        alt={product.name} 
        style={{ 
          width: "100%", 
          height: "150px", 
          objectFit: "cover",
          borderRadius: "4px"
        }} 
      />
      <h3 style={{ margin: "5px 0" }}>{product.name}</h3>
      <div style={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: "5px",
        justifyContent: "center",
        margin: "5px 0"
      }}>
        {product.categories?.map((category, index) => (
          <span 
            key={index}
            style={{
              backgroundColor: "#F3E8FF",
              color: "#333",
              padding: "3px 8px",
              borderRadius: "12px",
              fontSize: "0.8em",
              fontWeight: "500"
            }}
          >
            {category}
          </span>
        ))}
      </div>
      <p style={{ 
        fontSize: "1.2em",
        fontWeight: "bold",
        color: "#4C1D95",
        margin: "5px 0"
      }}>₹{product.price}</p>
      <button 
        onClick={() => addToCart(product)} 
        style={{ 
          padding: "8px 15px",
          marginTop: "auto",
          backgroundColor: "#8B5CF6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.2s",
          fontSize: "0.9em"
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = "#7C3AED"}
        onMouseOut={(e) => e.target.style.backgroundColor = "#8B5CF6"}
      >
        Add to Cart
      </button>
    </div>
  );
}