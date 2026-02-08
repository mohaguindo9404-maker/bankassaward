// Script pour diagnostiquer pourquoi les images ne s'ajoutent pas
const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = 'https://vamthumimnkfdcokfmor.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbXRodW1pbW5rZmRjb2tmbW9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk4NzY3MiwiZXhwIjoyMDg1NTYzNjcyfQ.HqlD0qlhAMtM-Jj_gLuOewnG3xzVnfj83M4VjiLSwdM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function diagnostiqueImages() {
  console.log('🔍 DIAGNOSTIC COMPLET DES IMAGES');
  console.log('====================================');

  try {
    // 1. Vérifier la table candidates
    console.log('\n1️⃣ Vérification de la table candidates...');
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('id, name, image')
      .limit(10);

    if (candidatesError) {
      console.error('❌ Erreur lecture candidates:', candidatesError);
      return;
    }

    console.log(`✅ ${candidates?.length || 0} candidats trouvés`);
    
    if (candidates && candidates.length > 0) {
      console.log('\n📋 État actuel des images:');
      candidates.forEach((candidate, index) => {
        console.log(`${index + 1}. ${candidate.name}:`);
        console.log(`   ID: ${candidate.id}`);
        console.log(`   Image: ${candidate.image || 'NULL'}`);
        
        if (candidate.image) {
          if (candidate.image.startsWith('http')) {
            console.log(`   ✅ URL complète: ${candidate.image}`);
          } else if (candidate.image.startsWith('/uploads/')) {
            console.log(`   ⚠️ URL relative: ${candidate.image}`);
            console.log(`   🔧 Devrait être: http://localhost:3000${candidate.image}`);
          } else if (candidate.image.startsWith('data:')) {
            console.log(`   ⚠️ Base64: ${candidate.image.substring(0, 50)}...`);
            console.log(`   🔧 Trop volumineux pour la base!`);
          } else {
            console.log(`   ❌ Format inconnu: ${candidate.image}`);
          }
        } else {
          console.log(`   ❌ Pas d'image`);
        }
        console.log('---');
      });
    }

    // 2. Vérifier la structure de la table
    console.log('\n2️⃣ Vérification de la structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, character_maximum_length')
      .eq('table_schema', 'public')
      .eq('table_name', 'candidates')
      .eq('column_name', 'image')
      .single();

    if (columnsError) {
      console.log('⚠️ Impossible de vérifier la structure (normal avec Supabase)');
    } else {
      console.log('📋 Colonne image:');
      console.log(`   Type: ${columns.data_type}`);
      console.log(`   Taille max: ${columns.character_maximum_length || 'Illimitée'}`);
    }

    // 3. Test d'écriture avec une URL d'image
    console.log('\n3️⃣ Test d\'écriture d\'image...');
    const testImageUrl = 'http://localhost:3000/uploads/candidates/test_123.jpg';
    
    // Trouver un candidat existant
    const firstCandidate = candidates?.[0];
    if (firstCandidate) {
      console.log(`📝 Test sur le candidat: ${firstCandidate.name} (ID: ${firstCandidate.id})`);
      
      const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update({ image: testImageUrl })
        .eq('id', firstCandidate.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Erreur mise à jour image:', updateError);
        console.log('Code:', updateError.code);
        console.log('Message:', updateError.message);
        console.log('Détails:', updateError.details);
      } else {
        console.log('✅ Mise à jour réussie:');
        console.log('📊 Données:', updateData);
        
        // Vérifier la mise à jour
        const { data: verifyData, error: verifyError } = await supabase
          .from('candidates')
          .select('image')
          .eq('id', firstCandidate.id)
          .single();

        if (verifyError) {
          console.error('❌ Erreur vérification:', verifyError);
        } else {
          console.log('✅ Vérification réussie:');
          console.log('🔗 Image sauvegardée:', verifyData.image);
        }
      }
    } else {
      console.log('❌ Aucun candidat trouvé pour le test');
    }

    // 4. Vérifier le dossier uploads
    console.log('\n4️⃣ Vérification du dossier uploads...');
    const fs = require('fs');
    const path = require('path');
    const uploadDir = path.join(__dirname, 'public', 'uploads', 'candidates');
    
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      console.log(`✅ Dossier uploads existe: ${files.length} fichier(s)`);
      files.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        console.log(`   📎 ${file} (${stats.size} bytes)`);
      });
    } else {
      console.log('❌ Dossier uploads n\'existe pas');
      console.log('💡 Créez-le avec: mkdir -p public/uploads/candidates');
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }

  console.log('\n🎯 CONCLUSION:');
  console.log('====================================');
  console.log('1. Si les images sont en base64 → Trop volumineux');
  console.log('2. Si les images sont en URL relative → Incomplètes');
  console.log('3. Si erreur d\'écriture → Problème de permissions');
  console.log('4. Si dossier uploads vide → Upload ne fonctionne pas');
}

// Exécuter le diagnostic
diagnostiqueImages();
