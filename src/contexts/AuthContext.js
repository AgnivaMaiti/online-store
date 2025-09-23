import React, { createContext, useContext, useState, useEffect } from 'react';
// Use the single shared Supabase client to avoid multiple GoTrueClient instances
import { supabase } from '../supabaseClient';


// 1. Create the context
export const AuthContext = createContext(null);

// 2. Create the Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to authentication state changes
  useEffect(() => {
    setLoading(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // update local user state after successful sign in
      if (data?.user) setUser(data.user);
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign up a new user
  const signUp = async (email, password, userData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData },
      });
      if (error) throw error;
      // update local user state after sign up (may be null if confirmation required)
      if (data?.user) setUser(data.user);
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      return { error: null };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) throw error;
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced admin check with more comprehensive checks
  const isAdminValue = React.useMemo(() => {
    if (!user) return false;
    
    // Debug log the user object for inspection
    console.log('Checking admin status for user:', {
      email: user.email,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
      raw_user_meta_data: user.user_metadata?.raw_user_meta_data,
      raw_app_meta_data: user.app_metadata?.provider
    });

    // Check various possible locations for admin role
    const isAdmin = (
      // Check standard metadata locations
      user.user_metadata?.role === 'admin' ||
      user.app_metadata?.role === 'admin' ||
      user.role === 'admin' ||
      
      // Check raw metadata (common in some Supabase setups)
      (typeof user.user_metadata?.raw_user_meta_data === 'object' && 
       user.user_metadata.raw_user_meta_data?.role === 'admin') ||
      
      // Check for admin email (temporary for testing)
      (user.email && [
        'maitiagniva@gmail.com', 
        'admin@example.com',
        // Add other admin emails here
      ].includes(user.email.toLowerCase()))
    );

    console.log(`Admin check result for ${user.email}:`, isAdmin);
    return isAdmin;
  }, [user]);

  // Debug effect to log auth state changes
  useEffect(() => {
    console.log('Auth state changed:', {
      user: user ? {
        id: user.id,
        email: user.email,
        isAdmin: isAdminValue,
        metadata: {
          user_metadata: user.user_metadata,
          app_metadata: user.app_metadata,
          raw_user_meta_data: user.user_metadata?.raw_user_meta_data
        }
      } : 'No user',
      loading,
      error
    });
  }, [user, loading, error, isAdminValue]);

  // The value provided to consuming components
  const value = {
    user,
    loading,
    error,
    isAdmin: isAdminValue,
    signIn,
    signOut,
    signUp,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create the custom hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}