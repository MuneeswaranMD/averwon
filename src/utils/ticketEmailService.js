import nodemailer from 'nodemailer';

// Primary notification recipients for tickets
const ADMIN_RECIPIENT_EMAILS = [
  'muneeswaranmd2004@gmail.com',
  'muneeswaran@averqon.in',
  'averqonhq@gmail.com'
];

/**
 * Creates and returns a Nodemailer transporter using SMTP credentials.
 */
function createTransporter() {
  const user = process.env.SMTP_USER || 'averqonhq@gmail.com';
  const pass = process.env.SMTP_PASS || 'rqbuvtwrozeazoon';

  if (!user || !pass) {
    return null;
  }

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
 * Generates priority badge styling for HTML email.
 */
function getPriorityStyle(priority = 'Medium') {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5' };
    case 'high':
      return { bg: '#FFEDD5', color: '#9A3412', border: '#FDBA74' };
    case 'medium':
      return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
    case 'low':
    default:
      return { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' };
  }
}

/**
 * Generates status badge styling for HTML email.
 */
function getStatusStyle(status = 'Open') {
  switch (status.toLowerCase()) {
    case 'resolved':
    case 'closed':
      return { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' };
    case 'in progress':
      return { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD' };
    case 'pending':
      return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' };
    case 'reopened':
      return { bg: '#F3E8FF', color: '#6B21A8', border: '#D8B4FE' };
    case 'open':
    default:
      return { bg: '#FFEDD5', color: '#9A3412', border: '#FDBA74' };
  }
}

/**
 * HTML Helper to render comments list cleanly
 */
function renderCommentsHtml(comments = []) {
  if (!comments || comments.length === 0) return '';
  return `
    <div style="margin-top: 20px;">
      <p style="font-weight: 700; color: #0f172a; margin-bottom: 10px; font-size: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">💬 Comments & Updates (${comments.length}):</p>
      ${comments.map(c => `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px; font-size: 13px;">
          <div style="margin-bottom: 4px;">
            <strong style="color: #2563eb;">${c.sender || 'User'} (${c.senderRole || 'Client'})</strong>
            <span style="color: #94a3b8; font-size: 11px; margin-left: 8px;">${c.timestamp ? new Date(c.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''}</span>
          </div>
          <div style="color: #334155; line-height: 1.5; white-space: pre-wrap;">${c.message}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * HTML Helper to render Admin Notes
 */
function renderAdminNotesHtml(adminNotes) {
  if (!adminNotes || !adminNotes.trim()) return '';
  return `
    <div style="margin-top: 20px;">
      <p style="font-weight: 700; color: #1e40af; margin-bottom: 8px; font-size: 14px;">📝 Agent / Admin Notes:</p>
      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 8px; font-size: 14px; color: #1e3a8a; line-height: 1.5; white-space: pre-wrap;">${adminNotes}</div>
    </div>
  `;
}

/**
 * HTML Helper to render Resolution Notes
 */
function renderResolutionNotesHtml(resolutionNotes) {
  if (!resolutionNotes || !resolutionNotes.trim()) return '';
  return `
    <div style="margin-top: 20px;">
      <p style="font-weight: 700; color: #065f46; margin-bottom: 8px; font-size: 14px;">💡 Resolution Notes:</p>
      <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 8px; font-size: 14px; color: #065f46; line-height: 1.5; white-space: pre-wrap;">${resolutionNotes}</div>
    </div>
  `;
}

/**
 * Sends automated email notification when a new ticket is raised.
 */
export async function sendTicketNotificationEmail(ticket) {
  const {
    ticketId = 'N/A',
    title = 'No Title',
    subject,
    description = 'No description provided.',
    priority = 'Medium',
    category = 'General Query',
    department = 'IT',
    assignedTeam = 'Unassigned / Support Team',
    ticketType = 'Client Ticket',
    userName = 'Anonymous User',
    userEmail = 'N/A',
    userRole = 'User',
    contactNumber = 'N/A',
    status = 'Open',
    dueDate,
    attachmentUrl,
    comments = [],
    adminNotes = '',
    resolutionNotes = '',
    createdAt
  } = ticket;

  const ticketTitle = title || subject || 'Support Request';
  const createdDateStr = createdAt ? new Date(createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const dueDateStr = dueDate ? new Date(dueDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Not set';

  const prioStyle = getPriorityStyle(priority);
  const statusStyle = getStatusStyle(status);

  const isHighOrUrgent = ['high', 'urgent'].includes(priority.toLowerCase());
  const subjectPrefix = isHighOrUrgent ? (priority.toLowerCase() === 'urgent' ? 'URGENT' : 'HIGH') : 'New Ticket';
  const emailSubject = `${subjectPrefix} Ticket Raised – ${ticketId} – ${ticketTitle}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailSubject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; text-align: left;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">AVERQON</span>
                      <span style="font-size: 13px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-left: 10px; letter-spacing: 1px;">Ticket System</span>
                    </td>
                    <td align="right">
                      <span style="background-color: ${prioStyle.bg}; color: ${prioStyle.color}; border: 1px solid ${prioStyle.border}; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; display: inline-block;">
                        ${priority} PRIORITY
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Banner -->
            <tr>
              <td style="padding: 25px 30px 15px 30px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <h2 style="margin: 0 0 6px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                  📩 New Ticket Raised: <span style="color: #2563eb; font-family: monospace;">${ticketId}</span>
                </h2>
                <p style="margin: 0; color: #64748b; font-size: 14px;">
                  A new ticket has been raised in the Ticket Management System.
                </p>
              </td>
            </tr>

            <!-- Details Table -->
            <tr>
              <td style="padding: 25px 30px;">
                <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td width="38%" style="font-weight: 600; color: #64748b; padding: 10px 0;">Ticket ID</td>
                    <td width="62%" style="font-weight: 700; color: #0f172a; font-family: monospace; font-size: 15px; padding: 10px 0;">${ticketId}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Title</td>
                    <td style="font-weight: 700; color: #0f172a; padding: 10px 0;">${ticketTitle}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Category</td>
                    <td style="color: #334155; padding: 10px 0;">${category}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Priority</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${prioStyle.bg}; color: ${prioStyle.color}; border: 1px solid ${prioStyle.border}; padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase;">
                        ${priority}
                      </span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Status</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${statusStyle.bg}; color: ${statusStyle.color}; border: 1px solid ${statusStyle.border}; padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 12px; text-transform: uppercase;">
                        ${status}
                      </span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Department</td>
                    <td style="color: #334155; padding: 10px 0;">${department}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Assigned Team</td>
                    <td style="color: #334155; padding: 10px 0;">${assignedTeam || 'Unassigned'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Ticket Type</td>
                    <td style="color: #334155; padding: 10px 0;">${ticketType}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">User Name</td>
                    <td style="font-weight: 600; color: #0f172a; padding: 10px 0;">${userName}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">User Email</td>
                    <td style="color: #2563eb; font-weight: 600; padding: 10px 0;">${userEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">User Role</td>
                    <td style="color: #334155; padding: 10px 0;">${userRole || 'User'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Contact Number</td>
                    <td style="color: #334155; padding: 10px 0;">${contactNumber || 'N/A'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Due Date</td>
                    <td style="color: #475569; padding: 10px 0;">${dueDateStr}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Date Created</td>
                    <td style="color: #475569; font-size: 13px; padding: 10px 0;">${createdDateStr}</td>
                  </tr>
                  ${attachmentUrl ? `
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Attachment</td>
                    <td style="padding: 10px 0;">
                      <a href="${attachmentUrl}" target="_blank" style="color: #2563eb; font-weight: 700; text-decoration: underline;">View Attachment</a>
                    </td>
                  </tr>
                  ` : ''}
                </table>

                <!-- Description Box -->
                <div style="margin-top: 20px;">
                  <p style="font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 14px;">Description:</p>
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${description}</div>
                </div>

                ${renderAdminNotesHtml(adminNotes)}
                ${renderResolutionNotesHtml(resolutionNotes)}
                ${renderCommentsHtml(comments)}

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 4px 0;">Automated notification from Averqon Ticket Management System.</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Averqon. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Averqon Support" <averqonhq@gmail.com>',
    to: ADMIN_RECIPIENT_EMAILS.join(', '),
    subject: emailSubject,
    html: htmlContent
  };

  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'SMTP Transporter unavailable' };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[TICKET EMAIL] ✅ New ticket notification sent for ${ticketId}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[TICKET EMAIL] ❌ Failed to send email for ticket ${ticketId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends an email notification when a ticket's status is updated.
 */
export async function sendTicketStatusUpdateEmail(ticket, previousStatus = 'Open', newStatus = 'In Progress', extra = {}) {
  const {
    ticketId = 'N/A',
    title = 'No Title',
    subject,
    priority = 'Medium',
    category = 'General Query',
    department = 'IT',
    assignedTeam = 'Unassigned / Support Team',
    userName = 'N/A',
    userEmail = 'N/A',
    adminNotes = '',
    resolutionNotes = '',
    comments = []
  } = ticket;

  const ticketTitle = title || subject || 'Support Request';
  const updatedTimeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  const prioStyle = getPriorityStyle(priority);
  const prevStatusStyle = getStatusStyle(previousStatus);
  const newStatusStyle = getStatusStyle(newStatus);

  const emailSubject = `Ticket Status Updated – ${ticketId} – ${newStatus}`;
  const actorName = extra.actorName || 'Admin';
  const effectiveAdminNotes = extra.adminNotes !== undefined ? extra.adminNotes : adminNotes;
  const effectiveResolutionNotes = extra.resolutionNotes !== undefined ? extra.resolutionNotes : resolutionNotes;

  const recipients = [...new Set([...ADMIN_RECIPIENT_EMAILS, userEmail].filter(e => e && e !== 'N/A' && e.includes('@')))];

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailSubject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; text-align: left;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">AVERQON</span>
                      <span style="font-size: 13px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-left: 10px; letter-spacing: 1px;">Status Update</span>
                    </td>
                    <td align="right">
                      <span style="background-color: ${prioStyle.bg}; color: ${prioStyle.color}; border: 1px solid ${prioStyle.border}; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; display: inline-block;">
                        ${priority} PRIORITY
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Banner -->
            <tr>
              <td style="padding: 25px 30px 15px 30px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 19px; font-weight: 700;">
                  🔄 Ticket Status Updated: <span style="color: #2563eb; font-family: monospace;">${ticketId}</span>
                </h2>
                <div style="margin-top: 10px; font-size: 14px; color: #475569;">
                  Status changed from 
                  <span style="background-color: ${prevStatusStyle.bg}; color: ${prevStatusStyle.color}; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase;">${previousStatus}</span>
                  to 
                  <span style="background-color: ${newStatusStyle.bg}; color: ${newStatusStyle.color}; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase;">${newStatus}</span>
                  by <strong>${actorName}</strong>.
                </div>
              </td>
            </tr>

            <!-- Details Table -->
            <tr>
              <td style="padding: 25px 30px;">
                <table width="100%" cellpadding="8" cellspacing="0" style="font-size: 14px; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td width="38%" style="font-weight: 600; color: #64748b; padding: 10px 0;">Ticket ID</td>
                    <td width="62%" style="font-weight: 700; color: #0f172a; font-family: monospace; font-size: 15px; padding: 10px 0;">${ticketId}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Ticket Title</td>
                    <td style="font-weight: 700; color: #0f172a; padding: 10px 0;">${ticketTitle}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Previous Status</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${prevStatusStyle.bg}; color: ${prevStatusStyle.color}; padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 12px;">${previousStatus}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">New Status</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${newStatusStyle.bg}; color: ${newStatusStyle.color}; padding: 4px 12px; border-radius: 6px; font-weight: 800; font-size: 13px;">${newStatus}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Priority</td>
                    <td style="padding: 10px 0;">
                      <span style="background-color: ${prioStyle.bg}; color: ${prioStyle.color}; padding: 3px 10px; border-radius: 4px; font-weight: 700; font-size: 12px;">${priority}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Category</td>
                    <td style="color: #334155; padding: 10px 0;">${category}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Department</td>
                    <td style="color: #334155; padding: 10px 0;">${department}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Assigned Team</td>
                    <td style="color: #334155; padding: 10px 0;">${assignedTeam || 'Unassigned'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">User Name</td>
                    <td style="font-weight: 600; color: #0f172a; padding: 10px 0;">${userName}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">User Email</td>
                    <td style="color: #2563eb; font-weight: 600; padding: 10px 0;">${userEmail}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="font-weight: 600; color: #64748b; padding: 10px 0;">Updated Date & Time</td>
                    <td style="color: #475569; font-size: 13px; padding: 10px 0;">${updatedTimeStr}</td>
                  </tr>
                </table>

                ${renderAdminNotesHtml(effectiveAdminNotes)}
                ${renderResolutionNotesHtml(effectiveResolutionNotes)}
                ${renderCommentsHtml(comments)}

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 4px 0;">Sent by Averqon Ticket Management System (<a href="mailto:averqonhq@gmail.com" style="color: #2563eb;">averqonhq@gmail.com</a>)</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Averqon. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Averqon Support" <averqonhq@gmail.com>',
    to: recipients.join(', '),
    subject: emailSubject,
    html: htmlContent
  };

  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'SMTP Transporter unavailable' };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[STATUS UPDATE EMAIL] ✅ Status update email sent for ticket ${ticketId} (${previousStatus} -> ${newStatus}). MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[STATUS UPDATE EMAIL] ❌ Failed for ticket ${ticketId}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends a confirmation email to the customer when they raise a ticket.
 */
export async function sendCustomerTicketConfirmationEmail(ticket) {
  const {
    ticketId = 'N/A',
    title = 'No Title',
    subject,
    description = '',
    priority = 'Medium',
    category = 'General Query',
    userName = 'Valued Customer',
    userEmail,
    adminNotes = '',
    resolutionNotes = '',
    comments = []
  } = ticket;

  if (!userEmail || userEmail === 'N/A' || !userEmail.includes('@')) {
    return { success: false, reason: 'Invalid customer email' };
  }

  const ticketSubject = title || subject || 'Support Request';
  const prioStyle = getPriorityStyle(priority);

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Ticket Received - Averqon Support</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; text-align: left;">
                <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">AVERQON</span>
                <span style="font-size: 13px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-left: 10px; letter-spacing: 1px;">Customer Support</span>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px 30px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                  Hello ${userName},
                </h2>
                <p style="margin: 0; color: #475569; font-size: 15px; line-height: 1.5;">
                  Thank you for reaching out to Averqon Support! We have received your request and created ticket <strong style="color: #2563eb; font-family: monospace;">${ticketId}</strong>. Our team is actively investigating your request.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px 30px;">
                <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #0f172a;">Ticket Summary</h3>
                  <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Ticket ID:</strong> <span style="font-family: monospace; color: #2563eb; font-weight: 700;">${ticketId}</span></p>
                  <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Subject:</strong> ${ticketSubject}</p>
                  <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Category:</strong> ${category}</p>
                  <p style="margin: 4px 0; font-size: 14px; color: #475569;"><strong>Priority:</strong> <span style="background-color: ${prioStyle.bg}; color: ${prioStyle.color}; padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 12px;">${priority}</span></p>
                </div>

                <div style="margin-bottom: 25px;">
                  <p style="font-weight: 700; color: #0f172a; margin-bottom: 8px; font-size: 14px;">Your Description:</p>
                  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 14px; border-radius: 6px; font-size: 14px; color: #334155; line-height: 1.5;">${description}</div>
                </div>

                ${renderAdminNotesHtml(adminNotes)}
                ${renderResolutionNotesHtml(resolutionNotes)}
                ${renderCommentsHtml(comments)}

                <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-top: 20px;">
                  You can track your ticket status at any time by entering your Ticket ID (<strong style="font-family: monospace;">${ticketId}</strong>) and email address on our Support portal.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 4px 0;">Sent by Averqon Support (<a href="mailto:averqonhq@gmail.com" style="color: #2563eb;">averqonhq@gmail.com</a>)</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Averqon. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Averqon Support" <averqonhq@gmail.com>',
    to: userEmail,
    subject: `[Averqon Support] Ticket Received: ${ticketId} - ${ticketSubject}`,
    html: htmlContent
  };

  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'SMTP Transporter unavailable' };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[CUSTOMER CONFIRMATION EMAIL] ✅ Sent to ${userEmail} for ticket ${ticketId}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[CUSTOMER CONFIRMATION EMAIL] ❌ Failed for ${userEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Sends an email update to the customer when a new reply/comment is posted.
 */
export async function sendCustomerTicketUpdateEmail(ticket, updateDetails = {}) {
  const {
    ticketId = 'N/A',
    title = 'No Title',
    subject,
    userName = 'Valued Customer',
    userEmail,
    adminNotes = '',
    resolutionNotes = '',
    comments = []
  } = ticket;

  if (!userEmail || userEmail === 'N/A' || !userEmail.includes('@')) {
    return { success: false, reason: 'Invalid customer email' };
  }

  const { commentMessage, senderName = 'Averqon Support', newStatus } = updateDetails;
  const ticketSubject = title || subject || 'Support Request';
  const effectiveAdminNotes = updateDetails.adminNotes !== undefined ? updateDetails.adminNotes : adminNotes;
  const effectiveResolutionNotes = updateDetails.resolutionNotes !== undefined ? updateDetails.resolutionNotes : resolutionNotes;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Ticket Update - Averqon Support</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333333;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f9; padding: 20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
            
            <tr>
              <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 25px 30px; text-align: left;">
                <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">AVERQON</span>
                <span style="font-size: 13px; font-weight: 600; color: #38bdf8; text-transform: uppercase; margin-left: 10px; letter-spacing: 1px;">Support Update</span>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px 30px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
                  Update on Ticket <span style="color: #2563eb; font-family: monospace;">${ticketId}</span>
                </h2>
                <p style="margin: 0; color: #475569; font-size: 14px;">
                  Hello ${userName}, there is a new update regarding your support request: <strong>${ticketSubject}</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 25px 30px;">
                ${newStatus ? `
                <div style="margin-bottom: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px;">
                  <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Status Changed To:</strong> <span style="text-transform: uppercase; font-weight: 700;">${newStatus}</span></p>
                </div>
                ` : ''}

                ${commentMessage ? `
                <div style="margin-bottom: 20px;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Message from ${senderName}:</p>
                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #10b981; padding: 16px; border-radius: 8px; font-size: 14px; color: #1e293b; line-height: 1.6; white-space: pre-wrap;">${commentMessage}</div>
                </div>
                ` : ''}

                ${renderAdminNotesHtml(effectiveAdminNotes)}
                ${renderResolutionNotesHtml(effectiveResolutionNotes)}
                ${renderCommentsHtml(comments)}

                <p style="font-size: 13px; color: #64748b; margin-top: 20px;">
                  You can respond or track your request status directly on the Averqon Support Portal.
                </p>
              </td>
            </tr>

            <tr>
              <td style="background-color: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 4px 0;">Sent from Averqon Support (<a href="mailto:averqonhq@gmail.com" style="color: #2563eb;">averqonhq@gmail.com</a>)</p>
                <p style="margin: 0;">© ${new Date().getFullYear()} Averqon. All rights reserved.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Averqon Support" <averqonhq@gmail.com>',
    to: userEmail,
    subject: `[Update] Ticket ${ticketId}: New Reply from Averqon Support`,
    html: htmlContent
  };

  const transporter = createTransporter();
  if (!transporter) return { success: false, reason: 'SMTP Transporter unavailable' };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[CUSTOMER UPDATE EMAIL] ✅ Update email sent to ${userEmail} for ticket ${ticketId}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[CUSTOMER UPDATE EMAIL] ❌ Failed to send to ${userEmail}:`, error.message);
    return { success: false, error: error.message };
  }
}
