import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthNav = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="auth-nav">
      {user ? (
        <div className="user-menu">
          <span>Welcome, {user.email}</span>
          <button onClick={handleSignOut} className="auth-button">
            Sign Out
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="auth-button">
            Login
          </Link>
          <Link to="/register" className="auth-button primary">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthNav;
