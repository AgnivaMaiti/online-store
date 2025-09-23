import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaShoppingCart, 
  FaStar, 
  FaPaintBrush, 
  FaUsers, 
  FaSignOutAlt, 
  FaCreditCard,
  FaHome
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/admin/AdminSidebar.css';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === `/admin${path}` || 
           (path !== '/' && location.pathname.startsWith(`/admin${path}`));
  };

  // Navigation items
  const navItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: <FaTachometerAlt className="nav-icon" />,
      exact: true
    },
    { 
      path: '/products', 
      label: 'Products', 
      icon: <FaBox className="nav-icon" />
    },
    { 
      path: '/orders', 
      label: 'Orders', 
      icon: <FaShoppingCart className="nav-icon" />,
      badge: 5
    },
    { 
      path: '/reviews', 
      label: 'Reviews', 
      icon: <FaStar className="nav-icon" />,
      badge: 3,
      badgeVariant: 'warning'
    },
    { 
      path: '/custom-requests', 
      label: 'Custom Requests', 
      icon: <FaPaintBrush className="nav-icon" />,
      badge: 2
    },
    { 
      path: '/payments', 
      label: 'Payments', 
      icon: <FaCreditCard className="nav-icon" />
    },
    { 
      path: '/users', 
      label: 'Users', 
      icon: <FaUsers className="nav-icon" />
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
            <li key={item.path} className={isActive(item.path) ? 'active' : ''}>
              <NavLink 
                to={`/admin${item.path === '/' ? '' : item.path}`}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={item.exact}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`badge ${item.badgeVariant ? `badge-${item.badgeVariant}` : ''}`}>
                    {item.badge}
                  </span>
                )}
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
        
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
