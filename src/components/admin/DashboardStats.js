import React from 'react';
import { FaShoppingCart, FaDollarSign, FaUsers, FaStar } from 'react-icons/fa';
import '../../styles/admin/DashboardStats.css';

const statCards = [
  {
    title: 'Total Sales',
    value: '$12,345',
    change: '+12%',
    isPositive: true,
    icon: <FaDollarSign className="stat-icon" />,
    color: '#4CAF50'
  },
  {
    title: 'Total Orders',
    value: '156',
    change: '+8%',
    isPositive: true,
    icon: <FaShoppingCart className="stat-icon" />,
    color: '#2196F3'
  },
  {
    title: 'Total Customers',
    value: '89',
    change: '+15%',
    isPositive: true,
    icon: <FaUsers className="stat-icon" />,
    color: '#9C27B0'
  },
  {
    title: 'Average Rating',
    value: '4.7',
    change: '+0.2',
    isPositive: true,
    icon: <FaStar className="stat-icon" />,
    color: '#FFC107'
  }
];

const DashboardStats = () => {
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
              <span className={`stat-change ${stat.isPositive ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
