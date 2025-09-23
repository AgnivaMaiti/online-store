import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if current user is admin
  const isAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      // For now, we'll consider the user an admin if they have an @example.com email
      // In a real app, you should have a proper admin table or role-based system
      const adminEmails = ['admin@example.com', 'your-email@example.com'];
      return user.email && adminEmails.includes(user.email.toLowerCase());
    } catch (error) {
      console.error('Error in isAdmin check:', error);
      return false;
    }
  };

  // Fetch all orders with related data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with related payment and user data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          payments (
            id,
            amount,
            status as payment_status,
            payment_method,
            transaction_id,
            created_at as payment_date
          ),
          profiles (
            id,
            email,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      
      // If no orders, set empty array and return
      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        return;
      }

      // Format the orders data with safe defaults
      const formattedOrders = ordersData.map(order => {
        // Get the most recent payment if available
        const payment = order.payments && order.payments.length > 0 
          ? order.payments[0] 
          : null;
          
        // Get user info
        const user = order.profiles || {};
        
        return {
          id: order.id,
          created_at: order.created_at,
          updated_at: order.updated_at || order.created_at,
          user_id: order.user_id,
          total_amount: parseFloat(order.total_amount) || 0,
          status: order.status || 'pending',
          shipping_address: order.shipping_address || '',
          payment_status: payment?.payment_status || 'pending',
          
          // User info
          user_email: user.email || `user_${order.user_id?.substring(0, 6) || 'unknown'}`,
          user_name: user.full_name || 'Unknown User',
          
          // Payment info
          payment_id: payment?.id,
          payment_amount: payment?.amount ? parseFloat(payment.amount) : 0,
          payment_method: payment?.payment_method || 'unknown',
          transaction_id: payment?.transaction_id || `order_${order.id?.substring(0, 8) || 'unknown'}`,
          payment_date: payment?.payment_date || order.created_at,
          
          // Original data
          _raw: order
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update order status and related payment status if needed
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      // Start a transaction
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (orderError) throw orderError;
      if (!orderData) throw new Error('Order not found');
      
      // Update the order status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);
        
      if (updateError) throw updateError;
      
      // If the order has payments, update the payment status as well
      if (orderData.payment_id) {
        const { error: paymentError } = await supabase
          .from('payments')
          .update({
            status: newStatus === 'cancelled' ? 'refunded' : newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('order_id', orderId);
          
        if (paymentError) console.warn('Could not update payment status:', paymentError);
      }
      
      // Refresh the orders list
      await fetchOrders();
      
      return { success: true };
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Check admin status function
  const checkAdminStatus = async () => {
    return await isAdmin();
  };

  return (
    <AdminContext.Provider
      value={{
        orders,
        loading,
        error,
        isAdmin,
        checkAdminStatus,
        updateOrderStatus,
        refetch: fetchOrders
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