// Types
export interface Player {
  id: string
  name: string
  photoUrl: string
  checkInTime: string
  selected?: boolean
  position?: number
  isCheckedIn?: boolean
  groupId?: string
}

// Adicione esta interface para endereço
export interface Address {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement?: string
}

// Adicione esta nova interface para jogadores do sistema
export interface SystemPlayer {
  id: string
  name: string
  photoUrl: string
  email?: string
  membershipId?: string
  status?: "active" | "inactive" | "suspended"
  lastCheckIn?: string
  phone?: string
  address?: Address
  cpf?: string
  isGuest?: boolean
  guestOf?: string
}

export interface Court {
  id: string
  name: string
  status: "available" | "in-use" | "maintenance" | "classes" | "tournament"
  players: Player[]
  startTime?: string
  endTime?: string
}

export interface PeakHourPeriod {
  id: string
  dayOfWeek: string
  startTime: string
  endTime: string
}

export interface GeneralSettings {
  courtSessionTime: string
  checkInGracePeriod: string
  enforceDoublesInPeakHours: boolean
  allowRenewalIfNoQueue: boolean
  autoAssignCourts: boolean
  autoAllocateGroups: boolean
  peakHourPeriods: PeakHourPeriod[]
}

export interface TerminalSettings {
  terminalIp: string
  terminalPort: string
  terminalUsername: string
  terminalPassword: string
  syncFrequency: string
  autoSync: boolean
}

// Atualize a interface NotificationSettings para remover o campo do Zapier
export interface NotificationSettings {
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  notifyOnCheckIn: boolean
  notifyOnCourtAssignment: boolean
  notifyBeforeSessionEnd: boolean
  minutesBeforeEnd: string
  makeComWebhookUrl: string
  enableDataExport: boolean
}

// Adicione uma nova interface para grupos de jogadores:

export interface PlayerGroup {
  id: string
  players: Player[]
  isReady: boolean
  createdAt: string
  type: "singles" | "doubles"
}

// Initial data with 16 players (original 6 + 10 new ones)
const initialPlayers: Player[] = [
  {
    id: "p1",
    name: "John Martinez",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:30 AM",
    position: 1,
  },
  {
    id: "p2",
    name: "Maria Silva",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:32 AM",
    position: 2,
  },
  {
    id: "p3",
    name: "David Johnson",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:35 AM",
    position: 3,
  },
  {
    id: "p4",
    name: "Sarah Lee",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:40 AM",
    position: 4,
  },
  {
    id: "p5",
    name: "Carlos Rodriguez",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:45 AM",
    position: 5,
  },
  {
    id: "p6",
    name: "Emma Wilson",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:50 AM",
    position: 6,
  },
  // 10 new fictional players
  {
    id: "p15",
    name: "Sophia Patel",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "10:55 AM",
    position: 7,
  },
  {
    id: "p16",
    name: "Rafael Nakamura",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:00 AM",
    position: 8,
  },
  {
    id: "p17",
    name: "Olivia Chen",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:05 AM",
    position: 9,
  },
  {
    id: "p18",
    name: "Ethan Williams",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:10 AM",
    position: 10,
  },
  {
    id: "p19",
    name: "Isabella Fernandez",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:15 AM",
    position: 11,
  },
  {
    id: "p20",
    name: "Lucas Kim",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:20 AM",
    position: 12,
  },
  {
    id: "p21",
    name: "Amelia Nguyen",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:25 AM",
    position: 13,
  },
  {
    id: "p22",
    name: "Jackson Thompson",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:30 AM",
    position: 14,
  },
  {
    id: "p23",
    name: "Sofia Morales",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:35 AM",
    position: 15,
  },
  {
    id: "p24",
    name: "Benjamin Cohen",
    photoUrl: "/placeholder.svg?height=50&width=50",
    checkInTime: "11:40 AM",
    position: 16,
  },
]

