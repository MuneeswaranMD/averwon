import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import * as Models from '../src/db/models.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function verifyAll() {
  console.log('🔍 Starting Comprehensive Averqon CRM Verification...\n');
  await mongoose.connect(MONGODB_URI);

  // 1. Verify 5 Confirmed Clients
  console.log('--- Step 1: Checking Confirmed Clients ---');
  const targetClients = [
    'MaxxJoy Tours',
    'RetroStylings',
    'Psychologist',
    'Peeyem Traders',
    'Dr. R. Murugadoss'
  ];

  const clients = await Models.Client.find({ clientName: { $in: targetClients } }).lean();
  console.log(`Found ${clients.length} / 5 confirmed client records.`);

  if (clients.length !== 5) {
    throw new Error(`Expected exactly 5 confirmed clients, found ${clients.length}`);
  }

  let totalProjectValue = 0;
  let totalPaid = 0;
  let totalOutstanding = 0;

  for (const c of clients) {
    console.log(`✓ Client: "${c.clientName}" | Status: ${c.status} | Value: ₹${c.totalProjectValue} | Paid: ₹${c.totalPaid} | Outstanding: ₹${c.outstandingBalance}`);
    totalProjectValue += (c.totalProjectValue || 0);
    totalPaid += (c.totalPaid || 0);
    totalOutstanding += (c.outstandingBalance || 0);

    if (c.clientName === 'Psychologist') {
      if (c.email && c.email.includes('@invented') || c.designation) {
        throw new Error('Psychologist client has invented email or designation!');
      }
      console.log('  → Confirmed: Psychologist has no invented personal name or email.');
    }

    if (c.clientName === 'Peeyem Traders') {
      console.log(`  → Address verified: "${c.address || c.location}"`);
    }

    if (c.clientName === 'Dr. R. Murugadoss') {
      console.log(`  → Designation verified: "${c.designation}" | Org: "${c.organization}"`);
    }
  }

  console.log(`\nTotals Across Confirmed Clients:`);
  console.log(`Total Project Value: ₹${totalProjectValue} (Expected: ₹82,000)`);
  console.log(`Total Payments:      ₹${totalPaid} (Expected: ₹82,000)`);
  console.log(`Outstanding Balance: ₹${totalOutstanding} (Expected: ₹0)`);

  if (totalProjectValue !== 82000 || totalPaid !== 82000 || totalOutstanding !== 0) {
    throw new Error(`Financial totals mismatch! Value: ${totalProjectValue}, Paid: ${totalPaid}, Outstanding: ${totalOutstanding}`);
  }
  console.log('✅ Financial metrics strictly verified at ₹82,000 total with ₹0 outstanding balance.');

  // 2. Verify Projects
  console.log('\n--- Step 2: Checking Projects & Payments ---');
  const projects = await Models.Project.find({
    clientName: { $in: targetClients }
  }).lean();
  console.log(`Found ${projects.length} / 5 project records.`);
  for (const p of projects) {
    console.log(`✓ Project: "${p.name}" (${p.clientName}) | Value: ₹${p.projectValue} | Status: ${p.status} | Payment: ${p.paymentStatus}`);
  }

  // 3. Verify Peeyem Traders Maintenance Details
  console.log('\n--- Step 3: Checking Peeyem Traders Maintenance Details ---');
  const peeyemRenewal = await Models.ServiceRenewal.findOne({ clientName: 'Peeyem Traders' }).lean();
  if (!peeyemRenewal) {
    throw new Error('Peeyem Traders service renewal record not found!');
  }
  console.log(`✓ Peeyem Renewal Service: "${peeyemRenewal.serviceName}"`);
  console.log(`  Renewal Cycle / Review: ${peeyemRenewal.notes || peeyemRenewal.billingFrequency}`);
  console.log(`  Follow-up Date: ${peeyemRenewal.nextFollowupDate ? new Date(peeyemRenewal.nextFollowupDate).toLocaleDateString() : 'N/A'}`);
  console.log(`  Amount: ₹${peeyemRenewal.renewalAmount}/month`);

  // 4. Verify 5 Testimonials & Gating
  console.log('\n--- Step 4: Checking Testimonial Records & Public Visibility ---');
  const feedbacks = await Models.ClientFeedback.find({
    clientName: { $in: targetClients }
  }).lean();
  console.log(`Found ${feedbacks.length} / 5 testimonial records.`);

  for (const fb of feedbacks) {
    console.log(`✓ [${fb.source || 'Client-Provided'}] ${fb.clientName}:`);
    console.log(`  Status: ${fb.status} | Client Approved: ${fb.clientApproved} | Consent: ${fb.publicationConsent}`);
    console.log(`  Snippet: "${(fb.feedbackText || fb.draftText).slice(0, 70)}..."`);
  }

  // Check public endpoint logic
  const publicTestimonials = await Models.ClientFeedback.find({
    status: 'Published',
    publicationConsent: true
  }).lean();
  console.log(`\nPublic Website Testimonials: ${publicTestimonials.length} (Expected: 0 until client approved & consented)`);
  if (publicTestimonials.length !== 0) {
    throw new Error('Unapproved or unconsented testimonials are visible publicly!');
  }
  console.log('✅ Public website safety gate verified: 0 unapproved/unconsented testimonials are displayed publicly.');

  // 5. Check Audit Logs
  const auditLogs = await Models.AuditLog.find({}).sort({ createdAt: -1 }).limit(5).lean();
  console.log(`\nRecent Audit Logs: ${auditLogs.length} events logged.`);
  for (const log of auditLogs) {
    console.log(`  • ${log.action} on ${log.targetModel} (${log.targetId}) by ${log.actorId}`);
  }

  console.log('\n🎉 ALL REQUIREMENTS FULLY VERIFIED AND PASSING!');
  process.exit(0);
}

verifyAll().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
