export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "VOTER" | "SUPER_ADMIN"
  domain: string
  city: string
  createdAt: string
  profilePhoto?: string
}

export interface Vote {
  id: string
  user_id: string
  category_id: string
  candidate_id: string
  candidate_name: string
  timestamp: number
  ip_address?: string
  user_agent?: string
  fraud_status?: string
  // Pour la compatibilité avec le code existant
  userId?: string
  categoryId?: string
  candidateName?: string
}

export interface Category {
  id: string
  name: string
  description?: string
}

export interface Candidate {
  id: string
  name: string
  category_id: string
  description?: string
  image?: string
}

export type Page = "home" | "login" | "signup" | "profile" | "admin" | "results" | "about" | "auth" | "vote"
