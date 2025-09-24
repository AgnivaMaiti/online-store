import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import '../styles/Navbar.css';

export default function Navbar({ cartCount }) {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        
        <div className="nav-right">
          {user?.user_metadata?.role === 'admin' && (
            <div className="nav-admin">
              <Link to="/admin" className="admin-panel-link">
                Admin Panel
              </Link>
            </div>
          )}
          <div className="nav-cart">
            <Link to="/cart" className="cart-link">
              <FiShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
          
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="user-menu-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <span className="user-avatar">
                  <FiUser className="user-icon" />
                </span>
                <span className="user-email">
                  {user.email.split('@')[0]}
                </span>
                <FiChevronDown className={`dropdown-icon ${isUserMenuOpen ? 'open' : ''}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar-large">
                      <FiUser className="user-icon-large" />
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.email}</div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button 
                    className="dropdown-item sign-out"
                    onClick={handleSignOut}
                  >
                    <FiLogOut className="dropdown-icon" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/register" className="auth-button primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
