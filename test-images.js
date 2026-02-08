// Test pour vérifier l'affichage des images
const fs = require('fs');
const path = require('path');

console.log('🧪 TEST D\'AFFICHAGE DES IMAGES');
console.log('=====================================');

// 1. Vérifier que le dossier uploads existe
const uploadDir = path.join(__dirname, 'public', 'uploads', 'candidates');
console.log('📁 Dossier uploads:', uploadDir);
console.log('📂 Existe:', fs.existsSync(uploadDir));

if (fs.existsSync(uploadDir)) {
  const files = fs.readdirSync(uploadDir);
  console.log('📸 Fichiers trouvés:', files);
  
  files.forEach(file => {
    const filePath = path.join(uploadDir, file);
    const stats = fs.statSync(filePath);
    console.log(`  📎 ${file} (${stats.size} bytes)`);
  });
} else {
  console.log('❌ Dossier uploads inexistant');
}

// 2. Vérifier les URLs attendues
console.log('\n🔗 URLs attendues:');
console.log('  http://localhost:3000/uploads/candidates/[nom_fichier]');

// 3. Instructions pour tester
console.log('\n📋 COMMENT TESTER:');
console.log('1. Démarrez: npm run dev');
console.log('2. Allez en: http://localhost:3000');
console.log('3. Admin → Modifier un candidat');
console.log('4. Glissez une image');
console.log('5. Vérifiez la console:');
console.log('   📸 Fichier sélectionné: [nom]');
console.log('   📤 Envoi vers /api/simple-upload...');
console.log('   ✅ Fichier uploadé: http://localhost:3000/uploads/candidates/...');
console.log('6. Vérifiez le dossier: public/uploads/candidates/');
console.log('7. Testez l\'URL: http://localhost:3000/uploads/candidates/[fichier]');

console.log('\n🎯 SI LES IMAGES NE S\'AFFICHENT PAS:');
console.log('- Vérifiez que le fichier existe dans public/uploads/candidates/');
console.log('- Vérifiez l\'URL dans la base de données');
console.log('- Vérifiez la console du navigateur (F12 → Network)');
console.log('- Vérifiez les erreurs 404 dans la console');

console.log('\n✅ TEST TERMINÉ');
console.log('=====================================');
