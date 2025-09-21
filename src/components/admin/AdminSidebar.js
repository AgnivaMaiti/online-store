import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaStar, FaPaintBrush, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const handleLogout = async () => {
    // Implement logout logic here
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className={activeTab === 'dashboard' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('dashboard')}
              className="nav-link"
            >
              <FaTachometerAlt className="nav-icon" />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li className={activeTab === 'products' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('products')}
              className="nav-link"
            >
              <FaBox className="nav-icon" />
              <span>Products</span>
            </button>
          </li>
          
          <li className={activeTab === 'orders' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('orders')}
              className="nav-link"
            >
              <FaShoppingCart className="nav-icon" />
              <span>Orders</span>
              <span className="badge">5</span>
            </button>
          </li>
          
          <li className={activeTab === 'reviews' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('reviews')}
              className="nav-link"
            >
              <FaStar className="nav-icon" />
              <span>Reviews</span>
              <span className="badge badge-warning">3</span>
            </button>
          </li>
          
          <li className={activeTab === 'custom-requests' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('custom-requests')}
              className="nav-link"
            >
              <FaPaintBrush className="nav-icon" />
              <span>Custom Requests</span>
              <span className="badge">2</span>
            </button>
          </li>
          
          <li className={activeTab === 'users' ? 'active' : ''}>
            <button 
              onClick={() => onTabChange('users')}
              className="nav-link"
            >
              <FaUsers className="nav-icon" />
              <span>Users</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
