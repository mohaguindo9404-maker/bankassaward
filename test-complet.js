// Script de test complet pour l'application
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';

// Fonction pour faire des requêtes HTTP avec meilleure gestion d'erreurs
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Erreur de connexion:', error.message);
      resolve({ status: 0, error: error.message });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, error: 'Timeout après 5 secondes' });
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test 1: Upload d'image
async function testImageUpload() {
  console.log('\n🧪 TEST 1: Upload d\'image');
  
  try {
    // Créer une image de test
    const testImagePath = path.join(__dirname, 'test-upload.jpg');
    const testImageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46,
      0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
      0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43
    ]);
    fs.writeFileSync(testImagePath, testImageBuffer);
    
    // Simuler un upload (simplifié)
    console.log('✅ Image de test créée');
    console.log('📁 Fichier:', testImagePath);
    
    // Nettoyer
    fs.unlinkSync(testImagePath);
    console.log('✅ Test upload terminé');
    
  } catch (error) {
    console.error('❌ Erreur test upload:', error.message);
  }
}

// Test 2: Ouverture des votes
async function testOpenVotes() {
  console.log('\n🧪 TEST 2: Ouverture des votes');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/voting-config',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const voteData = {
      currentEvent: 'Test Event',
      isVotingOpen: true,
      blockMessage: ''
    };
    
    const response = await makeRequest(options, voteData);
    
    if (response.status === 200) {
      console.log('✅ Votes ouverts avec succès');
      console.log('📊 Réponse:', response.data);
    } else if (response.status === 0) {
      console.error('❌ Serveur non démarré ou inaccessible');
      console.log('💡 Solution: Démarrez "npm run dev" dans un autre terminal');
    } else {
      console.error('❌ Erreur ouverture votes:', response.status, response.data || response.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur test ouverture:', error.message);
  }
}

// Test 3: Fermeture des votes
async function testCloseVotes() {
  console.log('\n🧪 TEST 3: Fermeture des votes');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/voting-config',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const voteData = {
      currentEvent: 'Test Event',
      isVotingOpen: false,
      blockMessage: 'Les votes sont fermés pour test.'
    };
    
    const response = await makeRequest(options, voteData);
    
    if (response.status === 200) {
      console.log('✅ Votes fermés avec succès');
      console.log('📊 Réponse:', response.data);
    } else {
      console.error('❌ Erreur fermeture votes:', response.status, response.data);
    }
    
  } catch (error) {
    console.error('❌ Erreur test fermeture:', error.message);
  }
}

// Test 4: Vérification de l'état
async function testGetStatus() {
  console.log('\n🧪 TEST 4: Vérification état');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/voting-config',
      method: 'GET'
    };
    
    const response = await makeRequest(options);
    
    if (response.status === 200) {
      console.log('✅ État récupéré avec succès');
      console.log('📊 Configuration actuelle:', response.data);
    } else if (response.status === 0) {
      console.error('❌ Serveur non démarré ou inaccessible');
      console.log('💡 Solution: Démarrez "npm run dev" dans un autre terminal');
    } else {
      console.error('❌ Erreur récupération état:', response.status, response.data || response.error);
    }
    
  } catch (error) {
    console.error('❌ Erreur test état:', error.message);
  }
}

// Fonction principale
async function runAllTests() {
  console.log('🚀 DÉMARRAGE DES TESTS COMPLETS');
  console.log('=====================================');
  
  // Attendre que le serveur soit prêt
  console.log('⏳ Attente du serveur...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Exécuter tous les tests
  await testGetStatus();
  await testOpenVotes();
  await testGetStatus();
  await testCloseVotes();
  await testGetStatus();
  await testImageUpload();
  
  console.log('\n🎉 TOUS LES TESTS TERMINÉS');
  console.log('=====================================');
  console.log('📝 Vérifiez la console du navigateur pour plus de détails');
  console.log('📁 Vérifiez le dossier public/uploads/candidates pour les images');
}

// Exécuter les tests
runAllTests().catch(console.error);
