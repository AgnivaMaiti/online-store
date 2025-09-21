import { Link } from "react-router-dom";

export default function Navbar({ cartCount }) {
  return (
    <nav style={{ padding: "10px", background: "#E6E6FA" }}> {/* Lavender background */}
      <Link to="/" style={{ marginRight: 20 }}>Home</Link>
      <Link to="/about" style={{ marginRight: 20 }}>About Us</Link>
      <Link to="/products" style={{ marginRight: 20 }}>Products</Link>
      <Link to="/customized" style={{ marginRight: 20 }}>Customized</Link>
      <Link to="/contact" style={{ marginRight: 20 }}>Contact</Link>
      <Link to="/cart">Cart ({cartCount})</Link>
    </nav>
  );
}
