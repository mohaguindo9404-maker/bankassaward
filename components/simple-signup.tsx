"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { UserIcon, MapPin, Mail, Phone, Briefcase, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { recordUserConnection } from "@/lib/anti-fraud"
import type { User } from "@/hooks/use-api-data"

interface SimpleSignupProps {
  onSuccess: (user: User) => void
  onSwitchToLogin: () => void
  existingUsers: User[]
}

export function SimpleSignup({ onSuccess, onSwitchToLogin, existingUsers }: SimpleSignupProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    domain: "",
    city: "",
    password: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const domains = [
    "Musique", "Audiovisuel", "Journalisme", "Marketing", 
    "Communication", "Production", "Événementiel", "Art", 
    "Culture", "Sport", "Éducation", "Technologie", "Autre"
  ]

  // Obtenir l'IP client (simplifié pour le développement)
  const getClientIP = (): string | undefined => {
    if (typeof window !== 'undefined') {
      return undefined
    }
    return undefined
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setMessage(null)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Validation simple
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.domain || !formData.city) {
        setMessage({
          type: "error",
          text: "Tous les champs sont obligatoires"
        })
        setIsSubmitting(false)
        return
      }

      // Valider le format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setMessage({
          type: "error",
          text: "Veuillez entrer une adresse email valide"
        })
        setIsSubmitting(false)
        return
      }

      // Valider le format du téléphone (format malien)
      const phoneRegex = /^(\+223)?[0-9]{8}$/
      const cleanPhone = formData.phone.replace(/\D/g, '')
      if (!phoneRegex.test(cleanPhone) || cleanPhone.length !== 8) {
        setMessage({
          type: "error",
          text: "Veuillez entrer un numéro de téléphone malien valide (8 chiffres)"
        })
        setIsSubmitting(false)
        return
      }

      // Vérifier si l'email existe déjà
      const emailExists = existingUsers.some(user => 
        user.email && user.email.toLowerCase() === formData.email.toLowerCase()
      )

      if (emailExists) {
        setMessage({
          type: "error",
          text: "Cet email est déjà utilisé. Veuillez vous connecter."
        })
        setIsSubmitting(false)
        return
      }

      // Vérifier si le téléphone existe déjà
      const phoneExists = existingUsers.some(user => 
        user.phone && user.phone.replace(/\D/g, '') === cleanPhone
      )

      if (phoneExists) {
        setMessage({
          type: "error",
          text: "Ce numéro de téléphone est déjà utilisé. Veuillez vous connecter."
        })
        setIsSubmitting(false)
        return
      }

      // Créer l'utilisateur directement
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: `+223${cleanPhone}`, // Format international malien
          password: formData.password,
          domain: formData.domain,
          city: formData.city,
          role: "VOTER",
        })
      })

      if (response.ok) {
        const newUser = await response.json()
        
        // Enregistrer la connexion pour la sécurité
        recordUserConnection(newUser, getClientIP(), navigator.userAgent)
        
        // Stocker l'utilisateur et le connecter directement
        localStorage.setItem('user', JSON.stringify(newUser))
        localStorage.setItem('isLoggedIn', 'true')
        
        setMessage({
          type: "success",
          text: `Compte créé avec succès ! Bienvenue ${formData.fullName}`
        })
        
        // Rediriger vers la page d'accueil après 2 secondes
        setTimeout(() => {
          onSuccess(newUser)
        }, 2000)
      } else {
        const error = await response.json()
        setMessage({
          type: "error",
          text: error.error || "Erreur lors de la création du compte"
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur de connexion. Veuillez réessayer."
      })
    }

    setIsSubmitting(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Inscription Simple</h2>
          <p className="text-muted-foreground text-sm">
            Créez votre compte en quelques secondes
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Votre nom complet"
                className="pl-11 h-12"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="votre@email.com"
                className="pl-11 h-12"
                required
              />
            </div>
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+223 XX XX XX XX"
                className="pl-11 h-12"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: +223 suivi de 8 chiffres (ex: +223 76 12 34 56)
            </p>
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Choisissez un mot de passe"
                className="pl-11 h-12"
                required
                minLength={6}
              />
            </div>
          </div>

          {/* Domaine */}
          <div className="space-y-2">
            <Label htmlFor="domain">Domaine d'activité</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                id="domain"
                value={formData.domain}
                onChange={(e) => handleInputChange("domain", e.target.value)}
                className="w-full pl-11 h-12 px-3 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md"
                required
              >
                <option value="">Sélectionnez votre domaine</option>
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Votre ville"
                className="pl-11 h-12"
                required
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
              }`}
            >
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </motion.div>
          )}

          {/* Bouton d'inscription */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
