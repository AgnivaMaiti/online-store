import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Debug logging with more details
  useEffect(() => {
    console.group('AdminRoute Debug');
    console.log('Current path:', window.location.pathname);
    console.log('Auth state:', { 
      hasUser: !!user,
      userEmail: user?.email,
      isAdmin,
      isLoading: loading,
      timestamp: new Date().toISOString()
    });
    
    if (user) {
      console.log('User metadata:', user.user_metadata);
      console.log('App metadata:', user.app_metadata);
      console.log('Raw user meta data:', user.user_metadata?.raw_user_meta_data);
    }
    
    console.groupEnd();
  }, [user, isAdmin, loading]);

  // If the auth state is still loading, show a loading spinner
  if (loading) {
    console.log('AdminRoute: Auth state loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-3 text-lg">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('AdminRoute: No authenticated user, redirecting to login');
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          from: location.pathname,
          message: 'Please sign in to access the admin panel'
        }} 
      />
    );
  }

  // If not admin, redirect to home
  if (!isAdmin) {
    console.warn('AdminRoute: Access denied - User is not an admin', {
      email: user.email,
      userId: user.id,
      roles: {
        user_metadata: user.user_metadata?.role,
        app_metadata: user.app_metadata?.role,
        raw_meta: user.user_metadata?.raw_user_meta_data?.role
      }
    });
    
    return (
      <Navigate 
        to="/" 
        replace 
        state={{ 
          error: 'You do not have permission to access the admin panel'
        }} 
      />
    );
  }

  // If all checks pass, render the admin content
  console.log('AdminRoute: User is admin, rendering admin content');
  return children;
}