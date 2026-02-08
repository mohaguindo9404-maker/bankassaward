// 🗄️ CONFIGURATION DU BUCKET SUPABASE STORAGE
// Crée le bucket 'uploads' et configure les permissions

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupSupabaseStorage() {
  console.log('🗄️ CONFIGURATION SUPABASE STORAGE');
  console.log('==================================');

  try {
    // Initialiser Supabase avec service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('\n1️⃣ Vérification du bucket "uploads"...');

    // Vérifier si le bucket existe
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Erreur listage buckets:', bucketsError);
      return false;
    }

    const uploadsBucket = buckets.find(bucket => bucket.name === 'uploads');
    
    if (!uploadsBucket) {
      console.log('   📦 Création du bucket "uploads"...');
      
      // Créer le bucket
      const { data, error } = await supabase.storage.createBucket('uploads', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error('❌ Erreur création bucket:', error);
        return false;
      }

      console.log('   ✅ Bucket "uploads" créé');
    } else {
      console.log('   ✅ Bucket "uploads" existe déjà');
    }

    console.log('\n2️⃣ Configuration des permissions...');

    // Configurer les politiques RLS (Row Level Security)
    const policies = [
      {
        name: 'Allow public uploads',
        definition: `
          CREATE POLICY "Allow public uploads" ON storage.objects
          FOR INSERT WITH CHECK (
            bucket_id = 'uploads' AND 
            (auth.role() = 'authenticated' OR auth.role() = 'anon')
          );
        `
      },
      {
        name: 'Allow public reads',
        definition: `
          CREATE POLICY "Allow public reads" ON storage.objects
          FOR SELECT USING (
            bucket_id = 'uploads'
          );
        `
      },
      {
        name: 'Allow users to update their own files',
        definition: `
          CREATE POLICY "Allow users to update their own files" ON storage.objects
          FOR UPDATE USING (
            bucket_id = 'uploads' AND 
            (auth.uid()::text = (storage.foldername(name))[1])
          );
        `
      }
    ];

    for (const policy of policies) {
      console.log(`   📋 Configuration: ${policy.name}`);
      
      // Note: Les politiques doivent être créées manuellement dans la console Supabase
      console.log(`   ⚠️ Exécutez manuellement dans la console SQL Supabase:`);
      console.log(`   ${policy.definition}`);
      console.log('');
    }

    console.log('\n3️⃣ Test d\'upload...');

    // Créer un fichier de test
    const testFile = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');

    const fileName = `test/${Date.now()}_test.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, testFile, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('❌ Erreur upload test:', uploadError);
      
      if (uploadError.message.includes('policy')) {
        console.log('\n🔧 SOLUTION:');
        console.log('1. Allez dans la console Supabase');
        console.log('2. Section Storage > Policies');
        console.log('3. Créez les politiques listées ci-dessus');
        console.log('4. Réessayez cet upload');
      }
      return false;
    }

    console.log('   ✅ Upload test réussi');

    // Obtenir l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    console.log(`   🔗 URL publique: ${publicUrl}`);

    // Nettoyer le fichier de test
    await supabase.storage
      .from('uploads')
      .remove([fileName]);

    console.log('\n🎯 RÉSULTAT:');
    console.log('=============');
    console.log('✅ Bucket "uploads" configuré');
    console.log('✅ Upload test réussi');
    console.log('✅ URL publique générée');
    console.log('\n📋 ÉTAPES SUIVANTES:');
    console.log('1. Configurez les politiques RLS manuellement');
    console.log('2. Déployez l\'application');
    console.log('3. Testez l\'upload en production');

    return true;

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return false;
  }
}

setupSupabaseStorage().then(success => {
  process.exit(success ? 0 : 1);
});
