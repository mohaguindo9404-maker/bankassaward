"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, BarChart3, Sparkles, Crown, Lock, Heart, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Vote } from "@/hooks/use-api-data"
import type { Category } from "@/lib/categories"

interface ResultsSectionProps {
  votes: Vote[]
  categories: Category[]
  isSuperAdmin: boolean
}

export function ResultsSection({
  votes,
  categories,
  isSuperAdmin,
}: ResultsSectionProps) {

  const getResultsForCategory = (categoryId: string) => {
    const categoryVotes = votes.filter((v) => v.categoryId === categoryId)
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return []

    const voteCounts: Record<string, number> = {}
    category.candidates.forEach((candidate) => {
      voteCounts[candidate.name] = 0
    })

    categoryVotes.forEach((vote) => {
      if (voteCounts[vote.candidateName] !== undefined) {
        voteCounts[vote.candidateName]++
      }
    })

    const totalVotes = categoryVotes.length

    return Object.entries(voteCounts)
      .map(([name, count]) => {
        const candidate = category.candidates.find((c) => c.name === name)
        return {
          name,
          votes: count,
          percentage: totalVotes > 0 ? (count / totalVotes) * 100 : 0,
          image: candidate?.image || "",
        }
      })
      .sort((a, b) => b.votes - a.votes)
  }

  const totalVotes = votes.length
  const uniqueVoters = new Set(votes.map((v) => v.userId)).size

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Résultats des votes
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Classement par catégorie - Mise à jour en temps réel
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{totalVotes}</div>
              <div className="text-sm text-muted-foreground">Votes totaux</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{uniqueVoters}</div>
              <div className="text-sm text-muted-foreground">Participants</div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {categories
            .filter((c) => !c.isLeadershipPrize)
            .map((category, index) => {
              const results = getResultsForCategory(category.id)
              const totalCategoryVotes = results.reduce((sum, r) => sum + r.votes, 0)

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border/50 rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{totalCategoryVotes} votes</p>
                    </div>
                  </div>

                  {results.length > 0 && totalCategoryVotes > 0 ? (
                    <div className="space-y-4">
                      {results.map((result, idx) => (
                        <motion.div
                          key={result.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {result.image && (
                                <img
                                  src={result.image || "/placeholder.svg"}
                                  alt={result.name}
                                  className="w-8 h-8 rounded-full object-cover border-2 border-border"
                                />
                              )}
                              {idx === 0 && totalCategoryVotes > 0 && <Crown className="w-5 h-5 text-primary" />}
                              <span className="font-medium">{result.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-primary">
                              {result.votes} votes ({result.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${result.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                              className={`h-full rounded-full ${
                                idx === 0 ? "bg-gradient-to-r from-primary to-accent" : "bg-muted-foreground/30"
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun vote pour le moment</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
