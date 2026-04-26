import mongoose from 'mongoose';
import * as Models from './src/db/models.js';
import bcrypt from 'bcrypt';
import 'dotenv/config';

const uri = process.env.MONGODB_URI || "mongodb+srv://muneeswaran:Munees270904@admin.9gzsnkj.mongodb.net/?appName=admin";

async function checkEmp() {
  try {
    await mongoose.connect(uri);

    const emp = await Models.Employee.findOne({ email: 'muneeswaranmd2004@gmail.com' });
    console.log('Employee found:', emp ? emp.email : 'Not found');
    if (emp) {
      console.log('Password exists:', !!emp.password);
      if (emp.password) {
        if (!emp.password.startsWith('$2')) {
          console.log('Plaintext password found for employee, hashing it...');
          emp.password = await bcrypt.hash(emp.password, 10);
          await emp.save();
          console.log('Hashed Employee password.');
        } else {
            console.log('Employee password is a valid hash.');
        }
      }
    } else {
      console.log("Maybe user meant employee Muneeswaran MD.");
    }
  } catch(e) { console.error(e) }
  process.exit();
}
checkEmp();
