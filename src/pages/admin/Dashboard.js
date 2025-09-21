import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';
import { supabase } from '../../supabaseClient';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import PendingReviews from '../../components/admin/PendingReviews';
import CustomRequests from '../../components/admin/CustomRequests';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../styles/admin/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const adminContext = useAdmin();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        
        if (!data?.is_admin) {
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const renderTabContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Dashboard Overview</h2>
            <DashboardStats />
            <div className="dashboard-sections">
              <RecentOrders />
              <PendingReviews />
              <CustomRequests />
            </div>
          </div>
        );
      case 'products':
        return <div>Products Management</div>;
      case 'orders':
        return <div>Orders Management</div>;
      case 'reviews':
        return <div>Reviews Management</div>;
      case 'custom-requests':
        return <div>Custom Requests Management</div>;
      case 'users':
        return <div>Users Management</div>;
      default:
        return null;
    }
  };

  if (!isAdmin && !loading) {
    return (
      <div className="unauthorized">
        <h2>Unauthorized Access</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <main className="admin-main">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default Dashboard;
