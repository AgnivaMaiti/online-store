import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from '../contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';
import '../styles/Navbar.css';

export default function Navbar({ cartCount }) {
  const { user, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sign out:', error);
    }
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      // Close user menu when clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    }

    // Close mobile menu when route changes
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when a nav link is clicked
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        
        <Link to="/" className="nav-logo">
          <img 
            src="/log.jpg" 
            alt="Artistic Deblina Logo" 
            style={{ 
              height: '50px',
              width: 'auto',
              objectFit: 'contain'
            }} 
          />
        </Link>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} ref={mobileMenuRef}>
          <Link to="/" className="nav-link" onClick={handleNavLinkClick}>Home</Link>
          <Link to="/products" className="nav-link" onClick={handleNavLinkClick}>Products</Link>
          <Link to="/customized" className="nav-link" onClick={handleNavLinkClick}>Customized</Link>
        </div>
        {isMobileMenuOpen && (
          <div 
            className="mobile-menu-overlay active" 
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        
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
