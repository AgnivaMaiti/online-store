import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Dynamic categories from products
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }
    
    // Create a map of category IDs to names
    const map = {};
    data.forEach(category => {
      map[category.id] = category.name;
    });
    
    setCategoryMap(map);
    setCategories(data);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      if (process.env.NODE_ENV === 'development') console.error(error);
    } else {
      setProducts(data);
    }
  };

  useEffect(() => {
    const filtered = products.filter((p) => {
      const searchMatch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const priceMatch =
        (minPrice === "" || p.price >= parseFloat(minPrice)) &&
        (maxPrice === "" || p.price <= parseFloat(maxPrice));
      
      const ratingMatch = minRating === "" || p.rating >= parseFloat(minRating);
      
      const categoryMatch = selectedCategory === "" || p.category === selectedCategory;
      
      return searchMatch && priceMatch && ratingMatch && categoryMatch;
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, minPrice, maxPrice, minRating, selectedCategory]);

  const clearFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedCategory("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Artworks</h2>

      <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "10px", width: "100%", maxWidth: "500px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "150px" }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Min Price (₹)</label>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ padding: "8px", width: "100px", borderRadius: "4px", border: "1px solid #ddd" }}
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
              style={{ padding: "8px", width: "100px", borderRadius: "4px", border: "1px solid #ddd" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Min Rating</label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", minWidth: "120px" }}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ ★</option>
              <option value="4">4+ ★</option>
              <option value="3">3+ ★</option>
              <option value="2">2+ ★</option>
              <option value="1">1+ ★</option>
            </select>
          </div>
          <div>
            <button 
              onClick={clearFilters}
              style={{ padding: "8px 16px", backgroundColor: "#e0e0e0", border: "1px solid #ccc", borderRadius: "4px", cursor: "pointer" }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {loading ? (
          <p>Loading products...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={{
                ...p,
                category_name: p.category ? (categoryMap[p.category] || 'Uncategorized') : 'Uncategorized'
              }} 
              addToCart={addToCart} 
            />
          ))
        ) : (
          <p>No artworks match your filters.</p>
        )}
      </div>
    </div>
  );
}