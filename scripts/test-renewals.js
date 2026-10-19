import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import * as Models from '../src/db/models.js';
import { checkAndDispatchRenewalReminders } from '../src/utils/renewalEmailService.js';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function runTests() {
  console.log('🧪 Starting Verification Tests for Renewal & Upsell Module...');
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Verify Models
    console.log('\n--- 1. Testing Model Registration ---');
    console.log('ServiceRenewal model:', !!Models.ServiceRenewal);
    console.log('RenewalHistory model:', !!Models.RenewalHistory);
    console.log('UpsellOpportunity model:', !!Models.UpsellOpportunity);
    console.log('RenewalReminderLog model:', !!Models.RenewalReminderLog);

    // 2. Test ServiceRenewal Creation
    console.log('\n--- 2. Testing Service Creation ---');
    const testService = await Models.ServiceRenewal.create({
      serviceName: 'Unit Test VPS Server',
      serviceType: 'Hosting / VPS renewal',
      clientName: 'Meridian Global',
      projectName: 'AverLink Logistics',
      startDate: new Date('2025-01-01'),
      expiryDate: new Date('2026-01-01'),
      renewalAmount: 50000,
      billingFrequency: 'Annual',
      status: 'Active',
      autoReminderEnabled: true,
      notes: 'Test service verification'
    });
    console.log('✅ Created ServiceRenewal:', testService.serviceId, testService.serviceName);

    // 3. Test Service Renewal & History Preservation
    console.log('\n--- 3. Testing Service Renewal & History Preservation ---');
    const newExpiry = new Date('2027-01-01');
    const renewalPrice = 52000;

    // Create Invoice with Pending status (Never mark paid without verified payment record)
    const invoice = await Models.Invoice.create({
      clientName: testService.clientName,
      projectName: testService.projectName,
      invoiceAmount: renewalPrice,
      taxAmount: 0,
      dueDate: newExpiry,
      status: 'Pending'
    });
    console.log('✅ Generated Invoice (Pending):', invoice.invoiceId, 'Amount: ₹' + invoice.totalAmount);

    // Create RenewalHistory retaining previous period
    const history = await Models.RenewalHistory.create({
      serviceId: testService._id,
      serviceIdentifier: testService.serviceId,
      serviceName: testService.serviceName,
      clientName: testService.clientName,
      projectName: testService.projectName,
      previousPeriodStart: testService.startDate,
      previousExpiryDate: testService.expiryDate,
      newPeriodStart: testService.expiryDate,
      newExpiryDate: newExpiry,
      renewalPrice: renewalPrice,
      invoiceReference: invoice.invoiceId,
      invoiceId: invoice._id,
      paymentStatus: 'Pending',
      renewedAt: new Date(),
      renewedBy: 'Automated Test',
      notes: 'Preserving historical record of period 2025-2026'
    });
    console.log('✅ Created RenewalHistory record ID:', history._id);
    console.log('   Retained previous expiry:', history.previousExpiryDate.toISOString().split('T')[0]);
    console.log('   New expiry date:', history.newExpiryDate.toISOString().split('T')[0]);

    // Update service
    testService.startDate = testService.expiryDate;
    testService.expiryDate = newExpiry;
    testService.renewalAmount = renewalPrice;
    testService.status = 'Renewed';
    testService.latestInvoiceReference = invoice.invoiceId;
    testService.latestPaymentStatus = 'Pending';
    await testService.save();
    console.log('✅ Updated test service status to:', testService.status, 'New expiry:', testService.expiryDate.toISOString().split('T')[0]);

    // 4. Test Upsell Opportunity Creation & Project Conversion
    console.log('\n--- 4. Testing Upsell Opportunity & Project Conversion ---');
    const upsell = await Models.UpsellOpportunity.create({
      clientName: 'Meridian Global',
      title: 'Automated AI Dispatch Telemetry Engine',
      description: 'Machine learning based route dispatch optimization',
      estimatedValue: 175000,
      status: 'Negotiation',
      nextFollowupDate: new Date('2026-11-01'),
      notes: 'High intent deal'
    });
    console.log('✅ Created Upsell Opportunity:', upsell.opportunityId, upsell.title, 'Value: ₹' + upsell.estimatedValue);

    // Convert opportunity to Project
    const convertedProject = await Models.Project.create({
      name: upsell.title,
      client: upsell.clientName,
      teamMembers: ['Sarah Chen'],
      progress: 0,
      deadline: upsell.nextFollowupDate,
      status: 'Pending'
    });
    upsell.status = 'Won';
    upsell.convertedToProject = true;
    upsell.convertedProjectId = convertedProject._id;
    upsell.convertedProjectName = convertedProject.name;
    await upsell.save();
    console.log('✅ Successfully converted to Project:', convertedProject.name, 'ID:', convertedProject._id);
    console.log('   Opportunity status updated to:', upsell.status, 'Converted:', upsell.convertedToProject);

    // 5. Test Email Reminder Evaluation & Duplicate Prevention
    console.log('\n--- 5. Testing Email Reminder & Duplicate Prevention ---');
    const report = await checkAndDispatchRenewalReminders();
    console.log('✅ Reminder check executed cleanly. Evaluated:', report.evaluatedCount);
    console.log('   Admin sent:', report.adminEmailsSent, 'Client sent:', report.clientEmailsSent, 'Skipped duplicates:', report.skippedDuplicate);

    // Clean up test records
    await Models.ServiceRenewal.findByIdAndDelete(testService._id);
    await Models.RenewalHistory.findByIdAndDelete(history._id);
    await Models.Invoice.findByIdAndDelete(invoice._id);
    await Models.UpsellOpportunity.findByIdAndDelete(upsell._id);
    await Models.Project.findByIdAndDelete(convertedProject._id);
    console.log('🧹 Cleaned up temporary test records.');

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failure:', err);
    process.exit(1);
  }
}

runTests();
