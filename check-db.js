import mongoose from 'mongoose';
import * as Models from './src/db/models.js';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function check() {
  await mongoose.connect(uri);
  const emps = await Models.Employee.find();
  console.log('Employees:', emps.map(e => ({ name: e.name, email: e.email, hasPass: !!e.password })));
  process.exit();
}
check();
