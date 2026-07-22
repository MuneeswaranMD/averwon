import mongoose from 'mongoose';
import * as Models from './src/db/models.js';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function updateProfiles() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    const result = await Models.Employee.updateMany(
      {},
      {
        $set: {
          reportingManager: 'Sarah Chen',
          emergencyContacts: [
            { name: 'Muneeswaran', rel: 'Primary Contact', phone: '+91 8300864083' },
            { name: 'Mary Jane', rel: 'Mother', phone: '+91 98765 12345' }
          ]
        }
      }
    );
    console.log('Updated employee profiles:', result);
  } catch (err) {
    console.error('Error updating profiles:', err);
  } finally {
    process.exit();
  }
}

updateProfiles();
