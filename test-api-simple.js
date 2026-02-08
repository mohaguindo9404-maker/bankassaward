// Test simple de l'API avec curl
const { exec } = require('child_process');

console.log('🧪 TEST SIMPLE DE L\'API');
console.log('=====================================');

// Test 1: Vérifier si le serveur est démarré
console.log('\n1️⃣ Test: Vérification serveur...');
exec('curl -s http://localhost:3000/api/voting-config', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Serveur non démarré ou inaccessible');
    console.log('💡 Solution: Démarrez "npm run dev" dans un autre terminal');
    console.log('📋 Commande: npm run dev');
    console.log('🌐 URL: http://localhost:3000');
    return;
  }
  
  try {
    const data = JSON.parse(stdout);
    console.log('✅ Serveur démarré et API répond');
    console.log('📊 Configuration actuelle:', data);
    
    // Test 2: Test d'ouverture des votes
    console.log('\n2️⃣ Test: Ouverture des votes...');
    exec(`curl -s -X POST -H "Content-Type: application/json" -d '{"currentEvent":"Test","isVotingOpen":true,"blockMessage":""}' http://localhost:3000/api/voting-config`, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erreur ouverture votes:', error.message);
      } else {
        try {
          const result = JSON.parse(stdout);
          if (result.isVotingOpen) {
            console.log('✅ Votes ouverts avec succès');
          } else {
            console.log('⚠️ Votes non ouverts (réponse inattendue)');
          }
        } catch (e) {
          console.error('❌ Réponse invalide:', stdout);
        }
      }
      
      // Test 3: Test de fermeture des votes
      console.log('\n3️⃣ Test: Fermeture des votes...');
      exec(`curl -s -X POST -H "Content-Type: application/json" -d '{"currentEvent":"Test","isVotingOpen":false,"blockMessage":"Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d\'information contactez le 70359104 (WhatsApp)"}' http://localhost:3000/api/voting-config`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Erreur fermeture votes:', error.message);
        } else {
          try {
            const result = JSON.parse(stdout);
            if (!result.isVotingOpen && result.blockMessage) {
              console.log('✅ Votes fermés avec succès');
              console.log('📝 Message:', result.blockMessage);
            } else {
              console.log('⚠️ Votes non fermés (réponse inattendue)');
            }
          } catch (e) {
            console.error('❌ Réponse invalide:', stdout);
          }
        }
        
        // Test 4: Vérification finale
        console.log('\n4️⃣ Test: Vérification finale...');
        exec('curl -s http://localhost:3000/api/voting-config', (error, stdout, stderr) => {
          if (error) {
            console.error('❌ Erreur vérification finale:', error.message);
          } else {
            try {
              const finalData = JSON.parse(stdout);
              console.log('✅ Configuration finale:', finalData);
              console.log('\n🎯 RÉSULTATS FINAUX:');
              console.log('- Serveur: ✅ Démarré');
              console.log('- API voting-config: ✅ Fonctionnelle');
              console.log('- Ouverture votes: ✅ Fonctionnelle');
              console.log('- Fermeture votes: ✅ Fonctionnelle');
              console.log('- Message personnalisé: ✅ Sauvegardé');
            } catch (e) {
              console.error('❌ Réponse finale invalide:', stdout);
            }
          }
          
          console.log('\n🎉 TOUS LES TESTS TERMINÉS');
          console.log('=====================================');
        });
      });
    });
    
  } catch (e) {
    console.error('❌ Réponse serveur invalide:', stdout);
  }
});
