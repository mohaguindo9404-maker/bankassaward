const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Déploiement Bankass Awards sur Netlify...\n');

try {
  // 1. Nettoyage
  console.log('1. Nettoyage du build précédent...');
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
  }

  // 2. Build
  console.log('2. Build du projet...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. Vérification
  if (fs.existsSync('.next')) {
    console.log('✅ Build réussi!');
    console.log('📁 Dossier .next créé avec succès');
    
    console.log('\n🎯 INSTRUCTIONS DÉPLOIEMENT NETLIFY:');
    console.log('══════════════════════════════════════════════════════════');
    console.log('');
    console.log('1. 🌐 Allez sur: https://app.netlify.com/drop');
    console.log('2. 📁 Glissez le DOSSIER ".next" (pas le zip)');
    console.log('3. ⚙️  Configurez les variables d\'environnement:');
    console.log('');
    console.log('   Variables à ajouter:');
    console.log('   ┌─────────────────────────────────────────────────┐');
    console.log('   │ NEXT_PUBLIC_SUPABASE_URL                        │');
    console.log('   │ https://vamthumimnkfdcokfmor.supabase.co        │');
    console.log('   └─────────────────────────────────────────────────┘');
    console.log('   ┌─────────────────────────────────────────────────┐');
    console.log('   │ NEXT_PUBLIC_SUPABASE_ANON_KEY                   │');
    console.log('   │ sb_publishable_rxI5prOx2rcr8a1AgxW0Jw_LGREY4Zl │');
    console.log('   └─────────────────────────────────────────────────┘');
    console.log('   ┌─────────────────────────────────────────────────┐');
    console.log('   │ SUPABASE_SERVICE_ROLE_KEY                       │');
    console.log('   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...       │');
    console.log('   └─────────────────────────────────────────────────┘');
    console.log('');
    console.log('4. 🚀 Déployez et votre site sera disponible!');
    console.log('');
    console.log('🌐 URL: https://votre-site-unique.netlify.app');
    console.log('');
    console.log('✨ Fonctionnalités disponibles:');
    console.log('   • Vote en temps réel');
    console.log('   • Photos de profil et avatars');
    console.log('   • Notifications');
    console.log('   • Administration complète');
    console.log('   • Design responsive');
    console.log('');
    console.log('🎉 Bankass Awards est prêt pour Netlify!');
    
  } else {
    console.error('❌ Erreur de build!');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
