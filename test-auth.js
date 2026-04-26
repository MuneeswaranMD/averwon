import mongoose from 'mongoose';
import * as Models from './src/db/models.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

async function testAuth(email, password) {
  try {
    const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";
    await mongoose.connect(uri);

    const manager = await Models.Manager.findOne({ email: email.toLowerCase() });
    if (manager) {
      console.log('Manager found:', manager.email);
      console.log('Hash in DB:', manager.password);
      
      const isMatch = await bcrypt.compare(password, manager.password);
      console.log('Password match:', isMatch);
    } else {
      console.log('Manager not found');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

testAuth('muneeswaranmd2004@gmail.com', 'admin123');
