import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = supabaseAdmin
    
    // Récupérer la configuration de vote depuis la base de données
    const { data: config, error } = await supabase
      .from('voting_config')
      .select('*')
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Erreur lors de la récupération de la config:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
    
    // Transformer les données de snake_case à camelCase
    const transformedConfig = config ? {
      currentEvent: config.current_event,
      isVotingOpen: config.is_voting_open,
      blockMessage: config.block_message,
      updatedAt: config.updated_at,
      createdAt: config.created_at
    } : null
    
    // Si pas de config, utiliser la configuration par défaut
    const defaultConfig = {
      currentEvent: null,
      isVotingOpen: false,
      blockMessage: "Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d'information contactez le 70359104 (WhatsApp)"
    }
    
    return NextResponse.json(transformedConfig || defaultConfig)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    console.log('🗳️ Mise à jour configuration votes:', body)
    
    const { currentEvent, isVotingOpen, blockMessage } = body
    
    // Mettre à jour la configuration
    const { data, error } = await supabase
      .from('voting_config')
      .upsert({
        id: '66c822a3-798c-493f-8490-4d13d378231b', // Utiliser l'UUID existant
        current_event: currentEvent,
        is_voting_open: isVotingOpen,
        block_message: isVotingOpen 
          ? "Les votes sont actuellement ouverts." 
          : blockMessage || "Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d'information contactez le 70359104 (WhatsApp)",
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erreur lors de la mise à jour de la config:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
    
    console.log('✅ Configuration votes mise à jour:', data)
    
    // Transformer les données de réponse en camelCase
    const transformedData = data ? {
      currentEvent: data.current_event,
      isVotingOpen: data.is_voting_open,
      blockMessage: data.is_voting_open 
        ? "Les votes sont actuellement ouverts." 
        : data.block_message || "Votes temporairement indisponible. Les votes sont actuellement fermés. Ils seront ouverts très bientôt. Pour plus d'information contactez le 70359104 (WhatsApp)",
      updatedAt: data.updated_at
    } : null
    
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('❌ Erreur POST voting-config:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
