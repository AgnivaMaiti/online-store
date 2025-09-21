import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaTruck, 
  FaShoppingBag,
  FaEllipsisH
} from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import '../../styles/admin/Orders.css';

const Orders = () => {
  const { 
    orders, 
    loading, 
    error, 
    updateOrderStatus,
    refetch
  } = useAdmin();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: 'all',
    sortBy: 'newest',
  });
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(order => 
      !filters.status || order.status === filters.status
    )
    .filter(order => {
      if (filters.dateRange === 'today') {
        const today = new Date();
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === today.getDate() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear()
        );
      } else if (filters.dateRange === 'thisWeek') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(order.createdAt) >= oneWeekAgo;
      } else if (filters.dateRange === 'thisMonth') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(order.createdAt) >= oneMonthAgo;
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'totalHigh':
          return b.total - a.total;
        case 'totalLow':
          return a.total - b.total;
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      dateRange: 'all',
      sortBy: 'newest',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Open view order modal
  const openViewModal = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Open status update modal
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setIsStatusModalOpen(false);
      refetch();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon" />;
      case 'processing':
        return <FaShoppingBag className="status-icon" />;
      case 'shipped':
        return <FaTruck className="status-icon" />;
      case 'delivered':
        return <FaCheck className="status-icon" />;
      case 'cancelled':
        return <FaTimes className="status-icon" />;
      default:
        return <FaClock className="status-icon" />;
    }
  };

  // Get status options based on current status
  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      delivered: [],
      cancelled: []
    };
    
    return statusFlow[currentStatus] || [];
  };

  // Fetch orders on component mount
  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="orders-admin">
      <div className="admin-header">
        <h1>Orders</h1>
        <p>Manage and track customer orders</p>
      </div>

      <div className="orders-toolbar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters-container">
          <button 
            className={`btn btn-outline ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="btn-icon" /> Filters
          </button>
          
          {showFilters && (
            <div className="filters-dropdown">
              <div className="filter-group">
                <label>Order Status</label>
                <select 
                  name="status"
                  value={filters.status}
                  onChange={handleInputChange}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Date Range</label>
                <select 
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleInputChange}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="thisWeek">This Week</option>
                  <option value="thisMonth">This Month</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Sort By</label>
                <select 
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleInputChange}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="totalHigh">Total: High to Low</option>
                  <option value="totalLow">Total: Low to High</option>
                </select>
              </div>
              
              <button 
                className="btn btn-text"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="orders-table-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found. Try adjusting your search or filters.</p>
            <button 
              className="btn btn-primary"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">#{order.id.substring(0, 8)}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.customer?.name || 'Guest'}
                        </div>
                        <div className="customer-email">
                          {order.customer?.email || 'No email'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="order-date">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <div className="order-items-count">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="order-total">
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-icon"
                        onClick={() => openViewModal(order)}
                        title="View Order"
                      >
                        <FaEye />
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => openStatusModal(order)}
                        title="Update Status"
                      >
                        <FaEllipsisH />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {totalPages > 1 && (
              <div className="pagination-container">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={paginate}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal order-details-modal">
            <div className="modal-header">
              <h3>Order #{selectedOrder.id.substring(0, 8)}</h3>
              <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-details-grid">
                <div className="order-section">
                  <h4>Order Summary</h4>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Order Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Status:</span>
                      <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span>Payment Method:</span>
                      <span>{selectedOrder.paymentMethod || 'Credit Card'}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Order Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-section">
                  <h4>Customer Information</h4>
                  <div className="customer-details">
                    <div className="detail-row">
                      <span>Name:</span>
                      <span>{selectedOrder.customer?.name || 'Guest'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Email:</span>
                      <span>{selectedOrder.customer?.email || 'No email provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span>Phone:</span>
                      <span>{selectedOrder.customer?.phone || 'No phone provided'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-section shipping-address">
                  <h4>Shipping Address</h4>
                  {selectedOrder.shippingAddress ? (
                    <address>
                      <div>{selectedOrder.shippingAddress.name}</div>
                      <div>{selectedOrder.shippingAddress.street}</div>
                      <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</div>
                      <div>{selectedOrder.shippingAddress.country}</div>
                    </address>
                  ) : (
                    <p>No shipping address provided</p>
                  )}
                </div>
                
                <div className="order-section order-items">
                  <h4>Order Items</h4>
                  <div className="items-list">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          {item.image ? (
                            <img src={item.image} alt={item.name} />
                          ) : (
                            <div className="image-placeholder">
                              <FaShoppingBag />
                            </div>
                          )}
                        </div>
                        <div className="item-details">
                          <div className="item-name">{item.name}</div>
                          <div className="item-price">{formatCurrency(item.price)} x {item.quantity}</div>
                          {item.variants && (
                            <div className="item-variants">
                              {Object.entries(item.variants).map(([key, value]) => (
                                <span key={key} className="variant">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="item-total">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-totals">
                    <div className="total-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal || selectedOrder.total)}</span>
                    </div>
                    {selectedOrder.shippingCost > 0 && (
                      <div className="total-row">
                        <span>Shipping:</span>
                        <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                      </div>
                    )}
                    {selectedOrder.tax > 0 && (
                      <div className="total-row">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                    )}
                    <div className="total-row grand-total">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openStatusModal(selectedOrder);
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Status Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal status-modal">
            <div className="modal-header">
              <h3>Update Order Status</h3>
              <button className="close-btn" onClick={() => setIsStatusModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p>Update the status of order <strong>#{selectedOrder.id.substring(0, 8)}</strong>:</p>
              
              <div className="status-options">
                {getStatusOptions(selectedOrder.status).length > 0 ? (
                  getStatusOptions(selectedOrder.status).map((status) => (
                    <button
                      key={status}
                      className={`status-option ${status}`}
                      onClick={() => handleStatusUpdate(status)}
                    >
                      {getStatusIcon(status)}
                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    </button>
                  ))
                ) : (
                  <div className="no-options">
                    No further status updates available. Current status is "{selectedOrder.status}".
                  </div>
                )}
              </div>
              
              {selectedOrder.status === 'shipped' && (
                <div className="shipping-info">
                  <h4>Shipping Information</h4>
                  <div className="form-group">
                    <label>Tracking Number</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Carrier</label>
                    <select className="form-control">
                      <option value="">Select carrier</option>
                      <option value="usps">USPS</option>
                      <option value="ups">UPS</option>
                      <option value="fedex">FedEx</option>
                      <option value="dhl">DHL</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-outline"
                onClick={() => setIsStatusModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                disabled={getStatusOptions(selectedOrder.status).length === 0}
                onClick={() => {
                  const nextStatus = getStatusOptions(selectedOrder.status)[0];
                  if (nextStatus) {
                    handleStatusUpdate(nextStatus);
                  }
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
