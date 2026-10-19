import nodemailer from 'nodemailer';

const ADMIN_RECIPIENT_EMAILS = [
  'muneeswaranmd2004@gmail.com',
  'muneeswaran@averqon.in',
  'averqonhq@gmail.com'
];

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
 * Send personalized feedback invitation email to client with secure link
 */
export async function sendFeedbackInviteEmail({ clientName, email, project, feedbackUrl, expiresAt, customMessage }) {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('⚠️ SMTP not configured. Skipping feedback invitation email to:', email);
    return { success: false, reason: 'SMTP not configured' };
  }

  const expiryStr = expiresAt ? new Date(expiresAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  }) : 'in 30 days';

  const defaultMsg = `Thank you for partnering with Averqon for <strong>${project}</strong>. Your experience and insights mean the world to our team. Could you please take 2 minutes to share your feedback with us?`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #F6F8FC; margin: 0; padding: 24px; color: #101A32; }
    .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 20px rgba(16,26,50,0.04); }
    .header { background: #101A32; padding: 32px 36px; text-align: center; }
    .header h1 { color: #FFFFFF; margin: 0; font-size: 20px; font-weight: 700; }
    .header p { color: #94A3B8; margin: 6px 0 0; font-size: 13px; }
    .content { padding: 36px; }
    .msg-box { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; font-size: 14px; line-height: 1.6; color: #334155; margin: 20px 0 28px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background: #2160FF; color: #FFFFFF !important; text-decoration: none; font-weight: 600; font-size: 14px; padding: 14px 32px; border-radius: 10px; box-shadow: 0 4px 12px rgba(33,96,255,0.25); }
    .meta { font-size: 12px; color: #64748B; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 20px; }
    .footer { text-align: center; font-size: 11px; color: #94A3B8; padding: 24px 0 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Averqon Client Feedback</h1>
      <p>We value your partnership & perspective</p>
    </div>
    <div class="content">
      <p style="font-size: 15px; margin: 0 0 12px;">Dear <strong>${clientName}</strong>,</p>
      
      <div class="msg-box">
        ${customMessage ? customMessage.replace(/\n/g, '<br>') : defaultMsg}
      </div>

      <div class="btn-container">
        <a href="${feedbackUrl}" class="btn" target="_blank">Share Your Feedback →</a>
      </div>

      <div class="meta">
        <p style="margin: 0 0 4px;"><strong>Project:</strong> ${project}</p>
        <p style="margin: 0;">This secure link is private to you and expires on <strong>${expiryStr}</strong>.</p>
      </div>
    </div>
  </div>
  <div class="footer">
    © ${new Date().getFullYear()} Averqon Technologies. All rights reserved.
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Averqon Feedback" <${process.env.SMTP_USER || 'averqonhq@gmail.com'}>`,
      to: email,
      subject: `How was your experience with Averqon? (${project})`,
      html
    });
    console.log('✉️ Feedback invitation sent to', email, 'MessageID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('❌ Failed to send feedback invite to', email, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Notify admin when client submits new feedback
 */
export async function sendFeedbackReceivedAdminNotification({ clientName, companyName, email, project, rating, feedbackText, publicationConsent }) {
  const transporter = createTransporter();
  if (!transporter) return { success: false };

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F6F8FC; padding: 24px; color: #101A32; }
    .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; padding: 32px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .badge-consent { background: #DCFCE7; color: #166534; }
    .badge-no-consent { background: #F1F5F9; color: #475569; }
    .quote { background: #F8FAFC; border-left: 4px solid #2160FF; padding: 14px 18px; font-style: italic; font-size: 14px; margin: 18px 0; border-radius: 0 10px 10px 0; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top: 0; color: #101A32;">New Client Feedback Received! 🎉</h2>
    <p style="font-size: 14px; color: #64748B;">Client <strong>${clientName}</strong> ${companyName ? `(${companyName})` : ''} has submitted feedback for <strong>${project}</strong>.</p>
    
    <div style="font-size: 22px; color: #F59E0B; margin: 16px 0 8px;">
      ${stars} <span style="font-size: 15px; color: #64748B; font-weight: 600;">(${rating}/5 Stars)</span>
    </div>

    <div class="quote">
      "${feedbackText}"
    </div>

    <p style="font-size: 13px;">
      <strong>Website Publication Consent:</strong> 
      <span class="badge ${publicationConsent ? 'badge-consent' : 'badge-no-consent'}">
        ${publicationConsent ? '✓ Consented to Publish' : '✗ Private Only (No Consent)'}
      </span>
    </p>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://averqon.in/admin" style="background: #2160FF; color: #fff; padding: 10px 22px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Open Admin Dashboard to Review →</a>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: `"Averqon Feedback System" <${process.env.SMTP_USER || 'averqonhq@gmail.com'}>`,
      to: ADMIN_RECIPIENT_EMAILS.join(', '),
      subject: `[New Feedback] ${clientName} - ${project} (${rating}/5 Stars)`,
      html
    });
    return { success: true };
  } catch (err) {
    console.error('Failed to notify admins of feedback submission:', err.message);
    return { success: false, error: err.message };
  }
}
