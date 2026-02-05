const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Déploiement Bankass Awards sur Netlify...\n');

try {
  // 1. Nettoyage
  console.log('1. Nettoyage du build précédent...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
  }

  // 2. Build
  console.log('2. Build du projet...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Vérification
  if (fs.existsSync('.next')) {
    console.log('✅ Build réussi!');
    console.log('📁 Dossier .next créé avec succès');
    
    console.log('\n🎯 Prochaines étapes:');
    console.log('1. Allez sur https://app.netlify.com/drop');
    console.log('2. Glissez le dossier ".next" dans la zone de déploiement');
    console.log('3. Configurez les variables d\'environnement:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL=https://vamthumimnkfdcokfmor.supabase.co');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rxI5prOx2rcr8a1AgxW0Jw_LGREY4Zl');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
    console.log('\n🌐 Votre site sera disponible à: https://votre-site.netlify.app');
    
    // 4. Créer un zip pour faciliter le déploiement
    console.log('\n📦 Création du fichier zip...');
    const archiver = require('archiver');
    const output = fs.createWriteStream('bkss-award-netlify.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory('.next/', false);
    archive.finalize();

    output.on('close', () => {
      console.log(`✅ Fichier zip créé: bkss-award-netlify.zip (${archive.pointer()} bytes)`);
      console.log('\n🎉 Prêt pour le déploiement sur Netlify!');
    });

  } else {
    console.error('❌ Erreur de build!');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
