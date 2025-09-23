import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaTruck, FaCheckCircle } from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/admin/Orders.css';

const Orders = () => {
  const { 
    orders, 
    loading, 
    error, 
    updateOrderStatus,
    refetch 
  } = useAdmin();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders based on search and status filter
  const filteredOrders = (orders || []).filter(order => {
    if (!order) return false;
    
    // Safely handle potential undefined/null values
    const orderId = order.id || '';
    const userEmail = order.user_email || '';
    const transactionId = order.transaction_id || '';
    const orderStatus = order.status || '';
    
    const searchLower = (searchTerm || '').toLowerCase();
    
    const matchesSearch = 
      orderId.toString().toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      transactionId.toString().toLowerCase().includes(searchLower);
    
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="admin-orders">
      <div className="orders-header">
        <h2>Orders</h2>
        <div className="orders-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FaFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Email</th>
              <th>Date</th>
              <th>Total</th>
              <th>Payment Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id?.substring(0, 8) || 'N/A'}</td>
                <td>{order.user_email || 'N/A'}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>${order.total_amount?.toFixed(2) || '0.00'}</td>
                <td>
                  <span className={`status-badge ${order.payment_status?.toLowerCase() || 'unknown'}`}>
                    {order.payment_status || 'N/A'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${order.status?.toLowerCase() || 'unknown'}`}>
                    {order.status || 'N/A'}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="action-btn view"
                    onClick={() => {/* View order details */}}
                    title="View Order"
                  >
                    <FaEye />
                  </button>
                  {order.status && order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <>
                      {order.status === 'pending' && (
                        <button
                          className="action-btn process"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          title="Mark as Processing"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {['pending', 'processing'].includes(order.status) && (
                        <button
                          className="action-btn ship"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          title="Mark as Shipped"
                        >
                          <FaTruck />
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          className="action-btn deliver"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          title="Mark as Delivered"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <p>No orders found</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;