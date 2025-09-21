import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCheckCircle, FaClock, FaTimesCircle, FaTruck } from 'react-icons/fa';
import '../../styles/admin/RecentOrders.css';

// Mock data - replace with actual data from your API
const recentOrders = [
  {
    id: 'ORD-1001',
    customer: 'John Doe',
    date: new Date('2023-10-15'),
    amount: 2499,
    status: 'completed',
    items: 3
  },
  {
    id: 'ORD-1002',
    customer: 'Jane Smith',
    date: new Date('2023-10-14'),
    amount: 1899,
    status: 'processing',
    items: 2
  },
  {
    id: 'ORD-1003',
    customer: 'Robert Johnson',
    date: new Date('2023-10-14'),
    amount: 3299,
    status: 'shipped',
    items: 1
  },
  {
    id: 'ORD-1004',
    customer: 'Emily Davis',
    date: new Date('2023-10-13'),
    amount: 1499,
    status: 'pending',
    items: 2
  },
  {
    id: 'ORD-1005',
    customer: 'Michael Wilson',
    date: new Date('2023-10-12'),
    amount: 2499,
    status: 'completed',
    items: 1
  }
];

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      icon: <FaCheckCircle className="status-icon completed" />,
      label: 'Completed',
      className: 'status-badge completed'
    },
    processing: {
      icon: <FaClock className="status-icon processing" />,
      label: 'Processing',
      className: 'status-badge processing'
    },
    shipped: {
      icon: <FaTruck className="status-icon shipped" />,
      label: 'Shipped',
      className: 'status-badge shipped'
    },
    pending: {
      icon: <FaClock className="status-icon pending" />,
      label: 'Pending',
      className: 'status-badge pending'
    },
    cancelled: {
      icon: <FaTimesCircle className="status-icon cancelled" />,
      label: 'Cancelled',
      className: 'status-badge cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={config.className}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

const RecentOrders = () => {
  return (
    <div className="recent-orders">
      <div className="section-header">
        <h3>Recent Orders</h3>
        <Link to="/admin/orders" className="view-all">View All</Link>
      </div>
      
      <div className="orders-table">
        <div className="table-header">
          <div className="header-cell">Order ID</div>
          <div className="header-cell">Customer</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Items</div>
          <div className="header-cell">Amount</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Action</div>
        </div>
        
        <div className="table-body">
          {recentOrders.map((order) => (
            <div key={order.id} className="table-row">
              <div className="table-cell">
                <Link to={`/admin/orders/${order.id}`} className="order-id">
                  {order.id}
                </Link>
              </div>
              <div className="table-cell">{order.customer}</div>
              <div className="table-cell">
                {format(new Date(order.date), 'MMM d, yyyy')}
              </div>
              <div className="table-cell">{order.items} item{order.items !== 1 ? 's' : ''}</div>
              <div className="table-cell">₹{order.amount.toLocaleString()}</div>
              <div className="table-cell">
                <StatusBadge status={order.status} />
              </div>
              <div className="table-cell">
                <Link to={`/admin/orders/${order.id}`} className="action-link">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
