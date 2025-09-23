import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      // debug-only log
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') console.error(error);
    } else setProducts(data);
  };

  useEffect(() => {
    const filtered = products.filter((p) => {
      // Search term filter
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         searchTerm === "";
      
      // Price range filter
      const priceMatch =
        (minPrice === "" || p.price >= (parseInt(minPrice) || 0)) &&
        (maxPrice === "" || p.price <= (parseInt(maxPrice) || Infinity));
      
      // Rating filter
      const ratingMatch = minRating === "" || p.rating >= (parseFloat(minRating) || 0);
      
      return searchMatch && priceMatch && ratingMatch;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, minPrice, maxPrice, minRating]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Artworks</h2>

      {/* Search and Filters */}
      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search artworks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "4px",
              border: "1px solid #ddd"
            }}
          />
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Min Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                padding: "8px",
                width: "100px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Max Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                padding: "8px",
                width: "100px",
                borderRadius: "4px",
                border: "1px solid #ddd"
              }}
            />
          </div>
          
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ddd",
                minWidth: "120px"
              }}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4">4+ ★</option>
              <option value="3">3+ ★</option>
              <option value="2">2+ ★</option>
              <option value="1">1+ ★</option>
            </select>
          </div>
          
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button 
              onClick={() => {
                setSearchTerm("");
                setMinPrice("");
                setMaxPrice("");
                setMinRating("");
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
        {filteredProducts.length === 0 && <p>No artworks match your filters.</p>}
      </div>

      {/* debug-only log
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV === 'development') console.debug('Products loaded', products); */}
    </div>
  );
}
