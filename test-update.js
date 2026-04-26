import mongoose from 'mongoose';
import * as Models from './src/db/models.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function testSave() {
  await mongoose.connect(uri);
  const hash = await bcrypt.hash('vikram123', 10);
  const res = await Models.Employee.updateOne({ email: 'vikram@averqon.ai' }, { password: hash });
  console.log('Update result:', res);
  process.exit();
}
testSave();
