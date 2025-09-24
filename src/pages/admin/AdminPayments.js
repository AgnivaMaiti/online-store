import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import '../../../src/styles/admin/AdminPayments.css';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadPayments() {
      try {
        setLoading(true);
        
        // Fetch payments with user data if available
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('created_at', { ascending: false });

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
    
    loadPayments();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString || 'Invalid date';
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
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="payment-id font-mono break-all">{payment.transaction_id || 'N/A'}</td>
                  <td className="customer-info">
                    <div className="font-medium">{payment.name || 'Guest User'}</div>
                    <div className="text-gray-600 text-sm">{payment.email || 'No email'}</div>
                  </td>
                  <td className="contact-info">
                    {payment.phone || 'No phone'}
                  </td>
                  <td className="payment-amount">₹{parseFloat(payment.amount || 0).toFixed(2)}</td>
                  <td className="payment-items">
                    {Array.isArray(payment.items) && payment.items.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {payment.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            <span className="font-medium">{item.name || 'Unnamed Item'}</span>
                            <span className="text-gray-500 text-xs ml-2">
                              (Qty: {item.quantity || 1} × ₹{parseFloat(item.price || 0).toFixed(2)}
                              {item.size ? `, Size: ${item.size}` : ''})
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm">No items</span>
                    )}
                  </td>
                  <td className="payment-date">
                    <div className="whitespace-nowrap">{formatDate(payment.created_at)}</div>
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