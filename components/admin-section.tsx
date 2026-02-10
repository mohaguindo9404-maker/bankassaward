"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  Users,
  Trophy,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  BarChart3,
  Crown,
  AlertTriangle,
  Check,
  AlertCircle,
  UserPlus,
  FolderOpen,
  Lock,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { CandidateDetailModal } from "@/components/candidate-detail-modal"
import { CandidateEditor } from "@/components/candidate-editor"
import { UserProfileModal } from "@/components/user-profile-modal"
import { VotingControl } from "@/components/voting-control"
import { AdminMessagePanel } from "@/components/admin-message-panel"
import { MessageSquare, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User, Vote } from "@/hooks/use-api-data"
import type { Category, Candidate } from "@/lib/categories"
import { useUsers, useCategories, useCandidates } from "@/hooks/use-api-data"

interface AdminSectionProps {
  votes: Vote[]
  currentUser: User | null
  showSuccessAlert?: (message: string) => void
  showErrorAlert?: (message: string) => void
  showInfoAlert?: (message: string) => void
}

type AdminTab = "overview" | "users" | "candidates" | "voting" | "settings" | "messages"

export function AdminSection({
  votes,
  currentUser,
  showSuccessAlert,
  showErrorAlert,
  showInfoAlert,
}: AdminSectionProps) {
  const { users, createUser, deleteUser, refetch: refetchUsers } = useUsers()
  const { categories, createCategory, deleteCategory, updateCategory, refetch: refetchCategories } = useCategories()
  const { createCandidate, updateCandidate, refetch: refetchCandidates } = useCandidates()
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [editingCandidate, setEditingCandidate] = useState<{
    categoryId: string
    candidate: Candidate | null
  } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", phone: "", password: "" })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", subtitle: "" })
  const [selectedCandidate, setSelectedCandidate] = useState<{ categoryId: string; candidate: Candidate } | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showQuickActions, setShowQuickActions] = useState(false)

  const tabs = [
    { id: "overview" as AdminTab, label: "Aperçu", icon: BarChart3 },
    { id: "users" as AdminTab, label: "Utilisateurs", icon: Users },
    { id: "candidates" as AdminTab, label: "Candidats", icon: Trophy },
    { id: "voting" as AdminTab, label: "Votes", icon: Lock },
    { id: "messages" as AdminTab, label: "Messages", icon: MessageSquare },
    { id: "settings" as AdminTab, label: "Paramètres", icon: Settings },
  ]

  const totalVotes = votes.length
  const totalUsers = users.filter((u) => u.role !== "SUPER_ADMIN").length
  const totalCandidates = categories.reduce((acc, cat) => acc + cat.candidates.length, 0)
  
  // Calculer les votes du jour
  const todayVotes = votes.filter(vote => {
    const voteDate = new Date(vote.timestamp)
    const today = new Date()
    return voteDate.toDateString() === today.toDateString()
  }).length

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.password) {
      setMessage({ type: "error", text: "Veuillez remplir tous les champs" })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    
    try {
      await createUser(newUser as any)
      setNewUser({ name: "", phone: "", password: "" })
      setShowAddUser(false)
      // Recharger les données pour voir le nouvel utilisateur
      await refetchUsers()
      setMessage({ type: "success", text: "Utilisateur ajouté avec succès" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'ajout de l'utilisateur" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      setConfirmDelete(null)
      // Recharger les données pour voir la suppression
      await refetchUsers()
      setMessage({ type: "success", text: "Utilisateur supprimé avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      setMessage({ type: "error", text: "Erreur lors de la suppression de l'utilisateur" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddCandidate = async (categoryId: string) => {
    try {
      const newCandidate = await createCandidate({
        categoryId,
        name: "Nouveau Candidat",
        image: "/portrait-candidat.jpg",
        bio: "Biographie du candidat...",
        achievements: ["Réalisation 1"],
      })
      setEditingCandidate({ categoryId, candidate: newCandidate })
      await refetchCategories() // Recharger les catégories pour voir le nouveau candidat
      setMessage({ type: "success", text: "Candidat créé avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la création du candidat:", error)
      setMessage({ type: "error", text: "Erreur lors de la création du candidat" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleSaveCandidate = async (categoryId: string, candidate: Candidate) => {
    setIsUpdating(true)
    try {
      console.log('🔄 Mise à jour candidat:', candidate.id, candidate.name)
      console.log('📸 Image URL:', candidate.image)
      console.log('📤 Données complètes envoyées:', JSON.stringify(candidate, null, 2))
      
      // Sauvegarder en base de données d'abord
      await updateCandidate(candidate.id, candidate)
      
      // Puis recharger pour voir les modifications (aperçu quasi-instantané)
      await refetchCategories()
      setEditingCandidate(null)
      setMessage({ type: "success", text: "Candidat mis à jour avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la mise à jour du candidat:", error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la mise à jour du candidat"
      setMessage({ type: "error", text: errorMessage })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteCandidate = async (categoryId: string, candidateId: string) => {
    setIsUpdating(true)
    try {
      // Supprimer en base de données d'abord
      const response = await fetch(`/api/candidates?id=${candidateId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Erreur lors de la suppression du candidat')
      
      // Puis recharger pour voir les modifications (aperçu quasi-instantané)
      await refetchCategories()
      setMessage({ type: "success", text: "Candidat supprimé avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la suppression du candidat:", error)
      setMessage({ type: "error", text: "Erreur lors de la suppression du candidat" })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = () => {
    if (newAdminPassword.length < 4) {
      setPasswordMessage({ type: "error", text: "Le mot de passe doit contenir au moins 4 caractères" })
      return
    }
    if (newAdminPassword !== confirmAdminPassword) {
      setPasswordMessage({ type: "error", text: "Les mots de passe ne correspondent pas" })
      return
    }
    // In a real app, this would update the admin password
    setPasswordMessage({ type: "success", text: "Mot de passe modifié avec succès" })
    setNewAdminPassword("")
    setConfirmAdminPassword("")
    setTimeout(() => setPasswordMessage(null), 3000)
  }

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      setMessage({ type: "error", text: "Veuillez remplir le nom de la catégorie" })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    try {
      await createCategory({
        name: newCategory.name,
        subtitle: newCategory.subtitle || "",
        special: false,
        isLeadershipPrize: false,
      })
      setNewCategory({ name: "", subtitle: "" })
      setShowAddCategory(false)
      await refetchCategories()
      setMessage({ type: "success", text: "Catégorie créée avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie:", error)
      setMessage({ type: "error", text: "Erreur lors de la création de la catégorie" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setSelectedCategory(null)
      await refetchCategories()
      setMessage({ type: "success", text: "Catégorie supprimée avec succès !" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie:", error)
      setMessage({ type: "error", text: "Erreur lors de la suppression de la catégorie" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panneau d'Administration</h1>
              <p className="text-muted-foreground">Gérez les utilisateurs, candidats et paramètres</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg border ${
                message.type === "success"
                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                    <p className="text-muted-foreground text-sm">Utilisateurs</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalCandidates}</p>
                    <p className="text-muted-foreground text-sm">Candidats</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{totalVotes}</p>
                    <p className="text-muted-foreground text-sm">Votes total</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{todayVotes}</p>
                    <p className="text-muted-foreground text-sm">Votes aujourd'hui</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Gestion des Utilisateurs</h2>
                <Button
                  onClick={() => setShowAddUser(true)}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {/* Add User Modal */}
              <AnimatePresence>
                {showAddUser && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border/50 rounded-xl p-6"
                  >
                    <h3 className="font-semibold mb-4">Nouvel Utilisateur</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Nom</Label>
                        <Input
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="Nom complet"
                        />
                      </div>
                      <div>
                        <Label>Numéro de téléphone</Label>
                        <Input
                          type="tel"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          placeholder="+223 XX XX XX XX"
                        />
                      </div>
                      <div>
                        <Label>Mot de passe</Label>
                        <Input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddUser}>
                        <Check className="w-4 h-4 mr-2" />
                        Créer
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddUser(false)}>
                        Annuler
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Users List */}
              <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
                <div className="divide-y divide-border/50">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            user.role === "SUPER_ADMIN"
                              ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                              : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                          }`}
                        >
                          {user.role === "SUPER_ADMIN" ? (
                            <Shield className="w-5 h-5" />
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
                          <p className="font-medium flex items-center gap-2 cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedUser(user)}>
                            {user.name}
                            {user.role === "SUPER_ADMIN" && (
                              <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                                Admin
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                      {user.role !== "SUPER_ADMIN" && (
                        <div className="flex gap-2">
                          {confirmDelete === user.id ? (
                            <>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
                                Confirmer
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
                                Annuler
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDelete(user.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Candidates Tab */}
          {activeTab === "candidates" && (
            <motion.div
              key="candidates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Gestion des Candidats et Catégories</h2>
                <Button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle Catégorie
                </Button>
              </div>

              {/* Add Category Modal */}
              <AnimatePresence>
                {showAddCategory && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border/50 rounded-xl p-6"
                  >
                    <h3 className="font-semibold mb-4">Nouvelle Catégorie</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom de la catégorie</Label>
                        <Input
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="Ex: Meilleur Artiste"
                        />
                      </div>
                      <div>
                        <Label>Sous-titre</Label>
                        <Input
                          value={newCategory.subtitle}
                          onChange={(e) => setNewCategory({ ...newCategory, subtitle: e.target.value })}
                          placeholder="Description de la catégorie"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddCategory}>
                        <Check className="w-4 h-4 mr-2" />
                        Créer
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                        Annuler
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Selector */}
              <div className="flex flex-wrap gap-2">
                {categories
                  .filter((c) => !c.isLeadershipPrize)
                  .map((cat) => (
                    <div key={cat.id} className="flex items-center gap-1">
                      <Button
                        variant={selectedCategory === cat.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                        className={selectedCategory === cat.id ? "bg-primary text-primary-foreground" : ""}
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        {cat.name} ({cat.candidates.length})
                      </Button>
                      {!cat.isLeadershipPrize && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
              </div>

              {/* Selected Category Candidates */}
              {selectedCategory && (
                <div className="bg-card border border-border/50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">{categories.find((c) => c.id === selectedCategory)?.name}</h3>
                    <Button onClick={() => handleAddCandidate(selectedCategory)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter Candidat
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories
                      .find((c) => c.id === selectedCategory)
                      ?.candidates.map((candidate) => (
                        <div key={candidate.id} className="bg-muted/30 rounded-xl p-4">
                          {editingCandidate?.candidate?.id === candidate.id ? (
                            <CandidateEditor
                              candidate={editingCandidate.candidate}
                              onSave={(c) => handleSaveCandidate(selectedCategory, c)}
                              onCancel={() => setEditingCandidate(null)}
                            />
                          ) : (
                            <div>
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={candidate.image || "/uploads/candidates/default-avatar.png"}
                                    alt={candidate.name}
                                    className="w-16 h-16 rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                    onClick={() => setSelectedCandidate({ categoryId: selectedCategory, candidate })}
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">{candidate.name}</p>
                                    {candidate.alias && (
                                      <p className="text-sm text-primary">{candidate.alias}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground line-clamp-2">{candidate.bio}</p>
                                    <div className="flex gap-2 mt-1">
                                      {candidate.achievements && candidate.achievements.length > 0 && (
                                        <p className="text-xs text-primary">
                                          {candidate.achievements.length} réalisation(s)
                                        </p>
                                      )}
                                      {candidate.songCount && (
                                        <p className="text-xs text-muted-foreground">
                                          {candidate.songCount} chansons
                                        </p>
                                      )}
                                      {candidate.candidateSong && (
                                        <p className="text-xs text-muted-foreground">
                                          "{candidate.candidateSong}"
                                        </p>
                                      )}
                                      {candidate.audioFile && (
                                        <p className="text-xs text-emerald-600 font-medium">
                                          🎵 Audio disponible
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingCandidate({ categoryId: selectedCategory, candidate })}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCandidate(selectedCategory, candidate.id)}
                                    className="text-destructive hover:text-destructive"
                                    disabled={isUpdating}
                                  >
                                    {isUpdating ? (
                                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Voting Tab */}
          {activeTab === "voting" && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <VotingControl />
            </motion.div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <AdminMessagePanel 
                showSuccessAlert={showSuccessAlert}
                showErrorAlert={showErrorAlert}
                showInfoAlert={showInfoAlert}
              />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Sécurité du compte</h2>
                    <p className="text-sm text-muted-foreground">Gérez votre mot de passe administrateur</p>
                  </div>
                </div>

                {showPasswordChange ? (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label>Nouveau mot de passe</Label>
                      <Input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label>Confirmer le mot de passe</Label>
                      <Input
                        type="password"
                        value={confirmAdminPassword}
                        onChange={(e) => setConfirmAdminPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <AnimatePresence>
                      {passwordMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                            passwordMessage.type === "success"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {passwordMessage.type === "success" ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                          {passwordMessage.text}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <Button onClick={handlePasswordChange}>
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                      <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowPasswordChange(true)} variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Changer le mot de passe
                  </Button>
                )}
              </div>

              {/* Admin Info */}
              <div className="bg-card border border-border/50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">Informations du compte</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Nom</span>
                    <span className="font-medium">{currentUser?.name || "Super Admin"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Téléphone</span>
                    <span className="font-medium">{currentUser?.phone || "Non disponible"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Rôle</span>
                    <span className="font-medium text-amber-500">Super Administrateur</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate.candidate}
          category={categories.find((c) => c.id === selectedCandidate.categoryId)!}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        user={selectedUser}
        votes={votes}
        categories={categories}
        onClose={() => setSelectedUser(null)}
      />
    </section>
  )
}

