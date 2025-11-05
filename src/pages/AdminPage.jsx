// In src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminPayments from './admin/AdminPayments';
import Products from './admin/Products';
import CustomProducts from './admin/CustomProducts';
import Categories from './admin/Categories';
import AdminReviews from './admin/AdminReviews';
import '../styles/admin/AdminPage.css';

const AdminPage = () => {
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="admin-content">
        <Routes>
          <Route path="/" element={<Navigate to="payments" replace />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="products" element={<Products />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="custom-products" element={<CustomProducts />} />
          <Route path="categories" element={<Categories />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;