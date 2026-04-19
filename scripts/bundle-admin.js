process.env.NODE_ENV = 'production';
import AdminJS from 'adminjs';
import fs from 'fs';
import path from 'path';
import { adminOptions } from '../src/admin/config.js';

const bundle = async () => {
  console.log('🚀 Starting AdminJS Bundling...');
  try {
    const admin = new AdminJS(adminOptions);
    await admin.initialize();
    
    // Rename bundle to components.bundle.js for production consistency
    const oldPath = path.join(process.cwd(), '.adminjs', 'bundle.js');
    const newPath = path.join(process.cwd(), '.adminjs', 'components.bundle.js');
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log('✅ Renamed bundle.js to components.bundle.js');
    }

    // Copy design-system bundle for stability
    try {
      const dsBundlePath = path.resolve('node_modules/@adminjs/design-system/bundle.production.js');
      if (fs.existsSync(dsBundlePath)) {
        fs.copyFileSync(dsBundlePath, path.join(process.cwd(), '.adminjs', 'design-system.bundle.js'));
        console.log('✅ Copied design-system.bundle.js');
      }
    } catch (dsErr) {
      console.warn('⚠️ Could not copy design-system bundle:', dsErr.message);
    }

    console.log('✅ Bundling Complete! Assets are ready in .adminjs folder.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Bundling Failed:', error);
    process.exit(1);
  }
};

bundle();
