import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Navbar from '../Navbar';
import '../../styles/admin/AdminLayout.css';

const AdminLayout = ({ cartCount }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [navbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
        setNavbarOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (navbarOpen) setNavbarOpen(false);
  };

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Navbar Toggle */}
      <button 
        className={`mobile-nav-toggle ${navbarOpen ? 'open' : ''}`}
        onClick={toggleNavbar}
        aria-label={navbarOpen ? 'Close navigation' : 'Open navigation'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navbar */}
      <div className={`navbar-container ${navbarOpen ? 'open' : ''}`}>
        <Navbar cartCount={cartCount} isAdmin={true} />
      </div>

      {/* Mobile Sidebar Toggle */}
      <button 
        className={`mobile-sidebar-toggle ${sidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        <AdminSidebar />
      </aside>

      {/* Main Content */}
      <main className={`admin-main-content ${sidebarOpen ? 'sidebar-open' : ''} ${navbarOpen ? 'navbar-open' : ''}`}>
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </main>

      {/* Overlay for mobile */}
      {(sidebarOpen || navbarOpen) && isMobile && (
        <div 
          className="mobile-overlay" 
          onClick={() => {
            setSidebarOpen(false);
            setNavbarOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminLayout;
