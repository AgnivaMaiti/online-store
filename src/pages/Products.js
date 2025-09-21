import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";

export default function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.log(error);
    else setProducts(data);
  };

  const filteredProducts = products.filter((p) => {
    const priceMatch =
      (minPrice === "" || p.price >= parseInt(minPrice)) &&
      (maxPrice === "" || p.price <= parseInt(maxPrice));
    const ratingMatch = minRating === "" || p.rating >= parseFloat(minRating);
    return priceMatch && ratingMatch;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Our Artworks</h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
      </div>

      {/* Product grid */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} />
        ))}
        {filteredProducts.length === 0 && <p>No artworks match your filters.</p>}
      </div>
    </div>
  );
}
