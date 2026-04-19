import AdminJS from 'adminjs';
import { adminOptions } from '../src/admin/config.js';

const bundle = async () => {
  console.log('🚀 Starting AdminJS Bundling...');
  try {
    const admin = new AdminJS(adminOptions);
    await admin.initialize();
    console.log('✅ Bundling Complete! Assets are ready in .adminjs folder.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Bundling Failed:', error);
    process.exit(1);
  }
};

bundle();
