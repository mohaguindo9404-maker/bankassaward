// 🧪 TEST AVANT PUSH
// Vérification rapide avant de faire le push

const fs = require('fs');
const { execSync } = require('child_process');

function testBeforePush() {
  console.log('🧪 TEST AVANT PUSH');
  console.log('==================');

  let testsPassed = 0;
  const testsTotal = 4;

  try {
    // 1. Test build
    console.log('\n1️⃣ Build:');
    try {
      execSync('npm run build', { stdio: 'pipe' });
      console.log('   ✅ Build réussi');
      testsPassed++;
    } catch (error) {
      console.log('   ❌ Build échoué');
    }

    // 2. Test fichiers critiques
    console.log('\n2️⃣ Fichiers critiques:');
    const criticalFiles = [
      'package.json',
      'next.config.mjs',
      'lib/supabase.ts'
    ];

    let filesOK = true;
    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        console.log(`   ❌ Manquant: ${file}`);
        filesOK = false;
      }
    }
    
    if (filesOK) {
      console.log('   ✅ Fichiers critiques présents');
      testsPassed++;
    }

    // 3. Test domaine
    console.log('\n3️⃣ Domaine bankassaward.org:');
    try {
      const uploadRoute = fs.readFileSync('app/api/simple-upload/route.ts', 'utf8');
      if (uploadRoute.includes('https://bankassaward.org')) {
        console.log('   ✅ Domaine configuré');
        testsPassed++;
      } else {
        console.log('   ❌ Domaine non configuré');
      }
    } catch (error) {
      console.log('   ❌ Erreur vérification domaine');
    }

    // 4. Test imports
    console.log('\n4️⃣ Imports optimisés:');
    try {
      const candidateModal = fs.readFileSync('components/candidate-detail-modal.tsx', 'utf8');
      if (!candidateModal.includes('Lock, Phone')) {
        console.log('   ✅ Imports optimisés');
        testsPassed++;
      } else {
        console.log('   ❌ Imports inutilisés détectés');
      }
    } catch (error) {
      console.log('   ❌ Erreur vérification imports');
    }

    // Résultat
    console.log('\n🎯 RÉSULTAT:');
    console.log('=============');
    console.log(`✅ Tests réussis: ${testsPassed}/${testsTotal}`);
    
    if (testsPassed === testsTotal) {
      console.log('\n🎉 PRÊT POUR LE PUSH !');
      console.log('   - Build OK ✅');
      console.log('   - Domaine OK ✅');
      console.log('   - Fichiers OK ✅');
      console.log('   - Imports OK ✅');
      console.log('\n🚀 Faites votre push en toute confiance !');
      return true;
    } else {
      console.log('\n⚠️ CORRIGEZ LES ERREURS AVANT LE PUSH');
      return false;
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    return false;
  }
}

testBeforePush();
