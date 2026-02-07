"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Lock, 
  Unlock, 
  Calendar, 
  Bell, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface VotingConfig {
  currentEvent: any
  isVotingOpen: boolean
  blockMessage: string
}

interface VotingControlProps {
  onConfigChange?: (config: VotingConfig) => void
}

export function VotingControl({ onConfigChange }: VotingControlProps) {
  const [config, setConfig] = useState<VotingConfig>({
    currentEvent: null,
    isVotingOpen: false,
    blockMessage: "" // Message vide, sera récupéré depuis l'API
  })
  const [loading, setLoading] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [sendingNotifications, setSendingNotifications] = useState(false)
  const [configLoading, setConfigLoading] = useState(false)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVotes: 0,
    todayVotes: 0,
    uniqueTodayVoters: 0,
    averageTimeMinutes: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)

  // Charger la configuration actuelle
  useEffect(() => {
    fetchVotingConfig()
    fetchStats()
  }, []) // Exécuter une seule fois au montage

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const response = await fetch('/api/stats/voting')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchVotingConfig = async () => {
    if (configLoading) return // Éviter les appels multiples
    
    setConfigLoading(true)
    try {
      const response = await fetch('/api/voting-config')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      console.error('Erreur lors du chargement de la config:', error)
    } finally {
      setConfigLoading(false)
    }
  }

  const updateVotingConfig = async (newConfig: Partial<VotingConfig>) => {
    setLoading(true)
    try {
      const response = await fetch('/api/voting-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, ...newConfig })
      })
      
      if (response.ok) {
        const updatedConfig = await response.json()
        setConfig(updatedConfig)
        onConfigChange?.(updatedConfig)
        // Recharger les statistiques après changement
        fetchStats()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendVotingOpenedNotifications = async () => {
    if (!notificationMessage.trim()) {
      alert('Veuillez entrer un message de notification')
      return
    }

    setSendingNotifications(true)
    try {
      const response = await fetch('/api/notifications/voting-opened', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: notificationMessage,
          eventId: config.currentEvent?.id 
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`Notifications envoyées à ${result.count} utilisateurs`)
        setNotificationMessage("")
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des notifications:', error)
      alert('Erreur lors de l\'envoi des notifications')
    } finally {
      setSendingNotifications(false)
    }
  }

  const toggleVoting = () => {
    const newStatus = !config.isVotingOpen
    const confirmMessage = newStatus 
      ? "Êtes-vous sûr de vouloir ouvrir les votes ? Tous les utilisateurs pourront voter."
      : "Êtes-vous sûr de vouloir fermer les votes ? Plus aucun vote ne sera accepté."
    
    if (confirm(confirmMessage)) {
      updateVotingConfig({ 
        isVotingOpen: newStatus,
        blockMessage: newStatus 
          ? "Les votes sont actuellement ouverts." 
          : "Les votes sont actuellement fermés. Ils seront rouverts le jour de l'événement."
      })
      
      // Si on ouvre les votes, envoyer les notifications
      if (newStatus && notificationMessage.trim()) {
        setTimeout(() => {
          sendVotingOpenedNotifications()
        }, 1000)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Statut actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Contrôle des Votes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statut des votes */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                config.isVotingOpen 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {config.isVotingOpen ? (
                  <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  Votes {config.isVotingOpen ? 'ouverts' : 'fermés'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {config.isVotingOpen 
                    ? 'Les utilisateurs peuvent voter maintenant' 
                    : 'Les votes sont bloqués'
                  }
                </p>
              </div>
            </div>
            
            <Button
              onClick={toggleVoting}
              disabled={loading}
              variant={config.isVotingOpen ? "destructive" : "default"}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : config.isVotingOpen ? (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Fermer
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Ouvrir
                </>
              )}
            </Button>
          </div>

          {/* Message de blocage */}
          <div className="space-y-2">
            <Label htmlFor="blockMessage">Message affiché quand les votes sont fermés</Label>
            <Textarea
              id="blockMessage"
              value={config.blockMessage}
              onChange={(e) => setConfig(prev => ({ ...prev, blockMessage: e.target.value }))}
              placeholder="Message à afficher aux utilisateurs quand les votes sont fermés..."
              className="min-h-[80px]"
            />
            <Button 
              onClick={() => updateVotingConfig({ blockMessage: config.blockMessage })}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Mettre à jour le message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications aux Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              📢 Envoyer une notification à tous les utilisateurs
            </p>
            <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <p>• Notifie tous les utilisateurs que les votes sont ouverts</p>
              <p>• Personnalisez le message selon vos besoins</p>
              <p>• Les notifications apparaîtront dans leur tableau de bord</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationMessage">Message de notification</Label>
            <Textarea
              id="notificationMessage"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Ex: 🗳️ Les votes sont maintenant ouverts ! Venez voter pour vos candidats préférés..."
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={sendVotingOpenedNotifications}
              disabled={sendingNotifications || !notificationMessage.trim()}
              className="flex-1"
            >
              {sendingNotifications ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Envoyer à tous les utilisateurs
                </>
              )}
            </Button>
            
            <Button
              onClick={() => updateVotingConfig({ isVotingOpen: true })}
              disabled={loading || !notificationMessage.trim()}
              variant="outline"
            >
              <>
                <Unlock className="w-4 h-4 mr-2" />
                Ouvrir les votes et notifier
              </>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistiques des Votes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  stats.totalUsers
                )}
              </div>
              <p className="text-sm text-muted-foreground">Utilisateurs totaux</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-500">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  stats.todayVotes
                )}
              </div>
              <p className="text-sm text-muted-foreground">Votes aujourd'hui</p>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {statsLoading ? (
                  <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  stats.averageTimeMinutes > 0 ? `${stats.averageTimeMinutes} min` : '--'
                )}
              </div>
              <p className="text-sm text-muted-foreground">Temps moyen par vote</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
