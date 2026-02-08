const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement local pour éviter les limites Vercel...');

try {
  // 1. Nettoyer le build
  console.log('🧹 Nettoyage...');
  try {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  } catch (e) {
    console.log('Dossier .next déjà nettoyé');
  }
  
  // 2. Build en production
  console.log('🔨 Build production...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 3. Créer un fichier de version
  const version = {
    timestamp: new Date().toISOString(),
    commit: require('child_process').execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
    features: [
      'Fix redirection auth',
      'Persistance données',
      'API votes corrigée', 
      'Suspense boundaries',

    ]
  };
  
  fs.writeFileSync('.next/version.json', JSON.stringify(version, null, 2));
  
  console.log('✅ Build local terminé !');
  console.log('📁 Dossier de production: .next/');
  console.log('🌐 Pour tester: npm run start');
  console.log('📋 Version:', version.commit);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
