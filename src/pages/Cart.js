import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Cart.css';

export default function Cart({ cartItems, onRemoveItem }) {
  const { user } = useAuth();
  
  // Calculate total price
  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  // Group items by ID to show quantity
  const cartItemsGrouped = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.totalPrice += item.price;
    } else {
      acc.push({ ...item, quantity: 1, totalPrice: item.price });
    }
    return acc;
  }, []);

  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItemsGrouped.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price.toFixed(2)} each</p>
                  <div className="item-quantity">
                    <span>Quantity: {item.quantity}</span>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="remove-button"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="item-total">Total: ₹{item.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            {user ? (
              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
              </Link>
            ) : (
              <div className="login-required">
                <p>Please <Link to="/login">login</Link> to proceed to checkout</p>
                <Link to="/login" className="login-button">
                  Login / Register
                </Link>
              </div>
            )}
            
            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
