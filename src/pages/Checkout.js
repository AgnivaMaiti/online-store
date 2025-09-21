export default function Checkout({ cartItems }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <p>Thank you for your order! QR Code payment coming soon. 🎨</p>
      )}
    </div>
  );
}
