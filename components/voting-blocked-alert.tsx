"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Lock, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  X,
  Bell,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VotingBlockedAlertProps {
  blockMessage?: string
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export function VotingBlockedAlert({ 
  blockMessage = "Les votes sont actuellement fermés. Ils seront ouverts le jour de l'événement.",
  onRetry,
  showRetry = false,
  className = ""
}: VotingBlockedAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [timeUntilOpen, setTimeUntilOpen] = useState<string>("")

  // Calculer le temps restant (simulation)
  useEffect(() => {
    const calculateTimeUntil = () => {
      // Simuler une date d'ouverture (remplacer par la vraie date de votre événement)
      const openingDate = new Date()
      openingDate.setHours(18, 0, 0, 0) // 18:00 aujourd'hui
      openingDate.setDate(openingDate.getDate() + 1) // Demain
      
      const now = new Date()
      const diff = openingDate.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeUntilOpen("Bientôt disponible...")
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        setTimeUntilOpen(`${days}j ${hours}h ${minutes}min`)
      } else if (hours > 0) {
        setTimeUntilOpen(`${hours}h ${minutes}min`)
      } else {
        setTimeUntilOpen(`${minutes} minutes`)
      }
    }

    calculateTimeUntil()
    const interval = setInterval(calculateTimeUntil, 60000) // Toutes les minutes
    
    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}
      >
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-800 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icônes animées */}
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <Lock className="w-5 h-5 text-white" />
                </motion.div>
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Votes Bloqués
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-800 dark:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                
                <p className="text-sm text-red-700 dark:text-red-300 mb-3 leading-relaxed">
                  {blockMessage}
                </p>

                {/* Compte à rebours */}
                {timeUntilOpen && (
                  <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="font-medium text-red-800 dark:text-red-200">
                        Ouverture dans : {timeUntilOpen}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {showRetry && onRetry && (
                    <Button
                      size="sm"
                      onClick={onRetry}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Réessayer
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsVisible(false)}
                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/20"
                  >
                    Compris
                  </Button>
                </div>

                {/* Info supplémentaire */}
                <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                    <Info className="w-3 h-3" />
                    <span>
                      Vous serez notifié automatiquement lorsque les votes seront ouverts
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Version compacte pour les espaces restreints
export function VotingBlockedAlertCompact({ 
  blockMessage,
  className = ""
}: Omit<VotingBlockedAlertProps, 'onRetry' | 'showRetry'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <Lock className="w-4 h-4 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <p className="font-medium text-red-800 dark:text-red-200 text-sm">
            Votes temporairement indisponibles
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {blockMessage}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
