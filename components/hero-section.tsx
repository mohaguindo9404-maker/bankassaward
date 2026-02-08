"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Vote, BarChart3, Sparkles, Award, ArrowRight, RefreshCw, Info, Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Page } from "@/app/page"
import type { User } from "@/hooks/use-api-data"

interface AdminMessage {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  created_at: string
}

interface HeroSectionProps {
  setCurrentPage: (page: Page) => void
  currentUser: User | null
  categories?: any[]
  votes?: any[]
  loading?: boolean
}

export function HeroSection({ setCurrentPage, currentUser, categories = [], votes = [], loading = false }: HeroSectionProps) {
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([])
  const [showMessages, setShowMessages] = useState(true)
  
  // Récupérer les messages admin
  useEffect(() => {
    const fetchAdminMessages = async () => {
      try {
        const response = await fetch('/api/admin/messages')
        if (response.ok) {
          const data = await response.json()
          // Les messages sont déjà filtrés par l'API
          setAdminMessages(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages admin:', error)
      }
    }
    
    fetchAdminMessages()
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchAdminMessages, 30000)
    return () => clearInterval(interval)
  }, [])
  
  // Calculer les statistiques réelles
  const totalCategories = categories.length
  const totalCandidates = categories.reduce((sum, cat) => sum + (cat.candidates?.length || 0), 0)
  const totalVotes = votes.length
  
  const features = [
    {
      icon: Trophy,
      title: `${totalCategories} Catégories`,
      description: "Catégories prestigieuses récompensant l'excellence dans différents domaines",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Vote,
      title: `${totalVotes} Votes`,
      description: "Système de vote sécurisé et transparent pour une élection équitable",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: Award,
      title: `${totalCandidates} Candidats`,
      description: "Mettez en lumière les talents qui façonnent notre communauté",
      gradient: "from-primary to-accent",
    },
  ]

  const stats = [
    { value: loading ? "..." : totalCategories.toString(), label: "Catégories" },
    { value: loading ? "..." : totalCandidates.toString(), label: "Candidats" },
    { value: loading ? "..." : totalVotes.toString(), label: "Votes" },
  ]

  return (
    <section className="relative min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Hero Content */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Édition 2026</span>
            </motion.div>

            {/* Messages Admin */}
            {showMessages && adminMessages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <span className="text-sm font-medium text-amber-500">
                      Messages importants ({adminMessages.length})
                    </span>
                  </div>
                  <button
                    onClick={() => setShowMessages(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 max-w-2xl mx-auto">
                  {adminMessages.slice(0, 3).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Card className={`border-l-4 ${
                        message.type === 'warning' ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' :
                        message.type === 'error' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' :
                        message.type === 'success' ? 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' :
                        'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              message.type === 'warning' ? 'bg-amber-500' :
                              message.type === 'error' ? 'bg-red-500' :
                              message.type === 'success' ? 'bg-emerald-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm mb-1">{message.title}</h4>
                              <p className="text-sm text-muted-foreground">{message.message}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                  {adminMessages.length > 3 && (
                    <p className="text-center text-sm text-muted-foreground">
                      +{adminMessages.length - 3} autres messages...
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Célébrez l'excellence et récompensez les talents exceptionnels de notre communauté. Votez pour vos favoris
              et participez à cet événement unique.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={() => setCurrentPage(currentUser ? "vote" : "auth")}
                className="group bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-xl shadow-primary/25 px-8 h-14 text-lg"
              >
                <Vote className="w-5 h-5 mr-2" />
                Commencer à voter
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentPage("results")}
                className="h-14 px-8 text-lg border-2 hover:bg-muted"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Voir les résultats
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Indicateur de synchronisation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 mb-8 text-sm text-muted-foreground"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4" />
              </motion.div>
              <span>Données synchronisées en temps réel</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pourquoi participer ?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez ce qui fait des BANKASS AWARDS un événement unique
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10" />
    </section>
  )
}
