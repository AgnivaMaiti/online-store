// In src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Orders from './admin/Orders';
import AdminPayments from './AdminPayments';
import '../styles/admin/AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<AdminPayments />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;