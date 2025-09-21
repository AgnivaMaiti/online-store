export default function Customized() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Request a Customized Artwork</h2>
      <form>
        <input type="text" placeholder="Your Name" required /><br /><br />
        <input type="email" placeholder="Email" required /><br /><br />
        <textarea placeholder="Describe your custom artwork request" required style={{ width: "300px", height: "100px" }}></textarea><br /><br />
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
}
