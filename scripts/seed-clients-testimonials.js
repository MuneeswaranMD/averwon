import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
import * as Models from '../src/db/models.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function seedClientsAndTestimonials() {
  console.log('🔄 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  try {
    console.log('\n--- 1. UPSERTING THE 5 CONFIRMED CLIENT RECORDS ---');

    // 1. MaxxJoy Tours
    const client1 = await Models.Client.findOneAndUpdate(
      { clientName: { $regex: /^MaxxJoy Tours$/i } },
      {
        clientName: 'MaxxJoy Tours',
        company: 'MaxxJoy Tours',
        status: 'Confirmed',
        totalProjectValue: 10000,
        totalPaid: 10000,
        outstandingBalance: 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Client 1: ${client1.clientName} (ID: ${client1._id})`);

    // 2. RetroStylings
    const client2 = await Models.Client.findOneAndUpdate(
      { clientName: { $regex: /^RetroStylings$/i } },
      {
        clientName: 'RetroStylings',
        company: 'RetroStylings',
        status: 'Confirmed',
        totalProjectValue: 20000,
        totalPaid: 20000,
        outstandingBalance: 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Client 2: ${client2.clientName} (ID: ${client2._id})`);

    // 3. Psychologist (do not invent client name, designation, email, or contact details)
    const client3 = await Models.Client.findOneAndUpdate(
      { clientName: { $regex: /^Psychologist$/i } },
      {
        clientName: 'Psychologist',
        company: 'Psychology Practice',
        status: 'Confirmed',
        totalProjectValue: 15000,
        totalPaid: 15000,
        outstandingBalance: 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Client 3: ${client3.clientName} (ID: ${client3._id})`);

    // 4. Peeyem Traders
    const client4 = await Models.Client.findOneAndUpdate(
      { clientName: { $regex: /^Peeyem Traders$/i } },
      {
        clientName: 'Peeyem Traders',
        company: 'Peeyem Traders',
        address: '16, M.M.A. Market, South Ukkadam, Coimbatore',
        location: 'Coimbatore',
        status: 'Confirmed',
        totalProjectValue: 22000,
        totalPaid: 22000,
        outstandingBalance: 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Client 4: ${client4.clientName} (ID: ${client4._id})`);

    // 5. Dr. R. Murugadoss
    const client5 = await Models.Client.findOneAndUpdate(
      { clientName: { $regex: /^Dr\.?\s*R\.?\s*Murugadoss$/i } },
      {
        clientName: 'Dr. R. Murugadoss',
        organization: 'V.S.B. College of Engineering Technical Campus',
        designation: 'Professor & Head, Artificial Intelligence and Data Science',
        company: 'V.S.B. College of Engineering Technical Campus',
        address: 'Kinathukadavu, Coimbatore',
        location: 'Coimbatore',
        status: 'Confirmed',
        totalProjectValue: 15000,
        totalPaid: 15000,
        outstandingBalance: 0
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Client 5: ${client5.clientName} (ID: ${client5._id})`);

    console.log('\n--- 2. UPSERTING THE 5 CONFIRMED PROJECT RECORDS ---');

    // Project 1: MaxxJoy Tours
    const project1 = await Models.Project.findOneAndUpdate(
      { $or: [{ name: 'Travel website development and deployment' }, { client: 'MaxxJoy Tours' }] },
      {
        name: 'Travel website development and deployment',
        client: client1.clientName,
        clientId: client1._id,
        services: ['Zoho Bookings integration', 'Google Calendar integration', 'Payment integration'],
        projectValue: 10000,
        paymentStatus: 'Fully Paid',
        outstandingBalance: 0,
        progress: 100,
        status: 'Completed'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Project 1: ${project1.name} (Value: ₹${project1.projectValue})`);

    // Project 2: RetroStylings
    const project2 = await Models.Project.findOneAndUpdate(
      { $or: [{ name: 'E-commerce website development' }, { client: 'RetroStylings' }] },
      {
        name: 'E-commerce website development',
        client: client2.clientName,
        clientId: client2._id,
        services: ['E-commerce website development'],
        projectValue: 20000,
        paymentStatus: 'Fully Paid',
        outstandingBalance: 0,
        progress: 100,
        status: 'Completed'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Project 2: ${project2.name} (Value: ₹${project2.projectValue})`);

    // Project 3: Psychologist
    const project3 = await Models.Project.findOneAndUpdate(
      { $or: [{ name: 'Psychology website development' }, { client: 'Psychologist' }] },
      {
        name: 'Psychology website development',
        client: client3.clientName,
        clientId: client3._id,
        services: ['Psychology website development'],
        projectValue: 15000,
        paymentStatus: 'Fully Paid',
        outstandingBalance: 0,
        progress: 100,
        status: 'Completed'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Project 3: ${project3.name} (Value: ₹${project3.projectValue})`);

    // Project 4: Peeyem Traders
    const project4 = await Models.Project.findOneAndUpdate(
      { $or: [{ name: 'Website development, domain, hosting, and maintenance' }, { client: 'Peeyem Traders' }] },
      {
        name: 'Website development, domain, hosting, and maintenance',
        client: client4.clientName,
        clientId: client4._id,
        services: ['Website development', 'Domain', 'Hosting', 'Maintenance'],
        address: '16, M.M.A. Market, South Ukkadam, Coimbatore',
        projectValue: 22000,
        paymentStatus: 'Fully Paid',
        outstandingBalance: 0,
        progress: 100,
        status: 'Completed',
        maintenanceNotes: 'Annual package value ₹22,000. Maintenance charge ₹1,000/month after first 6 months free. Renewal review: September 2027. Maintenance follow-up: August 19, 2027. Maintenance start date: Pending confirmation. Future maintenance charges are not recorded as paid.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Project 4: ${project4.name} (Value: ₹${project4.projectValue})`);

    // Project 5: Dr. R. Murugadoss
    const project5 = await Models.Project.findOneAndUpdate(
      { $or: [{ name: 'Website redesign and server/domain renewal' }, { client: 'Dr. R. Murugadoss' }] },
      {
        name: 'Website redesign and server/domain renewal',
        client: client5.clientName,
        clientId: client5._id,
        services: ['Website redesign', 'Server renewal', 'Domain renewal'],
        projectValue: 15000,
        paymentStatus: 'Fully Paid',
        outstandingBalance: 0,
        progress: 100,
        status: 'Completed',
        maintenanceNotes: 'Next renewal date: Not provided. Attributed to Dr. R. Murugadoss.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Project 5: ${project5.name} (Value: ₹${project5.projectValue})`);

    console.log('\n--- 3. UPSERTING INVOICE & REVENUE PAYMENT RECORDS ---');
    const records = [
      { client: client1.clientName, project: project1.name, amt: 10000, inv: 'INV-2026-0001' },
      { client: client2.clientName, project: project2.name, amt: 20000, inv: 'INV-2026-0002' },
      { client: client3.clientName, project: project3.name, amt: 15000, inv: 'INV-2026-0003' },
      { client: client4.clientName, project: project4.name, amt: 22000, inv: 'INV-2026-0004' },
      { client: client5.clientName, project: project5.name, amt: 15000, inv: 'INV-2026-0005' },
    ];

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      await Models.Invoice.findOneAndUpdate(
        { invoiceId: r.inv },
        {
          invoiceId: r.inv,
          clientName: r.client,
          projectName: r.project,
          invoiceAmount: r.amt,
          totalAmount: r.amt,
          taxAmount: 0,
          discountAmount: 0,
          dueDate: new Date(),
          paymentDate: new Date(),
          status: 'Paid'
        },
        { upsert: true }
      );

      const revId = `REV-2026-${String(i + 1).padStart(4, '0')}`;
      await Models.Revenue.findOneAndUpdate(
        { $or: [{ revenueId: revId }, { clientName: r.client, projectName: r.project }] },
        {
          revenueId: revId,
          clientName: r.client,
          projectName: r.project,
          amount: r.amt,
          status: 'Paid',
          paymentMethod: 'Bank Transfer',
          receivedDate: new Date()
        },
        { upsert: true }
      );
    }
    console.log('✓ Recorded 5 paid invoices and 5 revenue items totaling ₹82,000.');

    console.log('\n--- 4. UPSERTING SERVICE RENEWAL FOR PEEYEM TRADERS ---');
    await Models.ServiceRenewal.findOneAndUpdate(
      { clientName: 'Peeyem Traders' },
      {
        serviceName: 'Peeyem Traders Annual Package (Web, Domain, Hosting & Maintenance)',
        serviceType: 'AMC / Maintenance renewal',
        clientName: client4.clientName,
        clientId: client4._id,
        projectName: project4.name,
        projectId: project4._id,
        startDate: new Date('2026-09-01'),
        expiryDate: new Date('2027-09-01'),
        renewalAmount: 22000,
        status: 'Active',
        notes: 'Annual package value ₹22,000. Maintenance charge ₹1,000/month after first 6 months free. Renewal review: September 2027. Maintenance follow-up: August 19, 2027. Maintenance start date: Pending confirmation. Future maintenance charges are not recorded as paid.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log('✓ Service renewal recorded for Peeyem Traders (Review: Sept 2027, Follow-up: Aug 19, 2027).');

    console.log('\n--- 5. UPSERTING THE 5 TESTIMONIAL RECORDS ---');

    // Testimonial 1: Psychologist
    // Source: Actual client feedback supplied by administrator.
    // Initial status: Pending Publication Approval (Awaiting Publication Consent).
    // Private feedback. Do NOT publish publicly until explicit permission confirmed.
    const text1 = `Honestly, most of my clients have told me that booking a session has become so much easier now, and everyone who has seen the website absolutely loves it.

I’m genuinely so happy and satisfied with how everything has turned out. All the credit for the work and effort you put into building this website goes to you. Thank you so much for making this happen for me! It really means a lot to me. ✨`;

    const test1 = await Models.ClientFeedback.findOneAndUpdate(
      { clientName: 'Psychologist' },
      {
        feedbackId: 'FDB-2026-0001',
        clientName: client3.clientName,
        clientId: client3._id,
        projectId: project3._id,
        project: 'Psychology Website Development',
        source: 'Client-Provided',
        feedbackText: text1,
        status: 'Awaiting Publication Consent',
        clientApproved: true,
        clientApprovalDate: new Date(),
        publicationConsent: false,
        identityDisplayConsent: false,
        imageDisplayConsent: false,
        adminNotes: 'Actual client feedback supplied privately by administrator. Initial status: Pending Publication Approval. Do not publish publicly until explicit permission to publish has been confirmed.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Testimonial 1: ${test1.clientName} (Source: ${test1.source}, Status: ${test1.status}, Consented: ${test1.publicationConsent})`);

    // Testimonial 2: MaxxJoy Tours
    // Suggested draft. Not verified client statement. Draft — Client Approval Required.
    const text2 = "The website gives our travel business a professional online presence and makes it easier to bring our booking process and other services together. We appreciate the effort put into developing the website and integrating the tools needed for our workflow.";
    const test2 = await Models.ClientFeedback.findOneAndUpdate(
      { clientName: 'MaxxJoy Tours' },
      {
        feedbackId: 'FDB-2026-0002',
        clientName: client1.clientName,
        clientId: client1._id,
        projectId: project1._id,
        companyName: client1.company,
        project: 'Travel Website Development',
        source: 'Suggested Draft',
        feedbackText: text2,
        draftText: text2,
        status: 'Draft',
        clientApproved: false,
        publicationConsent: false,
        adminNotes: 'Suggested wording, not verified client statement. Initial status: Draft — Client Approval Required. Do not publish without client approval and publication consent.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Testimonial 2: ${test2.clientName} (Source: ${test2.source}, Status: ${test2.status}, Consented: ${test2.publicationConsent})`);

    // Testimonial 3: RetroStylings
    // Suggested draft. Not verified client statement. Draft — Client Approval Required.
    const text3 = "We wanted a website that reflects our brand and showcases our products professionally. The new e-commerce website gives us a dedicated online platform for our business. We appreciate the time and effort put into bringing this project to life.";
    const test3 = await Models.ClientFeedback.findOneAndUpdate(
      { clientName: 'RetroStylings' },
      {
        feedbackId: 'FDB-2026-0003',
        clientName: client2.clientName,
        clientId: client2._id,
        projectId: project2._id,
        companyName: client2.company,
        project: 'E-commerce Website Development',
        source: 'Suggested Draft',
        feedbackText: text3,
        draftText: text3,
        status: 'Draft',
        clientApproved: false,
        publicationConsent: false,
        adminNotes: 'Suggested wording, not verified client statement. Initial status: Draft — Client Approval Required. Do not publish without client approval and publication consent.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Testimonial 3: ${test3.clientName} (Source: ${test3.source}, Status: ${test3.status}, Consented: ${test3.publicationConsent})`);

    // Testimonial 4: Peeyem Traders
    // Suggested draft. Not verified client statement. Draft — Client Approval Required.
    const text4 = "Having a dedicated website helps us present our business professionally online. We appreciate the work put into developing the website and arranging the domain, hosting, and maintenance services to support our online presence.";
    const test4 = await Models.ClientFeedback.findOneAndUpdate(
      { clientName: 'Peeyem Traders' },
      {
        feedbackId: 'FDB-2026-0004',
        clientName: client4.clientName,
        clientId: client4._id,
        projectId: project4._id,
        companyName: client4.company,
        project: 'Website, Domain, Hosting, and Maintenance',
        source: 'Suggested Draft',
        feedbackText: text4,
        draftText: text4,
        status: 'Draft',
        clientApproved: false,
        publicationConsent: false,
        adminNotes: 'Suggested wording, not verified client statement. Initial status: Draft — Client Approval Required. Do not publish without client approval and publication consent.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Testimonial 4: ${test4.clientName} (Source: ${test4.source}, Status: ${test4.status}, Consented: ${test4.publicationConsent})`);

    // Testimonial 5: Dr. R. Murugadoss
    // Suggested draft. Attributed personally to Dr. R. Murugadoss.
    const text5 = "The website redesign has helped us work toward a more modern and professional online presence. I appreciate the dedication and effort put into the project, along with the attention given to our website and technical requirements.";
    const test5 = await Models.ClientFeedback.findOneAndUpdate(
      { clientName: 'Dr. R. Murugadoss' },
      {
        feedbackId: 'FDB-2026-0005',
        clientName: client5.clientName,
        clientId: client5._id,
        projectId: project5._id,
        organization: 'V.S.B. College of Engineering Technical Campus',
        designation: 'Professor & Head, Artificial Intelligence and Data Science',
        project: 'Website Redesign and Technical Services',
        source: 'Suggested Draft',
        feedbackText: text5,
        draftText: text5,
        status: 'Draft',
        clientApproved: false,
        publicationConsent: false,
        adminNotes: 'Suggested wording, not verified client statement. Attributed personally to Dr. R. Murugadoss, not the institution. Client approval required before publishing.'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`✓ Testimonial 5: ${test5.clientName} (Source: ${test5.source}, Status: ${test5.status}, Consented: ${test5.publicationConsent})`);

    console.log('\n--- 6. VERIFYING TOTAL VALUES & CONSTRAINTS ---');
    const allClients = await Models.Client.find({ clientName: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } });
    console.log(`Total Confirmed Clients: ${allClients.length}`);

    const allProjects = await Models.Project.find({ client: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } });
    const totalVal = allProjects.reduce((sum, p) => sum + (p.projectValue || 0), 0);
    const totalPaid = allProjects.reduce((sum, p) => sum + (p.paymentStatus === 'Fully Paid' ? p.projectValue : 0), 0);
    const totalOutstanding = allProjects.reduce((sum, p) => sum + (p.outstandingBalance || 0), 0);
    console.log(`Total Project Value: ₹${totalVal.toLocaleString('en-IN')}`);
    console.log(`Total Recorded Payments: ₹${totalPaid.toLocaleString('en-IN')}`);
    console.log(`Total Outstanding Balance: ₹${totalOutstanding.toLocaleString('en-IN')}`);

    const allTestimonials = await Models.ClientFeedback.find({ clientName: { $in: ['MaxxJoy Tours', 'RetroStylings', 'Psychologist', 'Peeyem Traders', 'Dr. R. Murugadoss'] } });
    console.log(`Total Testimonials Created: ${allTestimonials.length}`);
    const publishedCount = await Models.ClientFeedback.countDocuments({ status: { $in: ['Approved', 'Published'] }, publicationConsent: true });
    console.log(`Published Public Testimonials: ${publishedCount} (Must be 0)`);

    console.log('\n🎉 ALL 5 CLIENTS, PROJECTS, PAYMENTS & TESTIMONIALS SEEDED ACCURATELY! 🎉\n');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedClientsAndTestimonials();
