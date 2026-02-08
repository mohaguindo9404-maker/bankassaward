import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Récupérer tous les candidats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    // Validation du format UUID si categoryId est fourni
    if (categoryId) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(categoryId)) {
        console.log('❌ UUID invalide pour categoryId:', categoryId)
        return NextResponse.json({ error: 'ID catégorie invalide' }, { status: 400 })
      }
    }

    let query = supabaseAdmin
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: true })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un nouveau candidat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { categoryId, name, alias, image, bio, achievements, songCount, candidateSong, audioFile } = body

    // Validation
    if (!categoryId || !name || !image || !bio) {
      return NextResponse.json({ error: 'Catégorie, nom, image et bio sont requis' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('candidates')
      .insert({
        category_id: categoryId,
        name,
        alias,
        image,
        bio,
        achievements: achievements || [],
        song_count: songCount,
        candidate_song: candidateSong,
        audio_file: audioFile
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT - Mettre à jour un candidat
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID candidat requis' }, { status: 400 })
    }

    console.log('📤 Données reçues pour mise à jour:', { id, updateData })

    // Convertir les noms de champs pour la base de données
    const dbUpdateData: any = {}
    
    // Mapping explicite des champs
    if (updateData.categoryId !== undefined) {
      dbUpdateData.category_id = updateData.categoryId
    }
    if (updateData.songCount !== undefined) {
      dbUpdateData.song_count = updateData.songCount
    }
    if (updateData.candidateSong !== undefined) {
      dbUpdateData.candidate_song = updateData.candidateSong
    }
    if (updateData.audioFile !== undefined) {
      dbUpdateData.audio_file = updateData.audioFile
    }

    // Ajouter les autres champs qui n'ont pas besoin de conversion
    const directFields = ['name', 'alias', 'image', 'bio', 'achievements']
    directFields.forEach(key => {
      if (updateData[key] !== undefined) {
        dbUpdateData[key] = updateData[key]
      }
    })

    console.log('📤 Données converties pour DB:', dbUpdateData)

    const { data, error } = await supabaseAdmin
      .from('candidates')
      .update(dbUpdateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erreur Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Candidat mis à jour:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('❌ Erreur serveur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Supprimer un candidat
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID candidat requis' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Candidat supprimé avec succès' })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
