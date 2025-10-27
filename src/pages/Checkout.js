import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Checkout(props) {
  // Calculate total amount from cart items
  const calculateTotal = () => {
    if (!props.cartItems || props.cartItems.length === 0) return 0;
    return props.cartItems.reduce((total, item) => total + (parseFloat(item.price) || 0), 0);
  };

  const [amount] = useState(calculateTotal().toFixed(2));
  const [transactionId, setTransactionId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const qrPayload = `artwork-store|amount:${amount}|ref:checkout`;
  // Using the local QR code image
  const qrSrc = '/qrcode.png';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // build payment payload matching the database schema
      const paymentPayload = {
        user_id: props.user?.id || null,
        amount: Number(amount),
        items: props.cartItems || [],
        status: 'paid',
        transaction_id: transactionId,
        name: name,
        phone: phone,
        email: email,
        address: address,
        currency: 'INR'
        // created_at will use the default value from DB
      };

      // insert into supabase payments table
      const { data, error: insertError } = await supabase
        .from('payments')
        .insert([paymentPayload])
        .select();

      if (insertError) {
        throw insertError;
      }

      // clear form
      setTransactionId('');
      setName('');
      setPhone('');
      setEmail('');
      setLoading(false);
      setMessage({ type: 'success', text: 'Payment recorded successfully.' });
    } catch (err) {
      console.error('Checkout error', err);
      setError(err.message || String(err));
      setLoading(false);
      setMessage({ type: 'error', text: 'Failed to record payment. See error above.' });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Checkout</h2>
      {props.cartItems && props.cartItems.length > 0 ? (
        <div>
          <h3>Order Summary</h3>
          <ul>
            {props.cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - ₹{item.price}
              </li>
            ))}
          </ul>
          <p>Total Amount to pay: ₹{amount}</p>
        </div>
      ) : (
        <p>Your cart is empty. <a href="/products">Continue shopping</a></p>
      )}

      <div style={{ margin: '16px 0', textAlign: 'center' }}>
        <p>Scan the QR code below to make payment using any UPI app</p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <img 
            src={qrSrc} 
            alt="Payment QR Code" 
            style={{ 
              maxWidth: '300px', 
              height: 'auto',
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: 'white'
            }} 
          />
        </div>
        <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Amount to pay: ₹{amount}</p>
        <p style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
          After payment, please enter the transaction ID and your details below
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 10 }}>
          <label htmlFor="txn">Transaction ID</label>
          <input id="txn" name="txn" required value={transactionId} onChange={(e) => setTransactionId(e.target.value)} autoComplete="transaction-id" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label htmlFor="address">Full Address & PIN Code</label>
          <textarea 
            id="address" 
            name="address" 
            required 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Enter your full address with PIN code" 
            style={{ width: '100%', padding: 8, minHeight: '80px' }} 
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 16px' }}>
          {loading ? 'Processing…' : 'Submit Payment Info'}
        </button>
        {error && <div className="error" style={{ marginTop: 12, color: 'crimson' }}>{error}</div>}
      </form>

      {message && (
        <div style={{ marginTop: 12, color: message.type === 'error' ? 'crimson' : 'green' }}>
          {message.text}
        </div>
      )}
    </div>
  );
}