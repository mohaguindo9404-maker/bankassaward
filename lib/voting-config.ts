export interface VotingEvent {
  id: string
  name: string
  description: string
  startDate: string // ISO date
  endDate: string // ISO date
  isActive: boolean
  votingEnabled: boolean
  notificationMessage?: string
}

export interface VotingConfig {
  currentEvent: VotingEvent | null
  isVotingOpen: boolean
  blockMessage: string
}

// Configuration par défaut - peut être modifiée via l'admin
export const DEFAULT_VOTING_CONFIG: VotingConfig = {
  currentEvent: null,
  isVotingOpen: false,
  blockMessage: "Les votes sont actuellement fermés. Ils seront ouverts le jour de l'événement."
}
