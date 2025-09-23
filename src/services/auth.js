export { useAuth } from '../contexts/AuthContext';
import { AuthContext } from '../contexts/AuthContext';

// Return the auth context value. If the context isn't available (dev edge-case),
// return an empty object to avoid crashes while you wire up the provider.
export function useAuth() {
  try {
    return useContext(AuthContext) || {};
  } catch (e) {
    // If AuthContext is not a valid React context, return a safe fallback.
    return {};
  }
}
