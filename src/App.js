import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { supabase } from "./supabaseClient";

// Components
import Navbar from "./components/Navbar";
import AuthNav from "./components/AuthNav";
import PrivateRoute from "./components/PrivateRoute";

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

// Styles
import './App.css';

function App() {
  // State to hold items added to cart
  const [cartItems, setCartItems] = useState([]);

  // Function to add product to cart
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  // Function to remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navbar with dynamic cart count and auth */}
          <header>
            <Navbar cartCount={cartItems.length} />
            <AuthNav />
          </header>

          <main>
            <Routes>
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
                element={
                  <Cart 
                    cartItems={cartItems} 
                    onRemoveItem={removeFromCart} 
                  />
                } 
              />
              
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute>
                    <Checkout cartItems={cartItems} />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Redirect any unknown paths to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer>
            {/* Add footer content here */}
            <p>&copy; {new Date().getFullYear()} Artwork Store. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
