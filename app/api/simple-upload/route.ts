import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Validation simple
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Veuillez fournir une image' }, { status: 400 })
    }

    // Créer le dossier s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'candidates')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${timestamp}_${random}.${extension}`
    const filePath = join(uploadDir, fileName)

    // Convertir File en Buffer et sauvegarder
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(filePath, buffer)

    // Retourner l'URL publique complète
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000'
    const publicUrl = `${baseUrl}/uploads/candidates/${fileName}`
    
    console.log('✅ Fichier uploadé:', publicUrl)
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    })

  } catch (error) {
    console.error('❌ Erreur upload simple:', error)
    return NextResponse.json({ 
      error: 'Erreur lors de l\'upload: ' + (error instanceof Error ? error.message : 'Erreur inconnue')
    }, { status: 500 })
  }
}
