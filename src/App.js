import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";

// Components
import Navbar from "./components/Navbar";
import AuthNav from "./components/AuthNav";
import AdminRoute from "./components/AdminRoute"; // Correctly imported

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Customized from "./pages/Customized";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminPage from "./pages/AdminPage";

// Styles
import './App.css';

// A wrapper component to access auth context within the Router
function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  
  // NOTE: The useAuth hook returns 'user', not 'currentUser'. This is not used here but is important.
  // The AdminRoute component will handle the user and isAdmin logic internally.
  const { user } = useAuth(); 

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <div className="App">
      <header>
        <Navbar cartCount={cartItems.length} />
      </header>

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/products" 
            element={<Products addToCart={addToCart} />} 
          />
          <Route path="/customized" element={<Customized />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/cart" 
            element={<Cart cartItems={cartItems} onRemoveItem={removeFromCart} />} 
          />
          <Route 
            path="/checkout" 
            element={<Checkout cartItems={cartItems} defaultAmount={0} />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* --- Admin Routes --- */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />
          
          {/* Fallback route to redirect any unknown paths to the homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Artwork Store. All rights reserved.</p>
      </footer>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <AppContent />
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;