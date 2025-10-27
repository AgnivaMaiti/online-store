import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaHome, FaBox, FaStar, FaTags, FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.admin-sidebar');
      const toggleButton = document.querySelector('.sidebar-toggle');
      
      if (isOpen && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Close sidebar when route changes
    const handleRouteChange = () => {
      if (isMobile) {
        setIsOpen(false);
      }
    };

    // Handle window resize
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Close sidebar when switching to desktop view
      if (!mobile) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [isOpen, isMobile]);

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === `/admin${path}` || 
           (path !== '/' && location.pathname.startsWith(`/admin${path}`));
  };

  // Handle nav link click
  const handleNavClick = (e, path) => {
    if (isMobile) {
      e.preventDefault();
      setIsOpen(false);
      // Small delay to allow the sidebar to close before navigating
      setTimeout(() => navigate(`/admin${path}`), 300);
    }
  };

  // Navigation items
  const navItems = [
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: <FaCreditCard className="nav-icon" />
    },
    { 
      path: '/products', 
      label: 'Products', 
      icon: <FaBox className="nav-icon" />
    },
    { 
      path: '/custom-products', 
      label: 'Custom Products', 
      icon: <FaStar className="nav-icon" />
    },
    { 
      path: '/categories', 
      label: 'Categories', 
      icon: <FaTags className="nav-icon" />
    }
  ];

  return (
    <>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`} 
        onClick={toggleSidebar}
        aria-hidden="true"
      />
      
      <aside className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
      
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={`/admin${item.path}`}
                className={({ isActive: isActiveLink }) => 
                  `nav-link ${isActiveLink || isActive(item.path) ? 'active' : ''}`
                }
                onClick={(e) => handleNavClick(e, item.path)}
              >
                {item.icon}
                <span className="nav-link-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
        <div className="sidebar-footer">
          <NavLink to="/" className="home-link">
            <FaHome className="nav-icon" />
            <span className="nav-link-text">Back to Site</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
