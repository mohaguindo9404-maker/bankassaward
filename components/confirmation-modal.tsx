"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "warning" | "info" | "success"
  loading?: boolean
}

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning",
  loading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-8 h-8 text-amber-500" />
      case "info":
        return <Info className="w-8 h-8 text-blue-500" />
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />
      default:
        return <AlertTriangle className="w-8 h-8 text-amber-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case "warning":
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
      default:
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
    }
  }

  const getConfirmButtonVariant = (): "default" | "outline" | "destructive" | "secondary" | "ghost" | "link" => {
    switch (type) {
      case "warning":
        return "destructive"
      case "info":
        return "default"
      case "success":
        return "default"
      default:
        return "destructive"
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
                      {title}
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
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    {message}
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                  >
                    {cancelText}
                  </Button>
                  
                  <Button
                    onClick={handleConfirm}
                    className="flex-1"
                    variant={getConfirmButtonVariant()}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
