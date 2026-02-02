"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Shield, AlertCircle, Eye, EyeOff, Key, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACCESS_CONFIG, validateActivationCode, unlockAccess } from "@/lib/access-control"

export function AccessBlocked() {
  const [activationCode, setActivationCode] = useState("")
  const [showCode, setShowCode] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)

  const handleActivation = () => {
    if (validateActivationCode(activationCode)) {
      setMessage({ type: "success", text: "Accès débloqué avec succès !" })
      setIsUnlocked(true)
      unlockAccess() // Débloquer l'accès localement
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } else {
      setMessage({ type: "error", text: "Code d'activation incorrect" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (isUnlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-500 mb-2">Accès Autorisé</h2>
          <p className="text-muted-foreground">Redirection en cours...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Card principale */}
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{ACCESS_CONFIG.blockMessage}</h1>
            <p className="text-muted-foreground text-sm">{ACCESS_CONFIG.blockDetails}</p>
          </div>

          {/* Message d'erreur/succès */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg flex items-center gap-2 text-sm mb-6 ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <Shield className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </motion.div>
          )}

          {/* Section code d'activation */}
          <div className="space-y-4 mb-6">
            <Label className="text-sm font-medium">Code d'activation</Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showCode ? "text" : "password"}
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="Entrez le code d'activation"
                className="pl-12 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowCode(!showCode)}
              >
                {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleActivation}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
            >
              <Shield className="w-4 h-4 mr-2" />
              Débloquer l'accès
            </Button>
          </div>

          {/* Contact info */}
          <div className="border-t border-border/50 pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Pour débloquer l'accès:</p>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{ACCESS_CONFIG.contactInfo}</span>
                </div>
                {ACCESS_CONFIG.phoneNumber && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{ACCESS_CONFIG.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            BANKASS AWARDS - Plateforme de votes
          </p>
        </div>
      </motion.div>
    </div>
  )
}
