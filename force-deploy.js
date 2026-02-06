const { execSync } = require('child_process');

console.log('🚀 Forcing Vercel deployment...');

try {
  // Nettoyer le build (Windows)
  console.log('🧹 Cleaning build...');
  execSync('rmdir /s /q .next', { stdio: 'inherit' });
  
  // Rebuild
  console.log('🔨 Rebuilding...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('✅ Build completed. Vercel should deploy automatically.');
  console.log('🌐 Check: https://bankassaward.org');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
