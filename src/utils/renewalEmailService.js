import nodemailer from 'nodemailer';
import * as Models from '../db/models.js';

// Default Admin recipient emails for Averqon CRM notifications
const DEFAULT_ADMIN_EMAILS = [
  'averqonhq@gmail.com',
  'muneeswaranmd2004@gmail.com'
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
 * Helper to get configured Admin email address
 */
async function getConfiguredAdminEmail() {
  try {
    const setting = await Models.Setting.findOne();
    if (setting && setting.adminNotificationEmail) {
      return setting.adminNotificationEmail;
    }
  } catch (err) {
    console.warn('[RenewalEmailService] Could not fetch settings for admin email:', err.message);
  }
  return process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAILS[0];
}

/**
 * Generate human-readable reminder label
 */
function getReminderLabel(type) {
  switch (type) {
    case '30_days_before': return '30 Days Before Expiry';
    case '15_days_before': return '15 Days Before Expiry';
    case '7_days_before': return '7 Days Before Expiry (Urgent)';
    case '1_day_before': return '1 Day Before Expiry (Critical)';
    case 'on_expiry': return 'Due Today — Expires Now';
    case 'after_expiry_followup': return 'Post-Expiry Follow-Up Required';
    default: return type;
  }
}

/**
 * Generate priority styling for the reminder
 */
function getReminderBadge(type) {
  switch (type) {
    case 'after_expiry_followup':
    case 'on_expiry':
    case '1_day_before':
      return { bg: '#FEE2E2', color: '#991B1B', border: '#FCA5A5', label: 'HIGH PRIORITY' };
    case '7_days_before':
      return { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', label: 'EXPIRING SOON' };
    default:
      return { bg: '#DBEAFE', color: '#1E40AF', border: '#93C5FD', label: 'UPCOMING RENEWAL' };
  }
}

/**
 * HTML Template for Internal Admin Notification
 */
function generateAdminEmailHtml(service, reminderType) {
  const badge = getReminderBadge(reminderType);
  const reminderLabel = getReminderLabel(reminderType);
  const expiryFormatted = service.expiryDate ? new Date(service.expiryDate).toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  }) : 'N/A';
  const startFormatted = service.startDate ? new Date(service.startDate).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'N/A';
  const followupFormatted = service.nextFollowupDate ? new Date(service.nextFollowupDate).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Not scheduled';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; padding: 30px 20px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 24px 30px; color: #FFFFFF;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h2 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Averqon CRM — Renewal Alert</h2>
          </div>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #BFDBFE;">Automated Post-Delivery Service Tracking</p>
        </div>

        <!-- Body -->
        <div style="padding: 28px 30px;">
          
          <div style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; background: ${badge.bg}; color: ${badge.color}; border: 1px solid ${badge.border}; margin-bottom: 16px;">
            ${badge.label} · ${reminderLabel}
          </div>

          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #0F172A; font-weight: 700;">
            ${service.serviceName}
          </h3>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748B; width: 140px;">Service Type:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${service.serviceType}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Client:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #2563EB;">${service.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Linked Project:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${service.projectName || 'General / Direct'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Current Period:</td>
                <td style="padding: 6px 0; color: #334155;">${startFormatted} → <strong>${expiryFormatted}</strong></td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Renewal Amount:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #059669; font-size: 15px;">₹${(service.renewalAmount || 0).toLocaleString('en-IN')} (${service.billingFrequency})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Status:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #D97706;">${service.status}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Next Follow-Up:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #475569;">${followupFormatted}</td>
              </tr>
              ${service.notes ? `
              <tr>
                <td style="padding: 6px 0; color: #64748B; vertical-align: top;">Notes:</td>
                <td style="padding: 6px 0; color: #475569;">${service.notes}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <!-- Actions -->
          <div style="text-align: center; margin-top: 24px;">
            <a href="https://averqon.in/admin/resources/ServiceRenewal" 
               style="display: inline-block; background: #2563EB; color: #FFFFFF; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none; box-shadow: 0 2px 4px rgba(37,99,235,0.2);">
              Open in Averqon CRM
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background: #F1F5F9; padding: 16px 30px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
          Averqon HRMS & CRM Engine · Automated Delivery Tracking · ${new Date().getFullYear()}
        </div>

      </div>
    </div>
  `;
}

/**
 * HTML Template for Client-Facing Notification
 */
function generateClientEmailHtml(service) {
  const expiryFormatted = service.expiryDate ? new Date(service.expiryDate).toLocaleDateString('en-IN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  }) : 'N/A';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; padding: 30px 20px; color: #1E293B;">
      <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        
        <div style="background: linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%); padding: 24px 30px; color: #FFFFFF;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Averqon Service Notice</h2>
          <p style="margin: 6px 0 0 0; font-size: 13px; color: #BFDBFE;">Upcoming Service Renewal</p>
        </div>

        <div style="padding: 28px 30px;">
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            Dear <strong>${service.clientName}</strong> team,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            This is a courteous reminder that your post-delivery service <strong>${service.serviceName}</strong> (${service.serviceType}) is scheduled for renewal on <strong>${expiryFormatted}</strong>.
          </p>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 18px 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Service:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #0F172A;">${service.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Renewal Expiry Date:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #DC2626;">${expiryFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748B;">Renewal Cost:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #059669;">₹${(service.renewalAmount || 0).toLocaleString('en-IN')} (${service.billingFrequency})</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #64748B;">
            To ensure uninterrupted service and zero downtime for your critical infrastructure, please contact your account manager or reply directly to this email.
          </p>
          <p style="font-size: 13px; color: #334155; margin-top: 24px;">
            Warm regards,<br />
            <strong>Averqon Operations & Support Team</strong><br />
            <a href="mailto:averqonhq@gmail.com" style="color: #2563EB; text-decoration: none;">averqonhq@gmail.com</a>
          </p>
        </div>

        <div style="background: #F1F5F9; padding: 16px 30px; text-align: center; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
          © ${new Date().getFullYear()} Averqon. All rights reserved.
        </div>
      </div>
    </div>
  `;
}

/**
 * Main function to evaluate all services and dispatch appropriate reminders.
 * Safe, idempotent, logs all deliveries, avoids duplicates, and retries failed attempts.
 */
export async function checkAndDispatchRenewalReminders() {
  console.log('[RenewalScheduler] 🔄 Checking service renewals for reminder triggers...');
  const transporter = createTransporter();
  const adminEmail = await getConfiguredAdminEmail();

  const report = {
    evaluatedCount: 0,
    adminEmailsSent: 0,
    clientEmailsSent: 0,
    skippedDuplicate: 0,
    retriedCount: 0,
    failedCount: 0,
    statusUpdates: 0,
    errors: []
  };

  try {
    const activeServices = await Models.ServiceRenewal.find({
      autoReminderEnabled: { $ne: false },
      status: { $in: ['Active', 'Pending Renewal', 'Overdue'] }
    });

    report.evaluatedCount = activeServices.length;

    const now = new Date();
    // Normalize to date at midnight for exact day delta calculation
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    for (const service of activeServices) {
      if (!service.expiryDate) continue;

      const expiry = new Date(service.expiryDate);
      const expiryDay = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
      
      const diffTime = expiryDay.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Determine eligible reminder types based on diffDays
      let reminderType = null;
      if (diffDays === 30) reminderType = '30_days_before';
      else if (diffDays === 15) reminderType = '15_days_before';
      else if (diffDays === 7) reminderType = '7_days_before';
      else if (diffDays === 1) reminderType = '1_day_before';
      else if (diffDays === 0) reminderType = 'on_expiry';
      else if (diffDays < 0 && diffDays >= -14) reminderType = 'after_expiry_followup';

      // Status updates
      let shouldSaveService = false;
      if (diffDays < 0 && service.status !== 'Overdue' && service.status !== 'Renewed' && service.status !== 'Cancelled') {
        service.status = 'Overdue';
        shouldSaveService = true;
        report.statusUpdates++;
      } else if (diffDays <= 30 && diffDays >= 0 && service.status === 'Active') {
        service.status = 'Pending Renewal';
        shouldSaveService = true;
        report.statusUpdates++;
      }
      if (shouldSaveService) {
        await service.save();
      }

      if (!reminderType) {
        // Not at a reminder checkpoint today
        continue;
      }

      // ── Process Admin Reminder ──
      await processSingleReminder({
        service,
        reminderType,
        recipientEmail: adminEmail,
        recipientType: 'Admin',
        transporter,
        htmlContent: generateAdminEmailHtml(service, reminderType),
        subject: `[Renewal Alert: ${getReminderLabel(reminderType)}] ${service.serviceName} (${service.clientName})`,
        report
      });

      // ── Process Client Reminder if enabled ──
      if (service.clientNotificationEnabled && service.clientEmail) {
        await processSingleReminder({
          service,
          reminderType,
          recipientEmail: service.clientEmail.trim(),
          recipientType: 'Client',
          transporter,
          htmlContent: generateClientEmailHtml(service),
          subject: `Service Renewal Notice: ${service.serviceName} - Averqon`,
          report
        });
      }
    }

    console.log('[RenewalScheduler] ✅ Renewal check complete:', JSON.stringify(report));
    return report;
  } catch (err) {
    console.error('[RenewalScheduler] ❌ Error during renewal check:', err);
    report.errors.push(err.message);
    return report;
  }
}

/**
 * Helper to process a single reminder with duplicate prevention & retry logic
 */
async function processSingleReminder({ service, reminderType, recipientEmail, recipientType, transporter, htmlContent, subject, report }) {
  try {
    // Check if log already exists
    const existingLog = await Models.RenewalReminderLog.findOne({
      serviceId: service._id,
      reminderType,
      targetExpiryDate: service.expiryDate,
      recipientEmail
    });

    if (existingLog) {
      if (existingLog.status === 'Sent') {
        // Already sent successfully
        report.skippedDuplicate++;
        return;
      }
      if (existingLog.status === 'Failed') {
        if (existingLog.attemptCount >= 3) {
          // Exhausted retries
          report.skippedDuplicate++;
          return;
        }
        // Retry attempt
        report.retriedCount++;
        existingLog.attemptCount += 1;
        existingLog.lastAttemptAt = new Date();
      }
    }

    const logRecord = existingLog || new Models.RenewalReminderLog({
      serviceId: service._id,
      serviceName: service.serviceName,
      clientName: service.clientName,
      reminderType,
      targetExpiryDate: service.expiryDate,
      recipientEmail,
      recipientType,
      attemptCount: 1,
      lastAttemptAt: new Date()
    });

    if (!transporter) {
      console.warn(`[RenewalScheduler] ⚠️ SMTP Transporter not configured. Simulating delivery to ${recipientEmail}`);
      logRecord.status = 'Sent';
      logRecord.sentAt = new Date();
      await logRecord.save();
      if (recipientType === 'Admin') report.adminEmailsSent++;
      else report.clientEmailsSent++;
      return;
    }

    // Send via Nodemailer
    const sender = process.env.SMTP_FROM || `"Averqon Operations" <averqonhq@gmail.com>`;
    await transporter.sendMail({
      from: sender,
      to: recipientEmail,
      subject,
      html: htmlContent
    });

    logRecord.status = 'Sent';
    logRecord.sentAt = new Date();
    logRecord.error = null;
    await logRecord.save();

    console.log(`[RenewalScheduler] ✉️ Sent ${reminderType} to ${recipientType} (${recipientEmail}) for "${service.serviceName}"`);
    if (recipientType === 'Admin') report.adminEmailsSent++;
    else report.clientEmailsSent++;

  } catch (err) {
    console.error(`[RenewalScheduler] ❌ Failed to dispatch email to ${recipientEmail}:`, err.message);
    report.failedCount++;
    report.errors.push(`${recipientEmail}: ${err.message}`);

    try {
      await Models.RenewalReminderLog.findOneAndUpdate(
        {
          serviceId: service._id,
          reminderType,
          targetExpiryDate: service.expiryDate,
          recipientEmail
        },
        {
          $set: {
            status: 'Failed',
            lastAttemptAt: new Date(),
            error: err.message
          },
          $inc: { attemptCount: 1 },
          $setOnInsert: {
            serviceName: service.serviceName,
            clientName: service.clientName,
            recipientType
          }
        },
        { upsert: true, new: true }
      );
    } catch (logErr) {
      console.error('[RenewalScheduler] Could not save failed log:', logErr.message);
    }
  }
}

/**
 * Initializes the background scheduler running inside the Node server process.
 */
let schedulerInterval = null;

export function startRenewalScheduler(intervalHours = 12) {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  console.log(`[RenewalScheduler] 🕒 Background scheduler scheduled every ${intervalHours} hours.`);

  // Initial delayed execution 15 seconds after server boot to allow full DB connect
  setTimeout(() => {
    checkAndDispatchRenewalReminders().catch(err => {
      console.error('[RenewalScheduler] Initial background run error:', err);
    });
  }, 15000);

  // Periodic recurring check
  const intervalMs = intervalHours * 60 * 60 * 1000;
  schedulerInterval = setInterval(() => {
    checkAndDispatchRenewalReminders().catch(err => {
      console.error('[RenewalScheduler] Periodic background run error:', err);
    });
  }, intervalMs);
}
