import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
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
  
  // The AdminRoute component will handle the user and isAdmin logic internally
  useAuth(); 

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
        <ToastContainer position="bottom-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={<Home addToCart={addToCart} />} 
          />
          <Route 
            path="/products" 
            element={<Products addToCart={addToCart} />} 
          />
          <Route 
            path="/products/:id" 
            element={<ProductDetail addToCart={addToCart} />} 
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

      <footer style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem 1rem',
        marginTop: '2rem',
        borderTop: '1px solid #e9ecef'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
         
          <p style={{ margin: 0, color: '#6c757d' }}>
            &copy; {new Date().getFullYear()} Artistic Deblina. All rights reserved.
          </p>
        </div>
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