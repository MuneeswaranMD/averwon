import 'dotenv/config';
import nodemailer from 'nodemailer';

const ADMIN_RECIPIENT_EMAILS = [
  'averqonhq@gmail.com',
  'muneeswaranmd2004@gmail.com',
  'muneeswaran@averqon.in'
];

async function testEmail() {
  const user = process.env.SMTP_USER || 'averqonhq@gmail.com';
  const pass = process.env.SMTP_PASS || 'rqbuvtwrozeazoon';

  console.log('Testing SMTP connection with:', { user, passLength: pass.length });

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user, pass },
    service: 'gmail'
  });

  try {
    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully!');

    console.log('Sending test product enquiry email to:', ADMIN_RECIPIENT_EMAILS.join(', '));
    const info = await transporter.sendMail({
      from: `"Averqon Leads" <${user}>`,
      to: ADMIN_RECIPIENT_EMAILS.join(', '),
      subject: '🚀 [Product Lead Test] Crackers POS Enquiry Notification',
      text: 'This is a test notification for Crackers POS enquiry sent to averqonhq@gmail.com and admin mail IDs.',
      html: '<h3>Test Enquiry Notification</h3><p>Successfully delivered to admin email IDs and averqonhq@gmail.com.</p>'
    });

    console.log('✅ Email sent successfully! MessageId:', info.messageId);
    console.log('Accepted recipients:', info.accepted);
  } catch (err) {
    console.error('❌ Error testing email:', err);
  }
}

testEmail();
