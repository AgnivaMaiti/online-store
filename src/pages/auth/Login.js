import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabaseClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Note: useAuth's signIn function is not used here; we call supabase directly.
  // This is perfectly fine, as the onAuthStateChange listener in AuthContext
  // will automatically update the user state for the whole app.
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError('');
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || 'Failed to sign in');
    } else if (data.user) {
      // If user metadata contains an admin flag, redirect to admin dashboard
      const isAdmin = data.user.user_metadata && data.user.user_metadata.is_admin;
      navigate(isAdmin ? '/admin' : '/');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p>
            {/* Make sure you have a route and component for this if you use it */}
            {/* <Link to="/forgot-password">Forgot password?</Link> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;