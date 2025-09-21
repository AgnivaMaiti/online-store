import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if current user is admin
  const isAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    return data?.is_admin || false;
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (error) throw error;
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles(username),
          order_items:order_items(*, product:products(*))
        `);
      
      if (error) throw error;
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user:profiles(username),
          product:products(name)
        `);
      
      if (error) throw error;
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch custom requests
  const fetchCustomRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_requests')
        .select(`
          *,
          user:profiles(username)
        `);
      
      if (error) throw error;
      setCustomRequests(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle review approval
  const toggleReviewApproval = async (reviewId, isApproved) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);
      
      if (error) throw error;
      await fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  // Update custom request status
  const updateRequestStatus = async (requestId, status) => {
    try {
      const { error } = await supabase
        .from('custom_requests')
        .update({ status })
        .eq('id', requestId);
      
      if (error) throw error;
      await fetchCustomRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  // Add new product
  const addProduct = async (product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) throw error;
      await fetchProducts();
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUsers(),
          fetchProducts(),
          fetchOrders(),
          fetchReviews(),
          fetchCustomRequests()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        products,
        orders,
        reviews,
        customRequests,
        loading,
        error,
        isAdmin,
        updateOrderStatus,
        toggleReviewApproval,
        updateRequestStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        refetch: () => {
          fetchUsers();
          fetchProducts();
          fetchOrders();
          fetchReviews();
          fetchCustomRequests();
        }
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
