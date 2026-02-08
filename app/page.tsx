"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AuthSection } from "@/components/auth-section"
import { VoteSection } from "@/components/vote-section"
import { ResultsSection } from "@/components/results-section"
import { AdminSection } from "@/components/admin-section"
import { UserProfile } from "@/components/user-profile"
import { SiteAlert, useSiteAlerts } from "@/components/site-alert"
// import { AccessBlocked } from "@/components/access-blocked"
import { useUsers, useCategories, useVotes, useCurrentUser } from "@/hooks/use-api-data"
// import { isAccessBlockedServer, isAccessBlocked } from "@/lib/access-control"
import type { User, Category, Vote } from "@/hooks/use-api-data"

export type UserRole = "VOTER" | "SUPER_ADMIN"

export type Page = "home" | "auth" | "vote" | "results" | "profile" | "admin"

const particlePositions = Array.from({ length: 20 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 73.13) % 100,
  duration: 10 + (i % 10),
  yOffset: -200 - (i % 5) * 100,
}))

const DEFAULT_SUPER_ADMIN: User = {
  id: "super_admin_001",
  name: "Super Admin",
  email: "admin@bankassawards.com",
  role: "SUPER_ADMIN",
  createdAt: new Date().toISOString(),
}

export default function BankassAwards() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Récupérer la page sauvegardée depuis localStorage ou l'URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tab = urlParams.get('tab')
      const page = urlParams.get('page')
      
      // Priorité à l'URL, puis localStorage, puis défaut
      if (page) {
        return page as Page
      }
      if (tab === 'signup') {
        return "auth"
      }
      
      const savedPage = localStorage.getItem("currentPage") as Page
      return savedPage || "home"
    }
    return "home"
  })
  const { currentUser, login, logout } = useCurrentUser()
  const { users, loading: usersLoading } = useUsers()
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories()
  const { votes, loading: votesLoading, refetch: refetchVotes } = useVotes()
  const { alerts, showSuccessAlert, showErrorAlert, showInfoAlert } = useSiteAlerts()
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [isMounted, setIsMounted] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  // État pour le statut des votes (persisté côté client)
  const [votingStatus, setVotingStatus] = useState<{
    isVotingOpen: boolean
    blockMessage?: string
    lastChecked: number
  }>(() => {
    // Récupérer le statut des votes depuis localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("votingStatus")
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      isVotingOpen: false, // Bloqué par défaut
      blockMessage: "Les votes sont actuellement fermés. Ils seront ouverts le jour de l'événement.",
      lastChecked: Date.now()
    }
  })
  // const [accessBlocked, setAccessBlocked] = useState(false)

  // Gérer le contrôle d'accès côté client pour éviter l'hydratation
  useEffect(() => {
    setIsMounted(true)
    // setAccessBlocked(isAccessBlocked())
    
    // Le theme est stocké dans localStorage pour l'instant
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  // Rafraîchissement automatique toutes les 30 secondes
  useEffect(() => {
    // if (!autoRefresh || accessBlocked) return
    
    const interval = setInterval(() => {
      refetchCategories()
      refetchVotes()
    }, 30000) // 30 secondes

    return () => clearInterval(interval)
  }, [autoRefresh, refetchCategories, refetchVotes]) // , accessBlocked])

  // Rafraîchissement lors du retour sur la page d'accueil
  useEffect(() => {
    // if (currentPage === "home" && !accessBlocked) {
    if (currentPage === "home") {
      refetchCategories()
      refetchVotes()
    }
  }, [currentPage, refetchCategories, refetchVotes]) // , accessBlocked])

  useEffect(() => {
    // Sauvegarder la page actuelle dans localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("currentPage", currentPage)
    }
  }, [currentPage])

  // Persister le statut des votes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("votingStatus", JSON.stringify(votingStatus))
    }
  }, [votingStatus])

  // Vérifier le statut des votes périodiquement (toutes les 30 secondes) - DÉSACTIVÉ
  useEffect(() => {
    // Le polling est désactivé pour éviter la boucle infinie
    // Le statut sera vérifié manuellement par l'admin
    return () => {}
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleLogout = () => {
    logout()
    setCurrentPage("home")
  }

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN"

  // Contrôle d'accès - Vérifier si la plateforme est bloquée
  if (!isMounted) {
    // Afficher un loader pendant le montage pour éviter l'hydratation
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  // if (accessBlocked) {
  //   return <AccessBlocked />
  // }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
        isSuperAdmin={isSuperAdmin}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {currentPage === "home" && (
            <HeroSection 
              setCurrentPage={(page) => setCurrentPage(page as Page)} 
              currentUser={currentUser} 
              categories={categories}
              votes={votes}
              loading={categoriesLoading || votesLoading}
            />
          )}
          {currentPage === "auth" && (
            <AuthSection
              setCurrentPage={(page) => setCurrentPage(page as Page)}
              setCurrentUser={(user) => user && login(user)}
            />
          )}
          {currentPage === "vote" && (
            <VoteSection
              currentUser={currentUser}
              setCurrentPage={(page) => setCurrentPage(page as Page)}
              categories={categories}
              votingStatus={votingStatus}
            />
          )}
          {currentPage === "results" && (
            <ResultsSection
              votes={votes}
              categories={categories}
              isSuperAdmin={isSuperAdmin}
            />
          )}
          {currentPage === "profile" && currentUser && (
            <UserProfile
              user={currentUser}
              onClose={() => setCurrentPage("home")}
              onUpdate={(updatedUser) => login(updatedUser)}
            />
          )}
          {currentPage === "admin" && isSuperAdmin && (
            <AdminSection
              votes={votes}
              currentUser={currentUser}
              showSuccessAlert={showSuccessAlert}
              showErrorAlert={showErrorAlert}
              showInfoAlert={showInfoAlert}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Site Alerts */}
      <SiteAlert 
        alerts={alerts} 
        position="top"
        className="px-4 max-w-md"
      />

      {isMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          {particlePositions.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, particle.yOffset],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
