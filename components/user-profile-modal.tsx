"use client"

import { User, Vote } from "@/hooks/use-api-data"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar,
  Shield,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  AlertTriangle
} from "lucide-react"

interface UserProfileModalProps {
  user: User | null
  votes: Vote[]
  categories?: any[]
  onClose: () => void
}

export function UserProfileModal({ user, votes, categories, onClose }: UserProfileModalProps) {
  if (!user) return null

  // Calculer les statistiques de vote de l'utilisateur
  const userVotes = votes.filter(vote => vote.userId === user.id)
  const hasVoted = userVotes.length > 0
  const votedCategories = [...new Set(userVotes.map(vote => vote.categoryId))]

  // Formater la date d'inscription
  const formatDate = (dateString: string | number) => {
    if (!dateString) return "Non spécifiée"
    try {
      // Vérifier si le timestamp est en secondes (Unix) ou en millisecondes
      const date = typeof dateString === 'number' 
        ? (dateString > 1000000000000 ? new Date(dateString) : new Date(dateString * 1000))
        : new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return "Date invalide"
    }
  }

  // Calculer l'ancienneté
  const calculateSeniority = (createdAt: string) => {
    if (!createdAt) return "Non spécifiée"
    try {
      const created = new Date(createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - created.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return "Aujourd'hui"
      if (diffDays === 1) return "Hier"
      if (diffDays < 7) return `${diffDays} jours`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? 's' : ''}`
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} mois`
      return `${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? 's' : ''}`
    } catch {
      return "Date invalide"
    }
  }

  // Détecter les comptes multiples (même email/phone)
  const detectMultipleAccounts = (currentUser: User, allUsers: User[]) => {
    const sameEmail = allUsers.filter(u => u.email === currentUser.email && u.id !== currentUser.id)
    const samePhone = currentUser.phone ? allUsers.filter(u => u.phone === currentUser.phone && u.id !== currentUser.id) : []
    return {
      hasMultipleAccounts: sameEmail.length > 0 || samePhone.length > 0,
      sameEmailCount: sameEmail.length,
      samePhoneCount: samePhone.length,
      totalRelatedAccounts: sameEmail.length + samePhone.length
    }
  }

  // Obtenir le statut du rôle
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Super Admin</Badge>
      case 'ADMIN':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Admin</Badge>
      default:
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Votant</Badge>
    }
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
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-background border border-border rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
                user.role === "SUPER_ADMIN"
                  ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                  : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
              }`}
            >
              {user.role === "SUPER_ADMIN" ? (
                <Shield className="w-8 h-8" />
              ) : (
                user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge(user.role)}
                <span className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Informations de contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email || "Non spécifié"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{user.phone || "Non spécifié"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ville</p>
                    <p className="text-sm text-muted-foreground">{user.city || "Non spécifiée"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Domaine</p>
                    <p className="text-sm text-muted-foreground">{user.domain || "Non spécifié"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de compte */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Informations du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date d'inscription</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.createdAt as string)}</p>
                  <p className="text-xs text-primary">Ancienneté : {calculateSeniority(user.createdAt || '')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Statistiques de Vote</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      {hasVoted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {hasVoted ? "A voté" : "N'a pas encore voté"}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{userVotes.length}</span> vote{userVotes.length > 1 ? 's' : ''} au total
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{votedCategories.length}</span> catégorie{votedCategories.length > 1 ? 's' : ''} différente{votedCategories.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {/* Informations détaillées supplémentaires */}
                  <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Informations détaillées :</p>
                    <div className="space-y-1">
                      {hasVoted ? (
                        <>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 text-green-500" />
                            <span className="text-muted-foreground">
                              Premier vote : {formatDate(userVotes[0]?.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 text-blue-500" />
                            <span className="text-muted-foreground">
                              Dernier vote : {formatDate(userVotes[userVotes.length - 1]?.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <BarChart3 className="w-3 h-3 text-purple-500" />
                            <span className="text-muted-foreground">
                              Participation : {votedCategories.length} catégorie{votedCategories.length > 1 ? 's' : ''} sur {votes.length > 0 ? [...new Set(votes.map(v => v.categoryId))].length : 0} disponible{votes.length > 0 && [...new Set(votes.map(v => v.categoryId))].length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs">
                          <AlertTriangle className="w-3 h-3 text-orange-500" />
                          <span className="text-muted-foreground">
                            Cet utilisateur n'a pas encore participé au vote
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyse de sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Analyse de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                  ⚠️ Détection de comptes multiples
                </p>
                <div className="space-y-1 text-xs text-orange-700 dark:text-orange-300">
                  <p>
                    • Basé sur l'analyse des emails et numéros de téléphone identiques
                  </p>
                  <p>
                    • Permet d'identifier les tentatives de vote multiple
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-1">Statut du compte</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-amber-500' : 'bg-green-500'}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {user.role === 'SUPER_ADMIN' ? 'Administrateur' : 'Utilisateur standard'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${hasVoted ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                      <span className="text-xs text-muted-foreground">
                        {hasVoted ? 'A voté' : 'N\'a pas voté'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium mb-1">Métriques d'activité</p>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Total votes</span>
                      <span className="text-xs font-medium">{userVotes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Catégories</span>
                      <span className="text-xs font-medium">{votedCategories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Ancienneté</span>
                      <span className="text-xs font-medium">{calculateSeniority(user.createdAt || '')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails des votes */}
          {hasVoted && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Détails des Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userVotes.map((vote, index) => {
                    const category = categories?.find(c => c.id === vote.categoryId)
                    return (
                      <div key={vote.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">Vote #{index + 1}</p>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {category?.name || `Catégorie ${vote.categoryId}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(vote.timestamp)}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-medium">ID Vote</p>
                          <p className="text-xs text-muted-foreground">{vote.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Résumé des votes */}
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-2">Résumé de l'activité de vote</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="text-center">
                        <p className="font-medium text-lg text-primary">{userVotes.length}</p>
                        <p className="text-muted-foreground">Total votes</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-lg text-primary">{votedCategories.length}</p>
                        <p className="text-muted-foreground">Catégories votées</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-lg text-primary">
                          {userVotes.length > 0 ? Math.round((votedCategories.length / [...new Set(votes.map(v => v.categoryId))].length) * 100) : 0}%
                        </p>
                        <p className="text-muted-foreground">Participation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border p-6 flex justify-end">
          <Button onClick={onClose}>
            Fermer
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
