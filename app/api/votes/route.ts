import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer tous les votes
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('votes')
      .select(`
        *,
        user:users(name, email),
        category:categories(name),
        candidate:candidates(name)
      `)
      .order('timestamp', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Ajouter un vote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, categoryId, candidateName } = body

    // Validation
    if (!userId || !categoryId || !candidateName) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
    }

    // Vérifier si l'utilisateur a déjà voté dans cette catégorie
    const { data: existingVote } = await supabaseAdmin
      .from('votes')
      .select('id')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .single()

    if (existingVote) {
      return NextResponse.json({ error: 'Vous avez déjà voté dans cette catégorie' }, { status: 400 })
    }

    // Créer le vote
    const { data, error } = await supabaseAdmin
      .from('votes')
      .insert({
        user_id: userId,
        category_id: categoryId,
        candidate_name: candidateName,
        timestamp: Date.now()
      })
      .select()
      .single()

    if (error) {
      console.error("Erreur Supabase:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Erreur serveur:", error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un vote (admin seulement)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID vote requis' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('votes')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Vote supprimé avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
