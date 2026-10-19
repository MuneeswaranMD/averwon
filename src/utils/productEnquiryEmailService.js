import nodemailer from 'nodemailer';

const NOTIFICATION_RECIPIENT = 'averqonhq@gmail.com';

function createTransporter() {
  const user = process.env.SMTP_USER || 'averqonhq@gmail.com';
  const pass = process.env.SMTP_PASS || 'rqbuvtwrozeazoon';

  if (!user || !pass) return null;

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(host.includes('gmail') && { service: 'gmail' })
  });
}

/**
 * Send full product enquiry notification to averqonhq@gmail.com
 */
export async function sendProductEnquiryAdminNotification({
  productName = 'Crackers POS',
  customerName,
  shopName,
  email,
  phone,
  city,
  operationType,
  countersCount,
  gstin,
  address,
  notes,
  leadId
}) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('⚠️ SMTP not configured. Unable to send product enquiry notification to:', NOTIFICATION_RECIPIENT);
    return { success: false, reason: 'SMTP not configured' };
  }

  const subject = `🚀 [Product Lead] New Enquiry for ${productName} — ${shopName || customerName} (${city || 'India'})`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #F6F8FC; margin: 0; padding: 24px; color: #101A32; }
    .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(16,26,50,0.06); }
    .header { background: #101A32; padding: 28px 32px; border-bottom: 3px solid #2160FF; }
    .header h1 { color: #FFFFFF; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
    .header p { color: #94A3B8; margin: 6px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
    .content { padding: 32px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748B; letter-spacing: 0.05em; margin: 24px 0 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px; }
    .info-item { font-size: 13px; line-height: 1.5; }
    .info-label { color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
    .info-val { color: #0F172A; font-weight: 700; }
    .notes-box { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; font-size: 13px; color: #78350F; line-height: 1.6; margin-top: 16px; }
    .footer { text-align: center; font-size: 11px; color: #94A3B8; padding: 24px 0 12px; }
    .cta-btn { display: inline-block; background: #2160FF; color: #FFFFFF !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">🔥 Verified Product Lead (${leadId || 'NEW'})</span>
      <h1>New Customer Enquiry: ${productName}</h1>
      <p>Submitted via Averqon Software Products Portal on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>

    <div class="content">
      <div class="section-title">Client & Contact Information</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Contact Person</div>
          <div class="info-val">${customerName || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Shop / Firm Name</div>
          <div class="info-val">${shopName || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Direct Phone / WhatsApp</div>
          <div class="info-val"><a href="tel:${phone}" style="color: #2160FF; text-decoration: none;">${phone || 'N/A'}</a></div>
        </div>
        <div class="info-item">
          <div class="info-label">Email Address</div>
          <div class="info-val"><a href="mailto:${email}" style="color: #2160FF; text-decoration: none;">${email || 'N/A'}</a></div>
        </div>
        <div class="info-item">
          <div class="info-label">City / Location</div>
          <div class="info-val">${city || 'N/A'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">GSTIN</div>
          <div class="info-val">${gstin || 'Unregistered / Walk-in'}</div>
        </div>
      </div>

      <div class="section-title">Software Requirements</div>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Product Inquired</div>
          <div class="info-val" style="color: #2160FF;">${productName}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Counter Setup</div>
          <div class="info-val">${countersCount || '1 Counter'}</div>
        </div>
        <div class="info-item" style="grid-column: span 2;">
          <div class="info-label">Operation Model</div>
          <div class="info-val">${operationType || 'Seasonal Retail Counter'}</div>
        </div>
      </div>

      ${address ? `
      <div class="section-title">Shop Address</div>
      <p style="font-size: 13px; color: #334155; margin: 0; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px; border-radius: 8px;">${address}</p>
      ` : ''}

      ${notes ? `
      <div class="section-title">Special Requirements / Notes</div>
      <div class="notes-box">
        <strong>Customer Note:</strong><br/>
        ${notes}
      </div>
      ` : ''}

      <div style="text-align: center; margin-top: 28px;">
        <a href="https://wa.me/${(phone || '').replace(/\D/g, '')}" class="cta-btn" style="background: #25D366; margin-right: 8px;">
          💬 Chat on WhatsApp
        </a>
        <a href="tel:${phone}" class="cta-btn">
          📞 Call Customer Now
        </a>
      </div>
    </div>

    <div class="footer">
      This notification was automatically dispatched by Averqon CRM System to <strong>${NOTIFICATION_RECIPIENT}</strong>.
    </div>
  </div>
</body>
</html>
`;

  try {
    const info = await transporter.sendMail({
      from: `"Averqon Leads" <${process.env.SMTP_USER || 'averqonhq@gmail.com'}>`,
      to: NOTIFICATION_RECIPIENT,
      replyTo: email || undefined,
      subject,
      html
    });

    console.log(`✅ Product enquiry email sent to ${NOTIFICATION_RECIPIENT}: Message ID ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Failed to dispatch product enquiry email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send instant acknowledgment email to client
 */
export async function sendProductEnquiryClientConfirmation({
  productName = 'Crackers POS',
  customerName,
  email,
  shopName
}) {
  if (!email || !email.includes('@') || email.includes('pos-lead.averqon.com')) {
    return { success: false, reason: 'No valid client email provided' };
  }

  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'SMTP not configured' };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F8FC; margin: 0; padding: 24px; color: #101A32; }
    .card { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(16,26,50,0.05); }
    .header { background: #101A32; padding: 32px; text-align: center; }
    .header h1 { color: #FFFFFF; margin: 0; font-size: 20px; }
    .content { padding: 32px; font-size: 14px; line-height: 1.6; color: #334155; }
    .footer { text-align: center; font-size: 11px; color: #94A3B8; padding: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>We Received Your Enquiry</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${customerName}</strong>,</p>
      <p>Thank you for inquiring about <strong>${productName}</strong> for <strong>${shopName || 'your business'}</strong>.</p>
      <p>Our sales engineering team has received your details and will get in touch with you directly via phone or WhatsApp with customized pricing, hardware recommendations, and setup guidance.</p>
      <p style="margin-top: 24px;">Warm regards,<br/><strong>The Averqon Product Team</strong><br/>Averqon Technologies<br/>Email: averqonhq@gmail.com</p>
    </div>
    <div class="footer">
      Averqon Technologies • Enterprise Software & POS Solutions
    </div>
  </div>
</body>
</html>
`;

  try {
    await transporter.sendMail({
      from: `"Averqon Team" <${process.env.SMTP_USER || 'averqonhq@gmail.com'}>`,
      to: email,
      subject: `Thank you for your interest in ${productName} — Averqon`,
      html
    });
    return { success: true };
  } catch (err) {
    console.warn('Could not send client acknowledgment email:', err.message);
    return { success: false, error: err.message };
  }
}
