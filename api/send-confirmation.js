const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentId, name, email, phone, amount, transactionId } = req.body || {};

  if (!email || !name || !transactionId || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Configure transporter from env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: (process.env.SMTP_SECURE === 'true') || false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Artwork Store — Payment received (₹${amount})`,
      text: `Hi ${name},

We received your payment submission for ₹${amount}.

Transaction ID: ${transactionId}
Reference: ${paymentId || 'N/A'}
Phone: ${phone}

If this was you, thank you — we will verify and process your order shortly.

Regards,
Artwork Store`,
      html: `<p>Hi ${name},</p>
<p>We received your payment submission for <strong>₹${amount}</strong>.</p>
<ul>
<li><strong>Transaction ID:</strong> ${transactionId}</li>
<li><strong>Reference:</strong> ${paymentId || 'N/A'}</li>
<li><strong>Phone:</strong> ${phone}</li>
</ul>
<p>If this was you, thank you — we will verify and process your order shortly.</p>
<p>Regards,<br/>Artwork Store</p>`,
    };

    await transporter.sendMail(mailOptions);

    // Update payment status to 'email_sent' using service role key (optional)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.REACT_APP_SUPABASE_URL && paymentId) {
      const supa = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await supa.from('payments').update({ status: 'email_sent' }).eq('id', paymentId);
    }

    return res.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('send-confirmation error', err);
    return res.status(500).json({ error: err.message || 'failed to send' });
  }
};