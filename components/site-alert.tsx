"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle, Info, CheckCircle, AlertTriangle, XCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SiteAlert {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  duration?: number | null // en millisecondes, null pour ne pas fermer automatiquement
  action?: {
    text: string
    href: string
    external?: boolean
  }
  dismissible?: boolean // false pour ne pas pouvoir fermer
}

interface SiteAlertProps {
  alerts: SiteAlert[]
  onDismiss?: (id: string) => void
  position?: 'top' | 'bottom'
  className?: string
}

export function SiteAlert({ 
  alerts, 
  onDismiss, 
  position = 'top', 
  className = "" 
}: SiteAlertProps) {
  const [visibleAlerts, setVisibleAlerts] = useState<SiteAlert[]>([])

  useEffect(() => {
    setVisibleAlerts(alerts)
  }, [alerts])

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    visibleAlerts.forEach(alert => {
      if (alert.duration && alert.duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss(alert.id)
        }, alert.duration)
        timers.push(timer)
      }
    })

    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [visibleAlerts])

  const handleDismiss = (id: string) => {
    setVisibleAlerts(prev => prev.filter(alert => alert.id !== id))
    onDismiss?.(id)
  }

  const getIcon = (type: SiteAlert['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <XCircle className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getStyles = (type: SiteAlert['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-200'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200'
    }
  }

  const positionClasses = position === 'top' 
    ? 'fixed left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md mx-4'
    : 'fixed left-1/2 transform -translate-x-1/2 z-[9999] w-full max-w-md mx-4'

  const getDynamicPosition = (index: number) => {
    const baseOffset = position === 'top' ? 4 : 4
    const spacing = 120
    const offset = baseOffset + (index * spacing)
    return position === 'top' 
      ? `top-${Math.min(offset, 20)}`
      : `bottom-${Math.min(offset, 20)}`
  }

  return (
    <AnimatePresence mode="popLayout">
      {visibleAlerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.95 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.1,
            ease: "easeInOut"
          }}
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            [position === 'top' ? 'top' : 'bottom']: `${4 + (index * 8)}px`,
            zIndex: 9999 - index,
            width: 'calc(100% - 2rem)',
            maxWidth: '28rem'
          }}
          className={`${className}`}
        >
          <div className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getStyles(alert.type)}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1">
                  {alert.title}
                </h4>
                <p className="text-sm opacity-90 mb-2">
                  {alert.message}
                </p>
                
                {alert.action && (
                  <div className="mt-2">
                    {alert.action.external ? (
                      <a
                        href={alert.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium underline hover:no-underline"
                      >
                        {alert.action.text}
                        {alert.action.href.includes('wa.me') && (
                          <Phone className="w-3 h-3" />
                        )}
                      </a>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-sm font-medium underline hover:no-underline"
                        onClick={() => {
                          if (alert.action) {
                            window.location.href = alert.action.href
                          }
                        }}
                      >
                        {alert.action.text}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              
              {alert.dismissible !== false && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

// Hook pour gérer les alertes globales du site
export function useSiteAlerts() {
  const [alerts, setAlerts] = useState<SiteAlert[]>([])

  const addAlert = (alert: Omit<SiteAlert, 'id'>) => {
    // Check if an alert with the same title and message already exists
    const isDuplicate = alerts.some(existingAlert => 
      existingAlert.title === alert.title && 
      existingAlert.message === alert.message
    )
    
    if (isDuplicate) {
      return null // Don't add duplicate alerts
    }
    
    const id = Math.random().toString(36).substr(2, 9)
    setAlerts(prev => [...prev, { ...alert, id }])
    return id
  }

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  // Alertes prédéfinies
  const showVoteBlockedAlert = (message?: string) => {
    const finalMessage = message || 'Les votes sont actuellement fermés. Ils seront ouverts le jour de l\'événement.'
    return addAlert({
      type: 'warning',
      title: 'Votes temporaires',
      message: finalMessage,
      action: {
        text: '70359104 (WhatsApp)',
        href: 'https://wa.me/70359104',
        external: true
      },
      duration: null, // Ne ferme pas automatiquement
      dismissible: true
    })
  }

  const showSuccessAlert = (message: string) => {
    addAlert({
      type: 'success',
      title: 'Succès',
      message,
      duration: 5000
    })
  }

  const showErrorAlert = (message: string) => {
    addAlert({
      type: 'error',
      title: 'Erreur',
      message,
      duration: 8000
    })
  }

  const showInfoAlert = (message: string) => {
    addAlert({
      type: 'info',
      title: 'Information',
      message,
      duration: 6000
    })
  }

  return {
    alerts,
    addAlert,
    removeAlert,
    clearAllAlerts,
    showVoteBlockedAlert,
    showSuccessAlert,
    showErrorAlert,
    showInfoAlert
  }
}