const initialCourts: Court[] = [
  {
    id: "c1",
    name: "Court 1",
    status: "in-use",
    players: [
      { id: "p7", name: "Michael Brown", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "09:30 AM" },
      { id: "p8", name: "Jennifer Davis", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "09:32 AM" },
      { id: "p9", name: "Robert Miller", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "09:35 AM" },
      { id: "p10", name: "Lisa Garcia", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "09:40 AM" },
    ],
    startTime: "09:45 AM",
    endTime: "11:15 AM",
  },
  { id: "c2", name: "Court 2", status: "available", players: [] },
  {
    id: "c3",
    name: "Court 3",
    status: "in-use",
    players: [
      { id: "p11", name: "Daniel Wilson", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "10:00 AM" },
      { id: "p12", name: "Patricia Moore", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "10:05 AM" },
      { id: "p13", name: "Thomas Taylor", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "10:10 AM" },
      { id: "p14", name: "Nancy Anderson", photoUrl: "/placeholder.svg?height=50&width=50", checkInTime: "10:15 AM" },
    ],
    startTime: "10:20 AM",
    endTime: "11:50 AM",
  },
  { id: "c4", name: "Court 4", status: "available", players: [] },
  { id: "c5", name: "Court 5", status: "maintenance", players: [] },
  { id: "c6", name: "Court 6", status: "available", players: [] },
  { id: "c7", name: "Court 7", status: "available", players: [] },
  { id: "c8", name: "Court 8", status: "available", players: [] },
]

// Initial settings
export const initialGeneralSettings: GeneralSettings = {
  courtSessionTime: "90",
  checkInGracePeriod: "15",
  enforceDoublesInPeakHours: true,
  allowRenewalIfNoQueue: true,
  autoAssignCourts: false,
  autoAllocateGroups: true,
  peakHourPeriods: [{ id: "1", dayOfWeek: "all", startTime: "16:00", endTime: "20:00" }],
}

export const initialTerminalSettings: TerminalSettings = {
  terminalIp: "192.168.1.100",
  terminalPort: "8000",
  terminalUsername: "admin",
  terminalPassword: "********",
  syncFrequency: "5",
  autoSync: true,
}

// Atualize o initialNotificationSettings:
export const initialNotificationSettings: NotificationSettings = {
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  notifyOnCheckIn: true,
  notifyOnCourtAssignment: true,
  notifyBeforeSessionEnd: true,
  minutesBeforeEnd: "10",
  makeComWebhookUrl: "",
  enableDataExport: false,
}

// Função para criar um grupo de jogadores
export const createPlayerGroup = (players: Player[], type: "singles" | "doubles"): PlayerGroup => {
  const groupId = `group_${Date.now()}`

  // Atualizar os jogadores com o ID do grupo
  const groupPlayers = players.map((player) => ({
    ...player,
    groupId,
  }))

  return {
    id: groupId,
    players: groupPlayers,
    isReady: false,
    createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    type,
  }
}

// Função para verificar se todos os jogadores de um grupo fizeram check-in
export const isGroupReady = (group: PlayerGroup): boolean => {
  return group.players.every((player) => player.isCheckedIn)
}

// Função para obter grupos de jogadores
export const getPlayerGroups = (): PlayerGroup[] => {
  if (typeof window === "undefined") return []

  const storedGroups = localStorage.getItem("tennis-player-groups")
  if (!storedGroups) {
    localStorage.setItem("tennis-player-groups", JSON.stringify([]))
    return []
  }

  try {
    return JSON.parse(storedGroups)
  } catch (error) {
    console.error("Error parsing player groups from localStorage:", error)
    return []
  }
}

