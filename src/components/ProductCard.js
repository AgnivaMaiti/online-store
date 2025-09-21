export default function ProductCard({ product, addToCart }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "10px",
      margin: "10px",
      width: "220px",
      textAlign: "center",
      borderRadius: "8px",
      background: "#fff"
    }}>
      <img src={product.image} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <p>⭐ {product.rating}</p>
      <button onClick={() => addToCart(product)} style={{ padding: "5px 10px", marginTop: "5px" }}>Add to Cart</button>
    </div>
  );
}
