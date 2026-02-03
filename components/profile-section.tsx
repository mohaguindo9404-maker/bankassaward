"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserIcon,
  MapPin,
  Phone,
  Briefcase,
  Calendar,
  Trophy,
  Vote,
  ArrowRight,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Page, User, Vote as VoteType } from "@/app/page"
import type { Category } from "@/lib/categories"

interface ProfileSectionProps {
  currentUser: User | null
  votes: VoteType[]
  setCurrentPage: (page: Page) => void
  categories: Category[]
  users: User[]
  setUsers: (users: User[]) => void
}

export function ProfileSection({
  currentUser,
  votes,
  setCurrentPage,
  categories,
  users,
  setUsers,
}: ProfileSectionProps) {
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  if (!currentUser) {
    return (
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <UserIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Connexion requise</h2>
          <p className="text-muted-foreground mb-6">Connectez-vous pour voir votre profil et vos votes.</p>
          <Button
            onClick={() => setCurrentPage("auth")}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
          >
            Se connecter
          </Button>
        </motion.div>
      </section>
    )
  }

  const userVotes = votes.filter((v) => v.userId === currentUser.id)
  const votedCategories = userVotes.length
  const totalCategories = categories.filter((c) => !c.isLeadershipPrize).length
  const isSuperAdmin = currentUser.role === "super_admin"

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handlePasswordChange = () => {
    setPasswordMessage(null)

    // Validate current password
    const userWithPassword = users.find((u) => u.id === currentUser.id) as User & { password?: string }
    if (userWithPassword?.password && userWithPassword.password !== currentPassword) {
      setPasswordMessage({ type: "error", text: "Mot de passe actuel incorrect" })
      return
    }

    if (newPassword.length < 4) {
      setPasswordMessage({ type: "error", text: "Le nouveau mot de passe doit contenir au moins 4 caractères" })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Les mots de passe ne correspondent pas" })
      return
    }

    // Update password
    const updatedUsers = users.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u))
    setUsers(updatedUsers)

    setPasswordMessage({ type: "success", text: "Mot de passe modifié avec succès" })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      setPasswordMessage(null)
      setShowPasswordChange(false)
    }, 2000)
  }

  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div
            className={`relative h-32 sm:h-40 ${isSuperAdmin ? "bg-gradient-to-r from-amber-500 to-orange-600" : "bg-gradient-to-r from-primary to-accent"}`}
          >
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold border-4 border-background shadow-xl ${
                  isSuperAdmin
                    ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                    : "bg-gradient-to-br from-primary to-accent text-primary-foreground"
                }`}
              >
                {isSuperAdmin ? <Shield className="w-10 h-10" /> : getInitials(currentUser.name)}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  {currentUser.name}
                  {isSuperAdmin && (
                    <span className="text-sm bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full">Super Admin</span>
                  )}
                </h1>
                <p className="text-muted-foreground">{currentUser.email}</p>
              </div>
              {!isSuperAdmin && (
                <div className="flex gap-3">
                  <div className="text-center px-4 py-2 rounded-xl bg-primary/10">
                    <div className="text-xl font-bold text-primary">{votedCategories}</div>
                    <div className="text-xs text-muted-foreground">Votes</div>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-muted">
                    <div className="text-xl font-bold">{totalCategories - votedCategories}</div>
                    <div className="text-xs text-muted-foreground">Restants</div>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {currentUser.domain && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Domaine</div>
                    <div className="font-medium">{currentUser.domain}</div>
                  </div>
                </div>
              )}
              {currentUser.city && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Ville</div>
                    <div className="font-medium">{currentUser.city}</div>
                  </div>
                </div>
              )}
              {currentUser.phone && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Téléphone</div>
                    <div className="font-medium">{currentUser.phone}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Membre depuis</div>
                  <div className="font-medium">{formatDate(currentUser.createdAt)}</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  Sécurité
                </h2>
                {!showPasswordChange && (
                  <Button variant="outline" size="sm" onClick={() => setShowPasswordChange(true)}>
                    Changer le mot de passe
                  </Button>
                )}
              </div>

              <AnimatePresence>
                {showPasswordChange && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-muted/30 rounded-xl p-4 space-y-4"
                  >
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Mot de passe actuel</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Nouveau mot de passe</Label>
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirmer</Label>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
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
                            <AlertCircle className="w-4 h-4" />
                          )}
                          {passwordMessage.text}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-2">
                      <Button onClick={handlePasswordChange} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Enregistrer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowPasswordChange(false)
                          setPasswordMessage(null)
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Quick Actions */}
            {isSuperAdmin && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  Actions rapides
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => setCurrentPage("admin")}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white justify-start"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Panneau d'administration
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                  <Button onClick={() => setCurrentPage("results")} variant="outline" className="justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Voir les résultats
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>
            )}

            {/* Votes History */}
            {!isSuperAdmin && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Mes votes
                </h2>
                {userVotes.length > 0 ? (
                  <div className="space-y-3">
                    {userVotes.map((vote) => {
                      const category = categories.find((c) => c.id === vote.categoryId)
                      return (
                        <motion.div
                          key={`${vote.categoryId}-${vote.timestamp}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                        >
                          <div>
                            <div className="font-medium">{category?.name || vote.categoryId}</div>
                            <div className="text-sm text-muted-foreground">
                              Vote pour: <span className="text-primary">{vote.candidateName}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(vote.timestamp).toLocaleDateString("fr-FR")}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-xl">
                    <Vote className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore voté</p>
                    <Button
                      onClick={() => setCurrentPage("vote")}
                      className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    >
                      Voter maintenant
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
