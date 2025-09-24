import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../../services/supabaseClient';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CustomProducts = () => {
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCustomProducts();
  }, []);

  const fetchCustomProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('custom_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomProducts(data || []);
    } catch (error) {
      console.error('Error fetching custom products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('custom_products')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setCustomProducts(prev => 
        prev.map(product => 
          product.id === id ? { 
            ...product, 
            status: newStatus
          } : product
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      setError(error.message);
      // Show error toast or notification here
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading && !updatingId) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError('')}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Custom Product Requests</h2>
        <button 
          onClick={fetchCustomProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customProducts.length > 0 ? (
                customProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{parseFloat(product.price || 0).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.status === 'approved' ? 'bg-green-100 text-green-800' :
                        product.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {product.status === 'pending' ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(product.id, 'approved')}
                            className="text-green-600 hover:text-green-900 text-sm font-medium"
                            disabled={updatingId === product.id}
                          >
                            {updatingId === product.id ? 'Updating...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(product.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                            disabled={updatingId === product.id}
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(product.id, 'pending')}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          disabled={updatingId === product.id}
                        >
                          {updatingId === product.id ? 'Updating...' : 'Reset to Pending'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No custom products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomProducts;
