"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Check, ChevronDown, Vote as VoteIcon, Sparkles, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useVotingConfig } from "@/hooks/use-api-data"
import { VotingBlockedModal } from "@/components/voting-blocked-modal"
import { CandidateDetailModal } from "@/components/candidate-detail-modal"
import type { Category, Candidate } from "@/lib/categories"
import type { User, Vote } from "@/hooks/use-api-data"
import { useVotes } from "@/hooks/use-api-data"

import type { Page } from "@/app/page"

interface VoteSectionProps {
  currentUser: User | null
  setCurrentPage: (page: Page) => void
  categories: Category[]
  votingStatus?: {
    isVotingOpen: boolean
    blockMessage?: string
    lastChecked: number
  }
}

export function VoteSection({
  currentUser,
  setCurrentPage,
  categories,
  votingStatus,
}: VoteSectionProps) {
  const { votes, refetch: refetchVotes } = useVotes()
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, { id: string; name: string }>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [votingBlocked, setVotingBlocked] = useState(false)
  const [blockMessage, setBlockMessage] = useState("")
  const [selectedProfile, setSelectedProfile] = useState<{ candidate: Candidate; categoryId: string } | null>(null)
  const [showBlockedModal, setShowBlockedModal] = useState(false)
  const [showVoteConfirmation, setShowVoteConfirmation] = useState<{ categoryId: string; candidate: { id: string; name: string } } | null>(null)

  if (!currentUser) {
    return (
      <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Connexion requise</h2>
          <p className="text-muted-foreground mb-6">
            Vous devez être connecté pour voter. Créez un compte ou connectez-vous pour participer.
          </p>
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

  const hasUserVotedInCategory = (categoryId: string) => {
    return votes.some((v) => v.userId === currentUser.id && v.categoryId === categoryId)
  }

  const getUserVoteInCategory = (categoryId: string) => {
    return votes.find((v) => v.userId === currentUser.id && v.categoryId === categoryId)
  }

  const handleVote = async (categoryId: string, candidate?: { id: string; name: string }) => {
    const finalCandidate = candidate || selectedCandidates[categoryId]

    if (!finalCandidate) {
      alert("Veuillez d'abord sélectionner un candidat")
      return
    }

    // Vérifier si l'utilisateur est connecté
    if (!currentUser || !currentUser.id) {
      alert("❌ Vous devez être connecté pour voter")
      return
    }

    // Vérifier si l'ID utilisateur est valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(currentUser.id)) {
      console.error('❌ ID utilisateur invalide:', currentUser.id)
      alert("❌ Erreur d'authentification. Veuillez vous reconnecter.")
      return
    }

    // Vérifier si les votes sont bloqués
    if (votingBlocked) {
      setShowBlockedModal(true)
      return
    }

    if (hasUserVotedInCategory(categoryId)) {
      alert("❌ Vote déjà confirmé !\n\nVous avez déjà voté dans cette catégorie. Il est impossible de voter plusieurs fois dans la même catégorie.")
      return
    }

    // Afficher le modal de confirmation au lieu de voter directement
    setShowVoteConfirmation({ categoryId, candidate: finalCandidate })
  }

  const confirmVote = async () => {
    if (!showVoteConfirmation || !currentUser) return

    const { categoryId, candidate } = showVoteConfirmation

    try {
      const voteData = {
        userId: currentUser.id,
        categoryId,
        candidateId: candidate.id,
        candidateName: candidate.name,
      }

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voteData)
      })

      if (response.ok) {
        // Recharger les votes pour voir le nouveau vote
        await refetchVotes()
        setShowConfirmation(true)
        setShowVoteConfirmation(null)
        setTimeout(() => {
          setShowConfirmation(false)
          // Rediriger vers les résultats après le vote
          setCurrentPage("results")
        }, 1500)
      } else {
        const error = await response.json()
        console.error("Erreur lors du vote:", error)
        // Afficher un message d'erreur à l'utilisateur
        alert(error.error || "Erreur lors du vote")
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error)
      alert("Erreur de connexion. Veuillez réessayer.")
    }
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  // Utiliser le statut persistant des votes - LOGIQUE CORRECTE
  useEffect(() => {
    if (votingStatus) {
      const isBlocked = !votingStatus.isVotingOpen
      const message = votingStatus.blockMessage || ""
      
      // Logique simple : si les votes sont fermés, afficher le modal de blocage
      const shouldBlock = Boolean(isBlocked)
      
      setVotingBlocked(shouldBlock)
      setBlockMessage(votingStatus.blockMessage || "")
    }
  }, [votingStatus?.isVotingOpen, votingStatus?.blockMessage])

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Votez pour vos favoris
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Sélectionnez un candidat par catégorie. Cliquez sur un candidat pour voir sa biographie détaillée.
          </p>
        </motion.div>

        <div className="space-y-6">
          {categories.filter(c => !c.isLeadershipPrize).map((category, index) => {
            const hasVoted = hasUserVotedInCategory(category.id)
            const userVote = getUserVoteInCategory(category.id)
            const isExpanded = expandedCategories[category.id] ?? !hasVoted
            const isLeadershipPrize = category.isLeadershipPrize

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card border rounded-2xl overflow-hidden shadow-lg ${
                  isLeadershipPrize
                    ? "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-600/5"
                    : "border-border/50"
                }`}
              >
                {/* Category Header */}
                <button
                  onClick={() => !isLeadershipPrize && toggleCategory(category.id)}
                  className={`w-full p-4 sm:p-6 flex items-center justify-between ${
                    isLeadershipPrize ? "cursor-default" : "cursor-pointer hover:bg-muted/50"
                  } transition-colors`}
                  disabled={isLeadershipPrize}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        hasVoted
                          ? "bg-emerald-500/10 text-emerald-500"
                          : isLeadershipPrize
                            ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white"
                            : "bg-primary/10 text-primary"
                      }`}
                    >
                      {hasVoted ? (
                        <Check className="w-6 h-6" />
                      ) : isLeadershipPrize ? (
                        <Sparkles className="w-6 h-6" />
                      ) : (
                        <Trophy className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg sm:text-xl font-semibold">{category.name}</h3>
                      {category.subtitle && <p className="text-sm text-muted-foreground">{category.subtitle}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {hasVoted && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Vote confirmé
                      </span>
                    )}
                    {isLeadershipPrize && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium">
                        Prix hommage
                      </span>
                    )}
                    {!isLeadershipPrize && (
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    )}
                  </div>
                </button>

                {/* Candidates Grid */}
                <AnimatePresence>
                  {isExpanded && !isLeadershipPrize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 pt-0 border-t border-border/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          {category.candidates.map((candidate) => {
                            const isSelected = selectedCandidates[category.id]?.id === candidate.id
                            const isVotedFor = userVote?.candidateName === candidate.name

                            return (
                              <motion.div
                                key={candidate.id}
                                className={`relative rounded-xl border-2 transition-all overflow-hidden ${
                                  isVotedFor
                                    ? "border-emerald-500 bg-emerald-500/10"
                                    : isSelected
                                      ? "border-primary bg-primary/10"
                                      : "border-border/50 hover:border-primary/50 bg-background"
                                } ${hasVoted ? "cursor-default" : "cursor-pointer"}`}
                                whileHover={!hasVoted ? { scale: 1.02 } : {}}
                                whileTap={!hasVoted ? { scale: 0.98 } : {}}
                              >
                                {/* Candidate Image */}
                                <div
                                  className="relative aspect-square overflow-hidden"
                                  onClick={() => {
                                    // Ouvrir le modal de détail du candidat
                                    setSelectedProfile({ candidate, categoryId: category.id })
                                  }}
                                >
                                  <img
                                    src={candidate.image || "/uploads/candidates/default-avatar.png"}
                                    alt={candidate.name}
                                    className="w-full h-full object-cover transition-transform hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    <p className="font-semibold text-white text-sm line-clamp-2">{candidate.name}</p>
                                  </div>
                                  {/* Vote button indicator */}
                                  <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs backdrop-blur-sm">
                                      Voir profil
                                    </span>
                                  </div>
                                </div>

                                {/* Vote button for this candidate */}
                                <div className="p-3 space-y-2">
                                  {/* Audio Preview */}
                                  {candidate.audioFile && (
                                    <div className="bg-muted rounded-lg p-3 text-center">
                                      <p className="text-sm font-medium">Audio disponible</p>
                                      <p className="text-xs text-muted-foreground">{candidate.candidateSong}</p>
                                    </div>
                                  )}
                                  <Button
                                    type="button"
                                    variant={isSelected ? "default" : "outline"}
                                    className={`w-full ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedCandidates((prev) => ({
                                        ...prev,
                                        [category.id]: { id: candidate.id, name: candidate.name },
                                      }))
                                    }}
                                    disabled={hasVoted}
                                  >
                                    {isVotedFor ? (
                                      <span className="flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Voté
                                      </span>
                                    ) : isSelected ? (
                                      <span className="flex items-center gap-2">
                                        <Check className="w-4 h-4" />
                                        Sélectionné
                                      </span>
                                    ) : (
                                      "Sélectionner"
                                    )}
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>

                        {!hasVoted && selectedCandidates[category.id] && (
                          <Button
                            onClick={() => handleVote(category.id, selectedCandidates[category.id])}
                            className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                          >
                            <VoteIcon className="w-4 h-4 mr-2" />
                            Confirmer le vote pour {selectedCandidates[category.id].name}
                          </Button>
                        )}

                        {/* Message pour vote déjà effectué */}
                        {hasVoted && userVote && (
                          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <div className="flex items-center gap-3 text-emerald-500">
                              <Check className="w-5 h-5" />
                              <div>
                                <p className="font-medium">Vote déjà confirmé</p>
                                <p className="text-sm opacity-90">
                                  Vous avez voté pour <span className="font-semibold">{userVote.candidateName}</span>
                                </p>
                                <p className="text-xs opacity-75 mt-1">
                                  Il est impossible de modifier votre vote ou de voter à nouveau dans cette catégorie.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Vote Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border/50 rounded-2xl p-8 text-center max-w-sm shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Vote enregistré !</h3>
              <p className="text-muted-foreground">Votre choix a été sauvegardé avec succès.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Candidate Profile Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <CandidateDetailModal
            candidate={selectedProfile.candidate}
            category={categories.find(c => c.id === selectedProfile.categoryId) || categories[0]}
            onClose={() => setSelectedProfile(null)}
            votingStatus={votingStatus}
            onVote={handleVote}
            hasUserVotedInCategory={hasUserVotedInCategory}
          />
        )}
      </AnimatePresence>
      
      {/* Modal de blocage des votes */}
      <VotingBlockedModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        message={blockMessage}
        contactPhone="75359104 (WhatsApp)"
        type="blocked"
      />

      {/* Modal de confirmation de vote */}
      <AnimatePresence>
        {showVoteConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowVoteConfirmation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="bg-card border border-border/50 rounded-2xl p-8 text-center max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                <VoteIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Confirmer votre vote</h3>
              <p className="text-muted-foreground mb-6">
                Êtes-vous sûr de vouloir voter pour <strong>{showVoteConfirmation.candidate.name}</strong> ?
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowVoteConfirmation(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={confirmVote}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
