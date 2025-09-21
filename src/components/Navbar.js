import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import '../styles/Navbar.css';

export default function Navbar({ cartCount }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <Link to="/" className="logo">Artwork Store</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About Us</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/customized" className="nav-link">Customized</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>
        
        <div className="nav-cart">
          <Link to="/cart" className="cart-link">
            <FiShoppingCart className="cart-icon" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
