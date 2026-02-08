// Test simple de l'API d'upload
const fs = require('fs');
const path = require('path');

// Créer une image de test simple
const createTestImage = () => {
  const testImagePath = path.join(__dirname, 'test-image.jpg');
  
  // Créer un fichier image de test (1x1 pixel noir)
  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
    0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43
  ]);
  
  fs.writeFileSync(testImagePath, jpegHeader);
  return testImagePath;
};

const testUpload = async () => {
  try {
    console.log('🧪 Test de l\'API d\'upload simple...');
    
    // Créer une image de test
    const testImagePath = createTestImage();
    console.log('📸 Image de test créée:', testImagePath);
    
    // Lire le fichier
    const imageBuffer = fs.readFileSync(testImagePath);
    
    // Créer FormData
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename: 'test.jpg',
      contentType: 'image/jpeg'
    });
    
    // Envoyer à l'API
    const response = await fetch('http://localhost:3000/api/simple-upload', {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload réussi !');
      console.log('📸 URL:', result.url);
      console.log('📁 Fichier sauvegardé dans: public/uploads/candidates/');
    } else {
      const error = await response.json();
      console.error('❌ Erreur upload:', error);
    }
    
    // Nettoyer
    fs.unlinkSync(testImagePath);
    console.log('🧹 Test image supprimée');
    
  } catch (error) {
    console.error('❌ Erreur test:', error.message);
  }
};

// Exécuter le test si le serveur est démarré
testUpload();
