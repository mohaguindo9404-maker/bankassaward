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
      blockMessage: "Les votes sont actuellement fermés. Ils seront ouverts le jour de l'événement."
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
    
    const { currentEvent, isVotingOpen, blockMessage } = body
    
    // Mettre à jour la configuration
    const { data, error } = await supabase
      .from('voting_config')
      .upsert({
        id: 'main',
        current_event: currentEvent,
        is_voting_open: isVotingOpen,
        block_message: blockMessage,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la config:', error)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
    
    // Transformer les données de réponse en camelCase
    const transformedData = data ? {
      currentEvent: data.current_event,
      isVotingOpen: data.is_voting_open,
      blockMessage: data.block_message,
      updatedAt: data.updated_at,
      createdAt: data.created_at
    } : null
    
    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
