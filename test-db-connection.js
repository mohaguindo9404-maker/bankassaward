const { createClient } = require('@supabase/supabase-js')

// Configuration avec vos clés
const supabaseUrl = 'https://vamthumimnkfdcokfmor.supabase.co'
const supabaseAnonKey = 'sb_publishable_rxI5prOx2rcr8a1AgxW0Jw_LGREY4Zl'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbXRodW1pbW5rZmRjb2tmbW9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTk4NzY3MiwiZXhwIjoyMDg1NTYzNjcyfQ.HqlD0qlhAMtM-Jj_gLuOewnG3xzVnfj83M4VjiLSwdM'

// Client admin pour les tests
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testConnection() {
  console.log('🔍 Test de connexion à la base de données...')
  
  try {
    // Test 1: Vérifier la connexion
    console.log('\n1️⃣ Test de connexion générale...')
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('❌ Erreur de connexion:', error.message)
      return
    }
    console.log('✅ Connexion réussie !')
    
    // Test 2: Vérifier les tables de voting
    console.log('\n2️⃣ Vérification des tables de voting...')
    
    const tables = ['voting_config', 'notifications']
    
    for (const tableName of tables) {
      try {
        const { data: tableData, error: tableError } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (tableError) {
          console.error(`❌ Table ${tableName}: ${tableError.message}`)
        } else {
          console.log(`✅ Table ${tableName}: OK`)
        }
      } catch (err) {
        console.error(`❌ Erreur avec table ${tableName}:`, err.message)
      }
    }
    
    // Test 3: Vérifier la configuration de voting
    console.log('\n3️⃣ Vérification de la configuration de voting...')
    const { data: votingConfig, error: configError } = await supabaseAdmin
      .from('voting_config')
      .select('*')
      .single()
    
    if (configError) {
      if (configError.code === 'PGRST116') {
        console.log('⚠️  La table voting_config existe mais est vide')
        console.log('📝 Création de la configuration par défaut...')
        
        // Créer la configuration par défaut
        const { data: newConfig, error: insertError } = await supabaseAdmin
          .from('voting_config')
          .insert({
            id: 'main',
            is_voting_open: false,
            block_message: 'Les votes sont actuellement fermés. Ils seront ouverts le jour de l\'événement.'
          })
          .select()
          .single()
        
        if (insertError) {
          console.error('❌ Erreur lors de la création de la config:', insertError.message)
        } else {
          console.log('✅ Configuration par défaut créée avec succès')
        }
      } else {
        console.error('❌ Erreur de configuration:', configError.message)
      }
    } else {
      console.log('✅ Configuration de voting trouvée:')
      console.log(`   - Votes ouverts: ${votingConfig.is_voting_open}`)
      console.log(`   - Message: ${votingConfig.block_message}`)
    }
    
    // Test 4: Vérifier les utilisateurs
    console.log('\n4️⃣ Vérification des utilisateurs...')
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, name, email, role')
      .limit(5)
    
    if (usersError) {
      console.error('❌ Erreur utilisateurs:', usersError.message)
    } else {
      console.log(`✅ ${users.length} utilisateur(s) trouvé(s):`)
      users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role}`)
      })
    }
    
    console.log('\n🎉 Test terminé !')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
  }
}

// Exécuter le test
testConnection()
