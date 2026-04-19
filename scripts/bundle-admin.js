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

    // Copy core production bundles for stability
    const copyAsset = (srcRelative, destName) => {
      try {
        const srcPath = path.resolve('node_modules', srcRelative);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, path.join(process.cwd(), '.adminjs', destName));
          console.log(`✅ Copied ${destName}`);
        }
      } catch (err) {
        console.warn(`⚠️ Could not copy ${destName}:`, err.message);
      }
    };

    copyAsset('adminjs/lib/frontend/assets/scripts/app-bundle.production.js', 'app.bundle.js');
    copyAsset('adminjs/lib/frontend/assets/scripts/global-bundle.production.js', 'global.bundle.js');
    copyAsset('@adminjs/design-system/bundle.production.js', 'design-system.bundle.js');

    console.log('✅ Bundling Complete! Assets are ready in .adminjs folder.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Bundling Failed:', error);
    process.exit(1);
  }
};

bundle();
