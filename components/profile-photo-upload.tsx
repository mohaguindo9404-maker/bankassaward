"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Upload, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProfilePhotoUploadProps {
  currentPhoto?: string
  userId: string
  onPhotoUpdate: (photoUrl: string) => void
  size?: "sm" | "md" | "lg"
  showUploadButton?: boolean
  showAvatarOption?: boolean
}

export function ProfilePhotoUpload({ 
  currentPhoto, 
  userId, 
  onPhotoUpdate, 
  size = "md",
  showUploadButton = true,
  showAvatarOption = true
}: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24"
  }

  const getRandomAvatar = (userId: string) => {
    const avatarStyles = [
      "adventurer", "adventurer-neutral", "avataaars", "avataaars-neutral",
      "big-ears", "big-ears-neutral", "big-smile", "bottts", "bottts-neutral",
      "croodles", "croodles-neutral", "fun-emoji", "icons", "identicon",
      "initials", "lorelei", "lorelei-neutral", "micah", "miniavs",
      "notionists", "notionists-neutral", "open-peeps", "personas",
      "pixel-art", "pixel-art-neutral", "shapes"
    ]
    
    const seed = userId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)]
    
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
  }

  const displayPhoto = preview || currentPhoto

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide')
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }

    // Créer un aperçu
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const uploadPhoto = async () => {
    if (!preview) return

    setIsUploading(true)
    try {
      // Simuler l'upload (remplacer par votre vraie logique d'upload)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Pour l'instant, utiliser l'aperçu comme URL
      onPhotoUpdate(preview)
      setShowUploadModal(false)
      setPreview(null)
      
      // Réinitialiser l'input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error)
      alert('Erreur lors du téléchargement de la photo')
    } finally {
      setIsUploading(false)
    }
  }

  const cancelUpload = () => {
    setPreview(null)
    setShowUploadModal(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const generateRandomAvatar = () => {
    const avatarUrl = getRandomAvatar(userId)
    onPhotoUpdate(avatarUrl)
    setShowAvatarModal(false)
  }

  const chooseAvatarStyle = () => {
    setShowAvatarModal(true)
  }

  return (
    <div className="relative">
      {/* Photo de profil */}
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-primary/20 shadow-lg`}>
        {displayPhoto ? (
          <img 
            src={displayPhoto}
            alt="Photo de profil"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Camera className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      {showUploadButton && (
        <div className="absolute bottom-0 right-0 flex gap-1">
          <Button
            size="sm"
            className="rounded-full w-8 h-8 p-0 bg-primary hover:bg-primary/90"
            onClick={() => setShowUploadModal(true)}
            title="Télécharger une photo"
          >
            <Upload className="w-4 h-4 text-white" />
          </Button>
          {showAvatarOption && !currentPhoto && (
            <Button
              size="sm"
              className="rounded-full w-8 h-8 p-0 bg-accent hover:bg-accent/90"
              onClick={chooseAvatarStyle}
              title="Choisir un avatar"
            >
              <Camera className="w-4 h-4 text-accent-foreground" />
            </Button>
          )}
        </div>
      )}

      {/* Modal d'upload */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={cancelUpload}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Photo de profil</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelUpload}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Zone d'upload */}
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {preview ? (
                    <div className="space-y-4">
                      <img 
                        src={preview} 
                        alt="Aperçu" 
                        className="w-32 h-32 rounded-full mx-auto object-cover border-2 border-primary/20"
                      />
                      <p className="text-sm text-muted-foreground">
                        Cliquez pour changer l'image
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="font-medium">Cliquez pour télécharger</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, GIF (max 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {preview && (
                  <div className="flex gap-2">
                    <Button
                      onClick={uploadPhoto}
                      disabled={isUploading}
                      className="flex-1"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Téléchargement...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Confirmer
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelUpload}
                      disabled={isUploading}
                    >
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de choix d'avatar */}
      <AnimatePresence>
        {showAvatarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAvatarModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Avatar</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAvatarModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Choisissez d'utiliser un avatar généré automatiquement ou laissez votre profil sans photo.
                </p>

                {/* Aperçu d'avatar */}
                <div className="flex justify-center py-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                    <img 
                      src={getRandomAvatar(userId)}
                      alt="Aperçu avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={generateRandomAvatar}
                    className="w-full"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Utiliser cet avatar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAvatarModal(false)}
                    className="w-full"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
