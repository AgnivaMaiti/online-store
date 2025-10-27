import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Products from './Products';
import AdminPayments from './AdminPayments';
import Categories from './Categories';
import CustomProducts from './CustomProducts';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/custom-products" element={<CustomProducts />} />
        <Route path="*" element={<Navigate to="/admin/products" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPage;
