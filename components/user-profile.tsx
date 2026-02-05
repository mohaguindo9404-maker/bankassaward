"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User as UserIcon, Mail, MapPin, Phone, Calendar, Shield, Edit2, Save, X, Eye, EyeOff, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProfilePhotoUpload } from "@/components/profile-photo-upload"
import { useVotes } from "@/hooks/use-api-data"
import type { User } from "@/hooks/use-api-data"

interface UserProfileProps {
  user: User
  onClose: () => void
  onUpdate?: (user: User) => void
}

export function UserProfile({ user, onClose, onUpdate }: UserProfileProps) {
  const { votes } = useVotes()
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editedUser, setEditedUser] = useState<User>(user)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Options pour le domaine
  const domainOptions = [
    "Musique",
    "Audiovisuel", 
    "Journalisme",
    "Marketing",
    "Communication",
    "Production",
    "Événementiel",
    "Art",
    "Culture",
    "Sport",
    "Éducation",
    "Technologie",
    "Autre"
  ]

  // Calculer les statistiques de l'utilisateur
  const userVotes = votes.filter(vote => vote.userId === user.id)
  const voteCount = userVotes.length
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const membershipDuration = Math.floor((Date.now() - new Date(user.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))

  const handleSave = async () => {
    if (!onUpdate) {
      setMessage({ type: "error", text: "Fonction de mise à jour non disponible" })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    try {
      // Simuler la mise à jour (remplacer par votre vraie logique d'API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpdate(editedUser)
      setIsEditing(false)
      setMessage({ type: "success", text: "Profil mis à jour avec succès" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du profil" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handlePasswordChange = async () => {
    try {
      setMessage(null)
      
      // Vérifier l'ancien mot de passe si un nouveau mot de passe est fourni
      if (newPassword) {
        if (!oldPassword) {
          setMessage({ type: "error", text: "Veuillez saisir votre ancien mot de passe" })
          return
        }
        
        // Vérifier l'ancien mot de passe via l'API
        const verifyResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: user.email, 
            password: oldPassword 
          })
        })
        
        if (!verifyResponse.ok) {
          setMessage({ type: "error", text: "Ancien mot de passe incorrect" })
          return
        }
        
        // Vérifier la confirmation du nouveau mot de passe
        if (newPassword !== confirmPassword) {
          setMessage({ type: "error", text: "Les nouveaux mots de passe ne correspondent pas" })
          return
        }
        
        if (newPassword.length < 4) {
          setMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 4 caractères" })
          return
        }
      }
      
      const updateData: any = { ...editedUser }
      delete updateData.id // Supprimer l'ID dupliqué
      
      // Ajouter le mot de passe seulement s'il est fourni
      if (newPassword) {
        updateData.password = newPassword
      }
      
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...updateData })
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUpdate?.(updatedUser)
        setIsEditing(false)
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setMessage({ type: "success", text: "Profil mis à jour avec succès !" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de la mise à jour du profil" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setMessage(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-card border border-border/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-4">
            <ProfilePhotoUpload
              currentPhoto={(editedUser as any).profilePhoto}
              userId={editedUser.id}
              onPhotoUpdate={(photoUrl) => {
                setEditedUser(prev => ({ ...prev, profilePhoto: photoUrl }))
                if (onUpdate) {
                  onUpdate({ ...editedUser, profilePhoto: photoUrl } as any)
                }
              }}
              size="md"
              showUploadButton={isEditing}
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Profil Utilisateur</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user.role?.toLowerCase() === 'super_admin' ? 'Administrateur' : 'Électeur'}</span>
              </div>
            </div>
            
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Messages */}
          {message && (
            <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations Personnelles */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Informations Personnelles
              </h3>
              
              <div>
                <Label>Nom complet</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    placeholder="Votre nom complet"
                  />
                ) : (
                  <p className="text-muted-foreground">{user.name}</p>
                )}
              </div>

              <div>
                <Label>Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    placeholder="Votre email"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                )}
              </div>

              <div>
                <Label>Téléphone</Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedUser.phone || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                    placeholder="Votre numéro de téléphone"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {user.phone || 'Non renseigné'}
                  </div>
                )}
              </div>
            </div>

            {/* Localisation */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localisation
              </h3>
              
              <div>
                <Label>Domaine</Label>
                {isEditing ? (
                  <select
                    value={editedUser.domain || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, domain: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border/50 bg-background"
                  >
                    <option value="">Sélectionnez un domaine</option>
                    {domainOptions.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-muted-foreground">{user.domain || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <Label>Ville</Label>
                {isEditing ? (
                  <Input
                    value={editedUser.city || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, city: e.target.value })}
                    placeholder="Votre ville"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {user.city || 'Non renseignée'}
                  </div>
                )}
              </div>

              <div>
                <Label>Mot de passe</Label>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Ancien mot de passe (requis pour changer)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nouveau mot de passe (optionnel)"
                      />
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmer le nouveau mot de passe"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Laissez les champs de nouveau mot de passe vides pour ne pas le modifier
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">••••••••</p>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Statistiques et Activité
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <CheckCircle className="w-4 h-4" />
                  Votes exprimés
                </div>
                <p className="text-2xl font-bold">{voteCount}</p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  Date d'inscription
                </div>
                <p className="text-sm font-medium">{joinDate}</p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <UserIcon className="w-4 h-4" />
                  Ancienneté
                </div>
                <p className="text-sm font-medium">{membershipDuration} jours</p>
              </div>
            </div>

            {voteCount > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Historique des votes</h4>
                <div className="space-y-2">
                  {userVotes.map((vote, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded-lg text-sm">
                      <span className="text-muted-foreground">Vote pour {vote.candidateName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(vote.timestamp).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-border/50 flex gap-2">
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
