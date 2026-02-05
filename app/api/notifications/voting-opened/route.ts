import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseAdmin
    const body = await request.json()
    
    const { message, eventId } = body
    
    // Récupérer tous les utilisateurs
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, phone')
    
    if (usersError) {
      console.error('Erreur lors de la récupération des utilisateurs:', usersError)
      return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
    
    // Créer des notifications pour tous les utilisateurs
    const notifications = users?.map(user => ({
      user_id: user.id,
      type: 'VOTING_OPENED',
      title: '🗳️ Votes ouverts !',
      message: message || 'Les votes sont maintenant ouverts. Vous pouvez maintenant voter pour vos candidats préférés.',
      data: { eventId },
      read: false,
      created_at: new Date().toISOString()
    })) || []
    
    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications)
      
      if (notificationError) {
        console.error('Erreur lors de la création des notifications:', notificationError)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ 
      message: 'Notifications envoyées avec succès',
      count: notifications.length 
    })
  } catch (error) {
    console.error('Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
