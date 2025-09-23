import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
// Date formatting helper functions
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import '../styles/admin/AdminPayments.css';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    
    async function loadPayments() {
      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });
        
        // Apply status filter if not 'all'
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        // Apply search term if exists
        if (searchTerm) {
          query = query.or(`id.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        if (mounted) {
          setPayments(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to load payments', err);
        if (mounted) {
          setError('Failed to load payments. Please try again later.');
          setPayments([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    
    // Add a small debounce to the search
    const debounceTimer = setTimeout(() => {
      loadPayments();
    }, 300);
    
    return () => {
      mounted = false;
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, statusFilter]);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Format: Month Day, Year at HH:MM:SS AM/PM
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString || 'Invalid date';
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
        return 'status-badge succeeded';
      case 'pending':
        return 'status-badge pending';
      case 'failed':
        return 'status-badge failed';
      default:
        return 'status-badge';
    }
  };
  
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPayments(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to refresh payments', err);
      setError('Failed to refresh payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-payments">
      <div className="payments-header">
        <h2>Payment History</h2>
        <div className="payments-actions">
          <button 
            className="btn btn-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="payments-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="status-filter">
          <label htmlFor="status-filter">Status:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-select"
          >
            <option value="all">All Statuses</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      {loading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p>Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <div className="no-payments">
          <p>No payments found.</p>
        </div>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Items</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="payment-id">{payment.id.substring(0, 8)}...</td>
                  <td className="payment-user">{payment.user_id.substring(0, 8)}...</td>
                  <td className="payment-amount">₹{parseFloat(payment.amount).toFixed(2)}</td>
                  <td>
                    <span className={getStatusBadgeClass(payment.status)}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="payment-items">
                    {Array.isArray(payment.items) 
                      ? `${payment.items.length} item${payment.items.length !== 1 ? 's' : ''}`
                      : 'N/A'}
                  </td>
                  <td className="payment-date">{formatDate(payment.created_at)}</td>
                  <td className="payment-actions">
                    <button 
                      className="btn btn-view"
                      onClick={() => {
                        // Implement view details functionality
                        console.log('View payment:', payment.id);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}