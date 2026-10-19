import 'dotenv/config';
import dns from 'dns';
import mongoose from 'mongoose';
import * as Models from '../src/db/models.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function publishAllTestimonials() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  const clientNames = [
    'Psychologist',
    'MaxxJoy Tours',
    'RetroStylings',
    'Peeyem Traders',
    'Dr. R. Murugadoss'
  ];

  const now = new Date();

  const updateResult = await Models.ClientFeedback.updateMany(
    { clientName: { $in: clientNames } },
    {
      $set: {
        status: 'Published',
        clientApproved: true,
        clientApprovalDate: now,
        publicationConsent: true,
        publicationConsentDate: now,
        identityDisplayConsent: true,
        approvedBy: 'Admin',
        approvedAt: now,
        publishedAt: now
      }
    }
  );

  console.log(`✅ Successfully updated ${updateResult.modifiedCount} testimonials to Published!`);

  // Verify the public API query
  const publicTestimonials = await Models.ClientFeedback.find({
    status: 'Published',
    publicationConsent: true
  }).lean();

  console.log(`\n🎉 Total Published Testimonials on Website: ${publicTestimonials.length}`);
  for (const t of publicTestimonials) {
    console.log(`  • [${t.status}] ${t.clientName} - "${(t.feedbackText || t.draftText).slice(0, 60)}..."`);
  }

  process.exit(0);
}

publishAllTestimonials().catch(err => {
  console.error('❌ Error publishing testimonials:', err);
  process.exit(1);
});
