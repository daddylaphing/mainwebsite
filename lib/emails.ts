import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";
const EMAIL_TO = process.env.EMAIL_TO || "laphingdaddy@gmail.com";

export interface EmailOptions {
  to?: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  // Use onboarding@resend.dev if custom domain not verified yet
  const fromAddress = `Laphing Daddy <${EMAIL_FROM}>`;

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: options.to || [EMAIL_TO],
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    console.error("Resend error:", JSON.stringify(error));
    throw new Error(`Failed to send email: ${JSON.stringify(error)}`);
  }

  return data;
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return sendEmail({
    to: EMAIL_TO,
    subject: `Contact Form: ${data.subject}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #e7b52c; padding-bottom: 10px;">New Contact Form Submission</h2>
        <div style="margin-top: 20px; padding: 20px; background-color: #fafafa; border-radius: 8px;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${data.email}</p>
          <p style="margin: 10px 0;"><strong>Subject:</strong> ${data.subject}</p>
        </div>
        <div style="margin-top: 20px; padding: 20px; background-color: #fff; border: 1px solid #e5e5e5; border-radius: 8px;">
          <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
        </div>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">This email was sent from the Laphing Daddy contact form.</p>
      </div>
    `,
  });
}

export async function sendContactAcknowledgementEmail(data: {
  name: string;
  email: string;
  subject: string;
}) {
  return sendEmail({
    to: data.email,
    subject: "We've received your query! - Laphing Daddy 🥟",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6E1D25; font-size: 28px; margin: 0; font-family: Georgia, serif;">Laphing Daddy</h1>
          <p style="color: #888; margin-top: 8px;">Authentic Tibetan Street Food</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Hi ${data.name},</h2>
          
          <p style="color: #444; line-height: 1.7; font-size: 15px;">
            Thank you for contacting us! We've successfully received your message regarding: <strong>"${data.subject}"</strong>.
          </p>
          
          <p style="color: #444; line-height: 1.7; font-size: 15px;">
            Our team is reviewing your query, and we will get back to you as soon as possible.
          </p>
          
          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #777; font-size: 13px; margin: 0;">
              Best regards,<br />
              <strong>The Laphing Daddy Team</strong>
            </p>
          </div>
        </div>
        
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
          Laphing Daddy · Delhi · Noida · Gurugram · Ghaziabad
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(data: { email: string; name: string }) {
  return sendEmail({
    to: data.email,
    subject: "Welcome to Laphing Daddy! 🥟",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e7b52c; font-size: 32px; margin: 0; font-family: 'Manrope', sans-serif;">Laphing <span style="color: #e7b52c;">Daddy</span></h1>
          <p style="color: #888; margin-top: 8px;">Authentic Tibetan Street Food</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Welcome, ${data.name}! 🎉</h2>
          
          <p style="color: #444; line-height: 1.7; font-size: 16px;">
            Thanks for joining Laphing Daddy! You're now part of a community that loves authentic Tibetan street food as much as we do.
          </p>
          
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 12px; color: #166534;">What's next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #166534; line-height: 2;">
              <li>Browse our <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#products" style="color: #e7b52c;">Laphing Kits</a> - everything you need to make it at home</li>
              <li>Add <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/#products" style="color: #e7b52c;">extra toppings & sauces</a> to customize your order</li>
              <li>Book delivery for <strong>10 AM - 8 PM</strong> (Delhi, Noida, Gurugram, Ghaziabad)</li>
              <li>Track orders in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account" style="color: #e7b52c;">account</a></li>
            </ul>
          </div>
          
          <p style="color: #444; line-height: 1.6;">
            Got questions? Just reply to this email - we'd love to hear from you!
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <a href="https://instagram.com/laphingdaddy" style="color: #e7b52c; text-decoration: none; margin: 0 10px;">Instagram</a>
          <span style="color: #ccc;">|</span>
          <a href="https://wa.me/919354775439" style="color: #e7b52c; text-decoration: none; margin: 0 10px;">WhatsApp</a>
        </div>
        
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
          Laphing Daddy · Delhi · Noida · Gurugram · Ghaziabad
        </p>
      </div>
    `,
  });
}

export async function sendOrderConfirmationEmail(data: {
  email: string;
  name: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  packaging: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: { full_name: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string };
  deliveryNotes?: string;
  orderLink?: string;
  pickupAddress?: string;
}) {
  const itemsHtml = data.items.map(item => `
    <tr style="border-bottom: 1px solid #e5e5e5;">
      <td style="padding: 12px 0; color: #1a1a1a;">${item.name}</td>
      <td style="padding: 12px 0; text-align: center; color: #444;">${item.quantity}</td>
      <td style="padding: 12px 0; text-align: right; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  const recipients = [EMAIL_TO];
  if (data.email) recipients.unshift(data.email);

  return sendEmail({
    to: recipients,
    subject: `Order Confirmed - ${data.orderNumber} 🥟`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #e7b52c; font-size: 32px; margin: 0; font-family: 'Manrope', sans-serif;">Laphing <span style="color: #e7b52c;">Daddy</span></h1>
          <p style="color: #888; margin-top: 8px;">Order Confirmation</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 30px;">
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #166534; font-weight: 600; font-size: 16px;">✅ Order Confirmed!</p>
            <p style="margin: 8px 0 0; color: #166534; font-size: 14px;">Your order <strong>${data.orderNumber}</strong> has been placed successfully.</p>
          </div>
          
          <h3 style="color: #1a1a1a; margin-bottom: 16px;">Order Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e5e5;">
                <th style="padding: 12px 0; text-align: left; color: #888; font-size: 12px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px 0; text-align: center; color: #888; font-size: 12px; text-transform: uppercase;">Qty</th>
                <th style="padding: 12px 0; text-align: right; color: #888; font-size: 12px; text-transform: uppercase;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="border-top: 1px solid #e5e5e5; padding-top: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #444;">
              <span>Subtotal</span>
              <span>₹${data.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #444;">
              <span>Packaging</span>
              <span>₹${data.packaging.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #444;">
              <span>Shipping</span>
              <span>${data.shipping === 0 ? 'FREE' : '₹' + data.shipping.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #444;">
              <span>GST (5%)</span>
              <span>₹${data.tax.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 16px 0 0; font-weight: 700; font-size: 18px; color: #e7b52c; border-top: 2px solid #e5e5e5; padding-top: 16px;">
              <span>Total</span>
              <span>₹${data.total.toFixed(2)}</span>
            </div>
          </div>
          
          <h3 style="color: #1a1a1a; margin: 24px 0 16px;">Shipping Address</h3>
          <div style="background: #fafafa; border-radius: 8px; padding: 16px; color: #444; line-height: 1.8;">
            <p style="margin: 0 0 4px;"><strong>${data.shippingAddress.full_name}</strong></p>
            <p style="margin: 0 0 4px;">${data.shippingAddress.phone}</p>
            <p style="margin: 0 0 4px;">${data.shippingAddress.line1}</p>
            ${data.shippingAddress.line2 ? `<p style="margin: 0 0 4px;">${data.shippingAddress.line2}</p>` : ""}
            <p style="margin: 0 0 4px;">${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}</p>
          </div>
          
          <h3 style="color: #1a1a1a; margin: 24px 0 16px;">Pickup Address</h3>
          <div style="background: #fafafa; border-radius: 8px; padding: 16px; color: #444; line-height: 1.8;">
            <p style="margin: 0 0 4px;"><strong>${data.pickupAddress}</strong></p>
          </div>
          
          ${data.deliveryNotes ? `
            <div style="margin-top: 20px; padding: 16px; background: #fefce8; border: 1px solid #fde047; border-radius: 8px;">
              <p style="margin: 0 0 4px; color: #854d0e; font-weight: 600;">📝 Delivery Notes</p>
              <p style="margin: 0; color: #854d0e;">${data.deliveryNotes}</p>
            </div>
          ` : ""}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
            <p style="color: #444; margin: 0 0 8px;">Your order will be prepared fresh and delivered during our delivery window (10 AM - 8 PM).</p>
            <p style="color: #444; margin: 0 0 16px;">You'll receive a WhatsApp notification when your delivery is on the way.</p>
            <a href="${data.orderLink || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account`}" style="display: inline-block; background: #e7b52c; color: #000; font-weight: 700; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Order</a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
          <a href="https://instagram.com/laphingdaddy" style="color: #e7b52c; text-decoration: none; margin: 0 10px;">Instagram</a>
          <span style="color: #ccc;">|</span>
          <a href="https://wa.me/919354775439" style="color: #e7b52c; text-decoration: none; margin: 0 10px;">WhatsApp</a>
        </div>
        
        <p style="text-align: center; color: #888; font-size: 12px; margin-top: 20px;">
          Laphing Daddy · Delhi · Noida · Gurugram · Ghaziabad
        </p>
      </div>
    `,
  });
}

// ─── Status labels for emails ─────────────────────────────────────────────────
const STATUS_LABELS: Record<string, { label: string; color: string; message: string }> = {
  confirmed:        { label: "Order Confirmed",       color: "#2563EB", message: "Your order has been confirmed and we are getting ready to prepare it fresh." },
  preparing:        { label: "Being Prepared",        color: "#EA580C", message: "Our kitchen has started preparing your fresh laphing kit." },
  packed:           { label: "Packed & Ready",        color: "#7C3AED", message: "Your order is packed and ready for pickup by the delivery rider." },
  out_for_delivery: { label: "Out for Delivery",      color: "#0891B2", message: "Your order is on its way! The delivery rider has picked it up." },
  delivered:        { label: "Order Delivered",       color: "#16A34A", message: "Your order has been delivered. Enjoy your fresh laphing!" },
  cancelled:        { label: "Order Cancelled",       color: "#DC2626", message: "Your order has been cancelled. If this was unexpected, please contact us." },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://laphingdaddy.com";

function emailWrapper(body: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F7F3EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EC;padding:40px 20px;"><tr><td align="center">
<table width="100%" style="max-width:520px;background:#FFFFFF;border:1px solid #E6DFD5;" cellpadding="0" cellspacing="0">
  <tr><td style="padding:28px 36px 20px;border-bottom:1px solid #E6DFD5;text-align:center;">
    <p style="margin:0;font-size:20px;font-weight:800;color:#1A1A1A;letter-spacing:-0.01em;font-family:Georgia,serif;">
      Laphing <span style="color:#D4A843;font-style:italic;">Daddy</span>
    </p>
  </td></tr>
  <tr><td style="padding:32px 36px;">${body}</td></tr>
  <tr><td style="padding:16px 36px 24px;border-top:1px solid #E6DFD5;text-align:center;">
    <p style="margin:0;font-size:11px;color:#A09890;">Authentic Tibetan Laphing &middot; Delhi NCR</p>
    <p style="margin:4px 0 0;font-size:11px;color:#C4BDB5;">&copy; 2025 Laphing Daddy. All rights reserved.</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

// ─── Order Status Update Email ────────────────────────────────────────────────
export async function sendOrderStatusEmail(data: {
  email: string;
  name: string;
  orderNumber: string;
  orderId: string;
  status: string;
  note?: string;
}) {
  const info = STATUS_LABELS[data.status];
  if (!info) return; // Don't send for statuses without a template (e.g. pending)

  const orderUrl = `${SITE_URL}/account/orders/${data.orderId}`;
  const isDelivered = data.status === "delivered";
  const isCancelled = data.status === "cancelled";

  const body = `
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#A09890;">
      Order Update
    </p>
    <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#1A1A1A;">${info.label}</h1>

    <div style="background:#F7F3EC;border-left:3px solid ${info.color};padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#4A4540;line-height:1.6;">${info.message}</p>
      ${data.note ? `<p style="margin:8px 0 0;font-size:13px;color:#7A7570;font-style:italic;">"${data.note}"</p>` : ""}
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #E6DFD5;font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:0.1em;">Order</td>
          <td style="padding:8px 0;border-bottom:1px solid #E6DFD5;font-size:14px;font-weight:700;color:#1A1A1A;text-align:right;">#${data.orderNumber}</td></tr>
      <tr><td style="padding:8px 0;font-size:12px;color:#7A7570;text-transform:uppercase;letter-spacing:0.1em;">Status</td>
          <td style="padding:8px 0;font-size:14px;font-weight:700;text-align:right;color:${info.color};">${info.label}</td></tr>
    </table>

    ${isDelivered ? `
    <div style="background:#F0FDF4;border:1px solid #86EFAC;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#166534;">Your order has been delivered!</p>
      <p style="margin:6px 0 0;font-size:13px;color:#166534;">Thank you for ordering from Laphing Daddy. Enjoy your meal!</p>
    </div>` : ""}

    ${isCancelled ? `
    <p style="font-size:13px;color:#7A7570;margin:0 0 24px;">
      If you have any questions about the cancellation, please reach out to us on 
      <a href="https://wa.me/919667414181" style="color:#D4A843;font-weight:600;">WhatsApp</a>.
    </p>` : ""}

    <a href="${orderUrl}" style="display:inline-block;background:#1A1A1A;color:#FFFFFF;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:12px 28px;text-decoration:none;">
      View Order
    </a>
  `;

  return sendEmail({
    to: data.email,
    subject: `${info.label} — Order #${data.orderNumber}`,
    html: emailWrapper(body),
  });
}

// ─── Admin: New Order Notification ───────────────────────────────────────────
export async function sendAdminNewOrderEmail(data: {
  orderNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: { full_name: string; phone: string; line1: string; city: string; state: string; pincode: string };
}) {
  const itemsList = data.items.map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #E6DFD5;">${i.name}</td>
     <td style="padding:8px 0;border-bottom:1px solid #E6DFD5;text-align:center;">${i.quantity}</td>
     <td style="padding:8px 0;border-bottom:1px solid #E6DFD5;text-align:right;">Rs.${(i.price * i.quantity)}</td></tr>`
  ).join("");

  const adminOrderUrl = `${SITE_URL}/admin/orders/${data.orderId}`;

  const body = `
    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#991B1B;">New Order Received!</p>
      <p style="margin:4px 0 0;font-size:13px;color:#7F1D1D;">Order #${data.orderNumber} — Rs.${data.total}</p>
    </div>

    <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#A09890;margin:0 0 8px;">Customer</p>
    <p style="margin:0 0 4px;font-size:14px;color:#1A1A1A;font-weight:600;">${data.customerName}</p>
    <p style="margin:0 0 4px;font-size:13px;color:#7A7570;">${data.customerEmail}</p>
    <p style="margin:0 0 20px;font-size:13px;color:#7A7570;">${data.customerPhone}</p>

    <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#A09890;margin:0 0 8px;">Items</p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;">
      ${itemsList}
    </table>

    <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#A09890;margin:0 0 8px;">Delivery To</p>
    <p style="margin:0 0 20px;font-size:13px;color:#4A4540;line-height:1.7;">
      ${data.shippingAddress.full_name}<br/>
      ${data.shippingAddress.phone}<br/>
      ${data.shippingAddress.line1}, ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.pincode}
    </p>

    <a href="${adminOrderUrl}" style="display:inline-block;background:#6E1D25;color:#FFFFFF;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;padding:12px 28px;text-decoration:none;">
      Open in Admin
    </a>
  `;

  return sendEmail({
    to: EMAIL_TO,
    subject: `New Order #${data.orderNumber} — Rs.${data.total}`,
    html: emailWrapper(body),
  });
}
