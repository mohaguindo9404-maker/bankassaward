import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, password } = await request.json()

    // Vérifier que soit email soit téléphone est fourni
    if (!password || (!email && !phone)) {
      return NextResponse.json({ error: 'Identifiant et mot de passe requis' }, { status: 400 })
    }

    let user = null
    let error = null

    // Recherche par email (ancienne méthode)
    if (email) {
      const result = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      user = result.data
      error = result.error
    }
    
    // Recherche par téléphone (nouvelle méthode)
    else if (phone) {
      const result = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()
      
      user = result.data
      error = result.error
    }

    if (error || !user) {
      return NextResponse.json({ error: 'Identifiant ou mot de passe incorrect' }, { status: 401 })
    }

    // Vérifier le mot de passe
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Identifiant ou mot de passe incorrect' }, { status: 401 })
      }
    }

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
