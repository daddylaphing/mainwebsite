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
  const { data, error } = await resend.emails.send({
    from: `Laphing Daddy <${EMAIL_FROM}>`,
    to: options.to || [EMAIL_TO],
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send email");
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
              <li>Book delivery for <strong>3 PM - 6 PM</strong> (Delhi, Noida, Gurugram, Ghaziabad)</li>
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
            <p style="color: #444; margin: 0 0 8px;">Your order will be prepared fresh and delivered during our booking window (3 PM - 6 PM).</p>
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