// Função para salvar grupos de jogadores
export const setPlayerGroups = (groups: PlayerGroup[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-player-groups", JSON.stringify(groups))
}

// Função para obter jogadores aguardando quadra (com check-in confirmado)
export const getCourtWaitingPlayers = (): PlayerGroup[] => {
  if (typeof window === "undefined") return []

  const storedGroups = localStorage.getItem("tennis-court-waiting")
  if (!storedGroups) {
    localStorage.setItem("tennis-court-waiting", JSON.stringify([]))
    return []
  }

  try {
    return JSON.parse(storedGroups)
  } catch (error) {
    console.error("Error parsing court waiting players from localStorage:", error)
    return []
  }
}

// Função para salvar jogadores aguardando quadra
export const setCourtWaitingPlayers = (groups: PlayerGroup[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-court-waiting", JSON.stringify(groups))
}

// Função para fazer check-in de um jogador
export const checkInPlayer = (playerId: string): void => {
  const players = getPlayers()
  const updatedPlayers = players.map((player) => (player.id === playerId ? { ...player, isCheckedIn: true } : player))
  setPlayers(updatedPlayers)

  // Verificar se o jogador pertence a algum grupo
  const groups = getPlayerGroups()
  let groupsUpdated = false

  const updatedGroups = groups.map((group) => {
    const updatedGroupPlayers = group.players.map((player) =>
      player.id === playerId ? { ...player, isCheckedIn: true } : player,
    )

    const updatedGroup = {
      ...group,
      players: updatedGroupPlayers,
      isReady: updatedGroupPlayers.every((p) => p.isCheckedIn),
    }

    if (JSON.stringify(group) !== JSON.stringify(updatedGroup)) {
      groupsUpdated = true
    }

    return updatedGroup
  })

  if (groupsUpdated) {
    setPlayerGroups(updatedGroups)

    // Mover grupos prontos para a lista de espera de quadra
    const readyGroups = updatedGroups.filter((group) => group.isReady)
    const pendingGroups = updatedGroups.filter((group) => !group.isReady)

    if (readyGroups.length > 0) {
      const courtWaitingGroups = getCourtWaitingPlayers()
      setCourtWaitingPlayers([...courtWaitingGroups, ...readyGroups])
      setPlayerGroups(pendingGroups)
    }
  }
}

// Helper functions to get and set data from localStorage
export const getPlayers = (): Player[] => {
  if (typeof window === "undefined") return initialPlayers

  try {
    const storedPlayers = localStorage.getItem("tennis-players")
    if (!storedPlayers) {
      localStorage.setItem("tennis-players", JSON.stringify(initialPlayers))
      return initialPlayers
    }
    return JSON.parse(storedPlayers)
  } catch (error) {
    console.error("Error parsing players from localStorage:", error)
    return initialPlayers
  }
}

export const getCourts = (): Court[] => {
  if (typeof window === "undefined") return initialCourts

  try {
    const storedCourts = localStorage.getItem("tennis-courts")
    if (!storedCourts) {
      localStorage.setItem("tennis-courts", JSON.stringify(initialCourts))
      return initialCourts
    }
    return JSON.parse(storedCourts)
  } catch (error) {
    console.error("Error parsing courts from localStorage:", error)
    return initialCourts
  }
}

export const getGeneralSettings = (): GeneralSettings => {
  if (typeof window === "undefined") return initialGeneralSettings

  const storedSettings = localStorage.getItem("tennis-general-settings")
  if (!storedSettings) {
    localStorage.setItem("tennis-general-settings", JSON.stringify(initialGeneralSettings))
    return initialGeneralSettings
  }

  try {
    return JSON.parse(storedSettings)
  } catch (error) {
    console.error("Error parsing general settings from localStorage:", error)
    return initialGeneralSettings
  }
}

export const getTerminalSettings = (): TerminalSettings => {
  if (typeof window === "undefined") return initialTerminalSettings

  const storedSettings = localStorage.getItem("tennis-terminal-settings")
  if (!storedSettings) {
    localStorage.setItem("tennis-terminal-settings", JSON.stringify(initialTerminalSettings))
    return initialTerminalSettings
  }

  try {
    return JSON.parse(storedSettings)
  } catch (error) {
    console.error("Error parsing terminal settings from localStorage:", error)
    return initialTerminalSettings
  }
}

export const getNotificationSettings = (): NotificationSettings => {
  if (typeof window === "undefined") return initialNotificationSettings

  const storedSettings = localStorage.getItem("tennis-notification-settings")
  if (!storedSettings) {
    localStorage.setItem("tennis-notification-settings", JSON.stringify(initialNotificationSettings))
    return initialNotificationSettings
  }

  try {
    return JSON.parse(storedSettings)
  } catch (error) {
    console.error("Error parsing notification settings from localStorage:", error)
    return initialNotificationSettings
  }
}

export const setPlayers = (players: Player[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-players", JSON.stringify(players))
}

export const setCourts = (courts: Court[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-courts", JSON.stringify(courts))
}

export const setGeneralSettings = (settings: GeneralSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-general-settings", JSON.stringify(settings))
}

export const setTerminalSettings = (settings: TerminalSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-terminal-settings", JSON.stringify(settings))
}

export const setNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-notification-settings", JSON.stringify(settings))
}

// Function to update player positions
export const updatePlayerPositions = (players: Player[]): Player[] => {
  return players.map((player, index) => ({
    ...player,
    position: index + 1,
  }))
}

// Adicione estas funções para gerenciar todos os jogadores do sistema
export const getAllSystemPlayers = (): SystemPlayer[] => {
  if (typeof window === "undefined") return []

  const storedPlayers = localStorage.getItem("tennis-system-players")
  if (!storedPlayers) {
    // Inicializar com jogadores iniciais e jogadores nas quadras
    const initialSystemPlayers = initializeSystemPlayers()
    localStorage.setItem("tennis-system-players", JSON.stringify(initialSystemPlayers))
    return initialSystemPlayers
  }

  try {
    return JSON.parse(storedPlayers)
  } catch (error) {
    console.error("Error parsing system players from localStorage:", error)
    return []
  }
}

export const setAllSystemPlayers = (players: SystemPlayer[]): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("tennis-system-players", JSON.stringify(players))
}

export const addPlayerToSystem = (player: Player): void => {
  if (typeof window === "undefined") return

  const systemPlayers = getAllSystemPlayers()

  // Verificar se o jogador já existe no sistema
  if (!systemPlayers.some((p) => p.id === player.id)) {
    const systemPlayer: SystemPlayer = {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      lastCheckIn: player.checkInTime,
    }

    setAllSystemPlayers([...systemPlayers, systemPlayer])
  }
}

// Função para inicializar o sistema com todos os jogadores iniciais
const initializeSystemPlayers = (): SystemPlayer[] => {
  const waitingPlayers = getPlayers()
  const courts = getCourts()

  const systemPlayers: SystemPlayer[] = []
  const playerIds = new Set<string>()

  // Adicionar jogadores da lista de espera
  waitingPlayers.forEach((player) => {
    if (!playerIds.has(player.id)) {
      playerIds.add(player.id)
      systemPlayers.push({
        id: player.id,
        name: player.name,
        photoUrl: player.photoUrl,
        lastCheckIn: player.checkInTime,
        status: "active",
      })
    }
  })

  // Adicionar jogadores das quadras
  courts.forEach((court) => {
    if (court.status === "in-use" && court.players.length > 0) {
      court.players.forEach((player) => {
        if (!playerIds.has(player.id)) {
          playerIds.add(player.id)
          systemPlayers.push({
            id: player.id,
            name: player.name,
            photoUrl: player.photoUrl,
            lastCheckIn: player.checkInTime,
            status: "active",
          })
        }
      })
    }
  })

  // Adicionar jogadores iniciais que podem não estar na lista de espera ou nas quadras
  initialPlayers.forEach((player) => {
    if (!playerIds.has(player.id)) {
      playerIds.add(player.id)
      systemPlayers.push({
        id: player.id,
        name: player.name,
        photoUrl: player.photoUrl,
        lastCheckIn: player.checkInTime,
        status: "active",
      })
    }
  })

  // Adicionar jogadores das quadras iniciais
  initialCourts.forEach((court) => {
    if (court.status === "in-use" && court.players.length > 0) {
      court.players.forEach((player) => {
        if (!playerIds.has(player.id)) {
          playerIds.add(player.id)
          systemPlayers.push({
            id: player.id,
            name: player.name,
            photoUrl: player.photoUrl,
            lastCheckIn: player.checkInTime,
            status: "active",
          })
        }
      })
    }
  })

  return systemPlayers
}

// Atualizar a função getAllPlayers para usar o novo sistema
export const getAllPlayers = (): Player[] => {
  // Obter todos os jogadores do sistema
  const systemPlayers = getAllSystemPlayers()

  // Converter para o formato Player
  return systemPlayers.map((player) => ({
    id: player.id,
    name: player.name,
    photoUrl: player.photoUrl,
    checkInTime: player.lastCheckIn || "Never",
  }))
}

// Function to reset to demo data but preserve all players
export const resetToDemo = (): void => {
  if (typeof window === "undefined") return

  // Get all current players from the system
  const currentPlayers = getAllPlayers()

  // Create a map of player IDs to preserve custom players
  const playerMap = new Map<string, Player>()

  // Add initial players to the map
  initialPlayers.forEach((player) => {
    playerMap.set(player.id, player)
  })

  // Add any custom players that aren't in the initial set
  currentPlayers.forEach((player) => {
    if (!playerMap.has(player.id)) {
      // This is a custom player, add them to the map
      // but reset their position and selected status
      playerMap.set(player.id, {
        ...player,
        position: undefined,
        selected: false,
      })
    }
  })

  // Convert the map values back to an array and sort by position
  const allPlayers = Array.from(playerMap.values())

  // Reset the waiting list to only include the initial players
  // but preserve any custom players in the system
  setPlayers(initialPlayers)
}

// Function to add a new court
export const addCourt = (courtName: string): void => {
  if (typeof window === "undefined") return

  const courts = getCourts()
  const newId = `c${courts.length + 1}`

  const newCourt: Court = {
    id: newId,
    name: courtName,
    status: "available",
    players: [],
  }

  setCourts([...courts, newCourt])
}

// Function to update court status
export const updateCourtStatus = (courtId: string, newStatus: Court["status"]): void => {
  if (typeof window === "undefined") return

  const courts = getCourts()
  const updatedCourts = courts.map((court) =>
    court.id === courtId
      ? {
          ...court,
          status: newStatus,
          // Clear players if changing from in-use to another status
          ...(court.status === "in-use" && newStatus !== "in-use"
            ? { players: [], startTime: undefined, endTime: undefined }
            : {}),
        }
      : court,
  )

  setCourts(updatedCourts)
}

// Helper function to get badge variant based on court status
export const getStatusBadgeVariant = (status: Court["status"]) => {
  switch (status) {
    case "available":
      return "custom-green"
    case "in-use":
      return "custom-blue"
    case "maintenance":
      return "custom-orange"
    case "classes":
      return "custom-purple"
    case "tournament":
      return "custom-red"
    default:
      return "outline"
  }
}

// Helper function to get display text for court status
export const getStatusDisplayText = (status: Court["status"]) => {
  switch (status) {
    case "in-use":
      return "In Use"
    case "available":
      return "Available"
    case "maintenance":
      return "Maintenance"
    case "classes":
      return "Classes"
    case "tournament":
      return "Tournament"
    default:
      return status.charAt(0).toUpperCase() + status.slice(1)
  }
}

// Function to update a player
export const updatePlayer = (playerId: string, updatedPlayer: Partial<Player>): void => {
  if (typeof window === "undefined") return

  const players = getPlayers()
  const updatedPlayers = players.map((player) => (player.id === playerId ? { ...player, ...updatedPlayer } : player))

  setPlayers(updatedPlayers)
}
