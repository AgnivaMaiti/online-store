import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes in auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  // Sign up a new user
  const signUp = async (email, password, userData) => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Add user to users table
      if (user) {
        const { data, error: profileError } = await supabase
          .from('users')
          .upsert([
            {
              id: user.id,
              email: user.email,
              full_name: userData.fullName,
              phone: userData.phone,
              address: userData.address,
            },
          ]);

        if (profileError) throw profileError;
      }

      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Sign in an existing user
  const signIn = async (email, password) => {
    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  };

  // Sign out the current user
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
