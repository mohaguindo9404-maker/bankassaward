"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Sun, Moon, Menu, X, User as UserIcon, LogOut, Vote, BarChart3, Home, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Page } from "@/app/page"
import type { User as UserType } from "@/hooks/use-api-data"
import { NotificationPanel } from "@/components/notification-panel"
import { ProfilePhotoUpload } from "@/components/profile-photo-upload"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavigationProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  currentUser: UserType | null
  theme: "light" | "dark"
  toggleTheme: () => void
  onLogout: () => void
  isSuperAdmin: boolean // Added isSuperAdmin prop
}

export function Navigation({
  currentPage,
  setCurrentPage,
  currentUser,
  theme,
  toggleTheme,
  onLogout,
  isSuperAdmin,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home" as Page, label: "Accueil", icon: Home },
    { id: "vote" as Page, label: "Voter", icon: Vote, requiresAuth: true },
    { id: "results" as Page, label: "Résultats", icon: BarChart3 },
    { id: "admin" as Page, label: "Administration", icon: Shield, requiresAdmin: true },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Logo SVG professionnel */}
            <img 
              src="/logo-modern.svg" 
              alt="Bankass Awards" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                BANKASS AWARDS
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Par l'équipe Winner Boys</p>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requiresAuth && !currentUser) return null
              if (item.requiresAdmin && !isSuperAdmin) return null
              const isActive = currentPage === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  } ${item.requiresAdmin ? "text-amber-500" : ""}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute inset-0 rounded-lg -z-10 ${item.requiresAdmin ? "bg-amber-500/10" : "bg-primary/10"}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Notifications - seulement pour les utilisateurs connectés */}
            {currentUser && (
              <NotificationPanel userId={currentUser.id} />
            )}
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <Moon className="w-5 h-5 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu / Auth Button */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative">
                    <ProfilePhotoUpload
                      currentPhoto={(currentUser as any).profilePhoto}
                      userId={currentUser.id}
                      onPhotoUpdate={(photoUrl) => {
                        // Mettre à jour la photo de profil de l'utilisateur
                        (currentUser as any).profilePhoto = photoUrl
                      }}
                      size="sm"
                      showUploadButton={false}
                    />
                    
                    {/* Badge admin */}
                    {isSuperAdmin && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-semibold flex items-center gap-2">
                      {currentUser.name}
                      {isSuperAdmin && <Shield className="w-4 h-4 text-amber-500" />}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    {isSuperAdmin && <p className="text-xs text-amber-500 font-medium mt-1">Super Administrateur</p>}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentPage("profile")}>
                    <UserIcon className="w-4 h-4 mr-2" />
                    Mon Profil
                  </DropdownMenuItem>
                  {isSuperAdmin && (
                    <DropdownMenuItem onClick={() => setCurrentPage("admin")} className="text-amber-500">
                      <Shield className="w-4 h-4 mr-2" />
                      Administration
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={onLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => setCurrentPage("auth")}
                className="hidden sm:flex bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/25"
              >
                Connexion
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center"
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                if (item.requiresAuth && !currentUser) return null
                if (item.requiresAdmin && !isSuperAdmin) return null
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      currentPage === item.id
                        ? item.requiresAdmin
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                )
              })}
              {!currentUser && (
                <Button
                  onClick={() => {
                    setCurrentPage("auth")
                    setMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                >
                  Connexion
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
