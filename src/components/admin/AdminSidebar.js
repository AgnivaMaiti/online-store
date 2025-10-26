import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaCreditCard, FaHome, FaBox, FaStar, FaTags } from 'react-icons/fa';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === `/admin${path}` || 
           (path !== '/' && location.pathname.startsWith(`/admin${path}`));
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
    <aside className="admin-sidebar">
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
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <NavLink to="/" className="home-link">
          <FaHome className="nav-icon" />
          <span>Back to Site</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
