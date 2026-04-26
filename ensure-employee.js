import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import * as Models from './src/db/models.js';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function run() {
  await mongoose.connect(uri);
  const empPassword = await bcrypt.hash('Munees@123', 10);
  
  const email = 'vikram@averqon.ai';
  let emp = await Models.Employee.findOne({ email });
  
  if (emp) {
    console.log(`Employee ${email} exists, updating password...`);
    emp.password = empPassword;
    await emp.save();
  } else {
    console.log(`Creating employee ${email}...`);
    await Models.Employee.create({
      name: 'Vikram',
      email: email,
      password: empPassword,
      role: 'Employee',
      department: 'Engineering',
      designation: 'Software Engineer',
      joinDate: new Date(),
      salary: 80000,
      status: 'Active'
    });
  }
  
  console.log('Done!');
  process.exit(0);
}

run();
