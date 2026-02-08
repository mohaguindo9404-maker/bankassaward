"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Lock, Phone, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VotingBlockedModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
  contactPhone?: string
  type?: "blocked" | "warning" | "info"
}

export function VotingBlockedModal({ 
  isOpen, 
  onClose, 
  message = "Les votes sont actuellement bloqués.", 
  contactPhone = "+223 XX XX XX XX",
  type = "blocked"
}: VotingBlockedModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-amber-500" />
      case "info":
        return <Info className="w-8 h-8 text-blue-500" />
      default:
        return <Lock className="w-8 h-8 text-red-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "warning":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
      default:
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md"
          >
            <Card className={`border-2 ${getColors()}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <CardTitle className="text-lg">
                      {type === "warning" ? "Attention" : 
                       type === "info" ? "Information" : 
                       "Votes Bloqués"}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {message}
                  </p>
                  
                  {type === "blocked" && (
                    <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
                      <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="font-medium">Contact Support</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pour plus d'informations ou assistance, veuillez contacter :
                      </p>
                      <div className="bg-background rounded-md p-3 border border-border/50">
                        <p className="font-mono text-center text-primary font-semibold">
                          {contactPhone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={onClose}
                    className="flex-1"
                    variant={type === "blocked" ? "outline" : "default"}
                  >
                    {type === "blocked" ? "J'ai compris" : "OK"}
                  </Button>
                  
                  {type === "blocked" && (
                    <Button
                      onClick={() => {
                        window.location.href = `tel:${contactPhone.replace(/\s/g, '')}`
                      }}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
