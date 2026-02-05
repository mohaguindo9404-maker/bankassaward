"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Info, X, Phone, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlatformAlertProps {
  type: "warning" | "info" | "error" | "success"
  title: string
  message: string
  showContact?: boolean
  contactPhone?: string
  endDate?: string
  autoHide?: boolean
  duration?: number
}

export function PlatformAlert({
  type,
  title,
  message,
  showContact = false,
  contactPhone = "",
  endDate = "",
  autoHide = false,
  duration = 8000
}: PlatformAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoHide, duration])

  if (!isVisible) return null

  const getAlertStyles = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
          border: "border-amber-200 dark:border-amber-800",
          icon: "text-amber-600 dark:text-amber-400",
          title: "text-amber-800 dark:text-amber-200",
          message: "text-amber-700 dark:text-amber-300",
          button: "bg-amber-500 hover:bg-amber-600 text-white"
        }
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          title: "text-red-800 dark:text-red-200",
          message: "text-red-700 dark:text-red-300",
          button: "bg-red-500 hover:bg-red-600 text-white"
        }
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
          border: "border-green-200 dark:border-green-800",
          icon: "text-green-600 dark:text-green-400",
          title: "text-green-800 dark:text-green-200",
          message: "text-green-700 dark:text-green-300",
          button: "bg-green-500 hover:bg-green-600 text-white"
        }
      default: // info
        return {
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-600 dark:text-blue-400",
          title: "text-blue-800 dark:text-blue-200",
          message: "text-blue-700 dark:text-blue-300",
          button: "bg-blue-500 hover:bg-blue-600 text-white"
        }
    }
  }

  const styles = getAlertStyles()
  const Icon = type === "warning" ? AlertTriangle : Info

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4`}
      >
        <div className={`${styles.bg} ${styles.border} border rounded-xl shadow-xl backdrop-blur-sm`}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-12 h-12 rounded-full ${styles.icon} bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 className={`font-bold text-lg ${styles.title}`}>
                    {title}
                  </h3>
                  {endDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>Jusqu'au {endDate}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Message principal */}
            <div className={`mb-6 ${styles.message} leading-relaxed`}>
              {message}
            </div>

            {/* Informations additionnelles */}
            {(showContact || endDate) && (
              <div className="space-y-4">
                {showContact && contactPhone && (
                  <div className={`flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 ${styles.border} border`}>
                    <Phone className={`w-5 h-5 ${styles.icon}`} />
                    <div>
                      <p className="font-medium text-foreground">Pour plus d'informations</p>
                      <p className={`font-bold ${styles.title}`}>{contactPhone}</p>
                      <p className="text-sm text-muted-foreground">(WhatsApp)</p>
                    </div>
                  </div>
                )}

                {endDate && (
                  <div className={`flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 ${styles.border} border`}>
                    <Clock className={`w-5 h-5 ${styles.icon}`} />
                    <div>
                      <p className="font-medium text-foreground">Réouverture des votes</p>
                      <p className={`font-bold ${styles.title}`}>{endDate}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setIsVisible(false)}
                className={styles.button}
              >
                J'ai compris
              </Button>
              
              {showContact && contactPhone && (
                <Button
                  variant="outline"
                  onClick={() => {
                    // Ouvrir WhatsApp
                    const whatsappUrl = `https://wa.me/${contactPhone.replace(/\D/g, '')}`
                    window.open(whatsappUrl, '_blank')
                  }}
                  className={styles.border}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Composant pour les alertes de vote bloqué
export function VotingBlockedHeaderAlert() {
  return (
    <PlatformAlert
      type="warning"
      title="⚠️ Votes Temporairement Bloqués"
      message="Les votes sont actuellement fermés pour des raisons de maintenance et de sécurité. Nous procédons actuellement à des vérifications pour garantir l'intégrité du processus de vote."
      showContact={true}
      contactPhone="70359104"
      endDate="15 février 2025"
      autoHide={false}
    />
  )
}
