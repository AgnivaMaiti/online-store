import React from 'react';
import { FaShoppingCart, FaDollarSign, FaUsers, FaBox } from 'react-icons/fa';
import '../../styles/admin/DashboardStats.css';

const DashboardStats = ({ totalSales, totalOrders, totalProducts, totalUsers }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales || 0),
      change: '',
      isPositive: true,
      icon: <FaDollarSign className="stat-icon" />,
      color: '#4CAF50',
      description: 'Total revenue generated'
    },
    {
      title: 'Total Orders',
      value: totalOrders || 0,
      change: '',
      isPositive: true,
      icon: <FaShoppingCart className="stat-icon" />,
      color: '#2196F3',
      description: 'Total number of orders'
    },
    {
      title: 'Total Products',
      value: totalProducts || 0,
      change: '',
      isPositive: true,
      icon: <FaBox className="stat-icon" />,
      color: '#9C27B0',
      description: 'Products in inventory'
    },
    {
      title: 'Total Users',
      value: totalUsers || 0,
      change: '',
      isPositive: true,
      icon: <FaUsers className="stat-icon" />,
      color: '#FF9800',
      description: 'Registered users'
    }
  ];
  return (
    <div className="dashboard-stats">
      {statCards.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon-container" style={{ backgroundColor: `${stat.color}20` }}>
            {React.cloneElement(stat.icon, { style: { color: stat.color } })}
          </div>
          <div className="stat-info">
            <span className="stat-title">{stat.title}</span>
            <div className="stat-value-container">
              <span className="stat-value">{stat.value}</span>
              {stat.change && (
                <span className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              )}
            </div>
            {stat.description && <div className="stat-description">{stat.description}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
