"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertCircle, Edit, RefreshCw } from "lucide-react"
import AdminHeader from "@/components/admin-header"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import {
  type Player,
  type Court,
  type PlayerGroup,
  getPlayers,
  getCourts,
  setPlayers,
  setCourts,
  updatePlayerPositions,
  getStatusDisplayText,
  createPlayerGroup,
  getPlayerGroups,
  setPlayerGroups,
  getCourtWaitingPlayers,
  setCourtWaitingPlayers,
  checkInPlayer,
  getGeneralSettings,
} from "@/lib/court-state"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const getPlayerInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const WaitingTimer = ({ createdAt }: { createdAt: string }) => {
  const [waitingTime, setWaitingTime] = useState("")

  useEffect(() => {
    const updateTimer = () => {
      // Parse the createdAt time properly - assuming it's in HH:MM format
      const today = new Date()
      const [hours, minutes] = createdAt.split(":").map(Number)
      const created = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
      const now = new Date()
      const diffMs = now.getTime() - created.getTime()

      // If the time difference is negative, it means the created time is for tomorrow
      const actualDiffMs = diffMs < 0 ? diffMs + 24 * 60 * 60 * 1000 : diffMs

      const totalMinutes = Math.floor(actualDiffMs / 60000)
      const seconds = Math.floor((actualDiffMs % 60000) / 1000)

      if (totalMinutes > 0) {
        setWaitingTime(`${totalMinutes}m ${seconds}s`)
      } else {
        setWaitingTime(`${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [createdAt])

  return (
    <div className="flex items-center justify-center mt-3 pt-3 border-t border-green-200">
      <div className="flex items-center text-sm text-green-700">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
        Waiting: {waitingTime}
      </div>
    </div>
  )
}

const PlayingTimer = ({ startTime }: { startTime: string }) => {
  const [playingTime, setPlayingTime] = useState("")

  useEffect(() => {
    const updateTimer = () => {
      const today = new Date()
      const [hours, minutes] = startTime.split(":").map(Number)
      const started = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes)
      const now = new Date()
      const diffMs = now.getTime() - started.getTime()

      const actualDiffMs = diffMs < 0 ? diffMs + 24 * 60 * 60 * 1000 : diffMs

      const totalMinutes = Math.floor(actualDiffMs / 60000)
      const seconds = Math.floor((actualDiffMs % 60000) / 1000)

      if (totalMinutes > 0) {
        setPlayingTime(`${totalMinutes}m ${seconds}s`)
      } else {
        setPlayingTime(`${seconds}s`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div className="flex items-center justify-center mt-3 pt-3 border-t border-blue-200">
      <div className="flex items-center text-sm text-blue-700">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
        Playing: {playingTime}
      </div>
    </div>
  )
}

const ScoreDisplay = ({ courtId }: { courtId: string }) => {
  // Generate realistic fake scores based on courtId
  const getFakeScore = (courtId: string) => {
    const fakeScores = {
      "court-1": { team1: [6, 4, 2], team2: [3, 6, 1] },
      "court-2": { team1: [6, 2, 0], team2: [4, 6, 0] },
      "court-3": { team1: [7, 6, 0], team2: [5, 4, 0] },
      "court-4": { team1: [6, 3, 0], team2: [4, 6, 0] },
    }
    return fakeScores[courtId as keyof typeof fakeScores] || { team1: [0, 0, 0], team2: [0, 0, 0] }
  }

  const [score, setScore] = useState(getFakeScore(courtId))

  const updateScore = (team: "team1" | "team2", setIndex: number, increment: boolean) => {
    setScore((prev) => {
      const newScore = { ...prev }
      if (increment) {
        newScore[team][setIndex] = Math.min(newScore[team][setIndex] + 1, 7)
      } else {
        newScore[team][setIndex] = Math.max(newScore[team][setIndex] - 1, 0)
      }
      return newScore
    })
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="text-center text-sm font-medium text-gray-800 mb-2">Score</div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex-1">
          <div className="font-medium text-gray-700">Team 1</div>
          <div className="flex gap-1 mt-1">
            {score.team1.map((setScore, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => updateScore("team1", index, true)}
                  className="w-6 h-4 bg-gray-100 hover:bg-gray-200 rounded-t text-xs flex items-center justify-center"
                >
                  +
                </button>
                <div className="w-6 h-6 bg-white border border-gray-300 rounded text-xs flex items-center justify-center font-medium">
                  {setScore}
                </div>
                <button
                  onClick={() => updateScore("team1", index, false)}
                  className="w-6 h-4 bg-gray-100 hover:bg-gray-200 rounded-b text-xs flex items-center justify-center"
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="px-2 text-gray-600 font-bold">VS</div>
        <div className="flex-1">
          <div className="font-medium text-gray-700">Team 2</div>
          <div className="flex gap-1 mt-1">
            {score.team2.map((setScore, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  onClick={() => updateScore("team2", index, true)}
                  className="w-6 h-4 bg-gray-100 hover:bg-gray-200 rounded-t text-xs flex items-center justify-center"
                >
                  +
                </button>
                <div className="w-6 h-6 bg-white border border-gray-300 rounded text-xs flex items-center justify-center font-medium">
                  {setScore}
                </div>
                <button
                  onClick={() => updateScore("team2", index, false)}
                  className="w-6 h-4 bg-gray-100 hover:bg-gray-200 rounded-b text-xs flex items-center justify-center"
                >
                  -
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CourtManagement() {
  const [players, setPlayersState] = useState<Player[]>([])
  const [courts, setCourtsState] = useState<Court[]>([])
  const [draggingPlayer, setDraggingPlayer] = useState<Player | null>(null)
  const [isPeakHours, setIsPeakHours] = useState(true) // Simulate peak hours
  const { toast } = useToast()
  const dragPlayerRef = useRef<HTMLDivElement>(null)
  const dragImageRef = useRef<HTMLImageElement | null>(null)
  const [settings, setSettings] = useState(getGeneralSettings())
  const isMobile = useMobile()

  // Adicione estes novos estados
  const [playerGroups, setPlayerGroupsState] = useState<PlayerGroup[]>([])
  const [courtWaitingGroups, setCourtWaitingGroupsState] = useState<PlayerGroup[]>([])

  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [replacingPlayerId, setReplacingPlayerId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Estado para controlar qual seção está ativa no mobile
  const [activeSection, setActiveSection] = useState<"players" | "groups" | "waiting">("players")

  // Function to add a player back to the system (waiting list)
  const addPlayerToSystem = (player: Player) => {
    // Check if the player is already in the list
    if (!players.some((p) => p.id === player.id)) {
      // Add the player to the list with a default position
      const newPlayer = { ...player, position: players.length + 1, selected: false }
      const updatedPlayers = [...players, newPlayer]
      setPlayersState(updatedPlayers)
      setPlayers(updatedPlayers)
    }
  }

  // Load data from localStorage on component mount
  useEffect(() => {
    setPlayersState(getPlayers())
    setCourtsState(getCourts())
    setPlayerGroupsState(getPlayerGroups())
    setCourtWaitingGroupsState(getCourtWaitingPlayers())
    setSettings(getGeneralSettings())
  }, [])

  useEffect(() => {
    // Create a hidden drag image
    if (!dragImageRef.current) {
      const img = new Image()
      img.src = "/placeholder.svg?height=50&width=50"
      img.style.position = "absolute"
      img.style.top = "-1000px"
      img.style.left = "-1000px"
      img.style.opacity = "0"
      document.body.appendChild(img)
      dragImageRef.current = img
    }

    return () => {
      if (dragImageRef.current) {
        document.body.removeChild(dragImageRef.current)
      }
    }
  }, [])

  const handleDragStart = (player: Player, e: React.DragEvent) => {
    // Only allow dragging if the player is selected
    if (!player.selected) {
      e.preventDefault()
      toast({
        title: "Player not selected",
        description: "Please select this player before dragging",
        variant: "destructive",
      })
      return
    }

    setDraggingPlayer(player)
    if (dragImageRef.current && e.dataTransfer) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const togglePlayerSelection = (playerId: string) => {
    const selectedCount = players.filter((p) => p.selected).length
    const player = players.find((p) => p.id === playerId)

    // If player is already selected, always allow deselecting
    if (player?.selected) {
      const updatedPlayers = players.map((p) => (p.id === playerId ? { ...p, selected: false } : p))
      setPlayersState(updatedPlayers)
      setPlayers(updatedPlayers)
      return
    }

    // If player is not selected, check if we can select more
    if (isPeakHours) {
      // During peak hours, only allow selecting up to 4 players (doubles)
      if (selectedCount < 4) {
        const updatedPlayers = players.map((p) => (p.id === playerId ? { ...p, selected: true } : p))
        setPlayersState(updatedPlayers)
        setPlayers(updatedPlayers)
      } else {
        toast({
          title: "Maximum players selected",
          description: "You can only select up to 4 players for doubles during peak hours",
          variant: "destructive",
        })
      }
    } else {
      // During off-peak hours, allow selecting up to 2 players (singles) or 4 players (doubles)
      if (selectedCount < 4) {
        const updatedPlayers = players.map((p) => (p.id === playerId ? { ...p, selected: true } : p))
        setPlayersState(updatedPlayers)
        setPlayers(updatedPlayers)
      } else {
        toast({
          title: "Maximum players selected",
          description: "You can only select up to 4 players",
          variant: "destructive",
        })
      }
    }
  }

  // Função para encontrar a primeira quadra disponível
  const findFirstAvailableCourt = (): Court | undefined => {
    return courts.find((court) => court.status === "available")
  }

  // Função para alocar automaticamente um grupo para uma quadra
  const autoAllocateGroupToCourt = (group: PlayerGroup): boolean => {
    const availableCourt = findFirstAvailableCourt()

    if (availableCourt) {
      handleAssignGroupToCourt(availableCourt, group)
      return true
    }

    return false
  }

  const handleCreateGroup = () => {
    const selectedPlayers = players.filter((p) => p.selected)

    if (isPeakHours && selectedPlayers.length !== 4) {
      toast({
        title: "Invalid selection for Peak Hours",
        description: "During peak hours, you must select exactly 4 players for doubles",
        variant: "destructive",
      })
      return
    }

    if (!isPeakHours && selectedPlayers.length !== 2 && selectedPlayers.length !== 4) {
      toast({
        title: "Invalid selection",
        description: "Please select either 2 players for singles or 4 players for doubles",
        variant: "destructive",
      })
      return
    }

    const groupType = selectedPlayers.length === 2 ? "singles" : "doubles"

    // Verificar se todos os jogadores já fizeram check-in
    const allCheckedIn = selectedPlayers.every((player) => player.isCheckedIn)

    // Criar o grupo com o status de prontidão baseado no check-in dos jogadores
    const newGroup = {
      ...createPlayerGroup(selectedPlayers, groupType),
      isReady: allCheckedIn,
    }

    // Remover jogadores selecionados da lista de espera
    const updatedPlayers = players.filter((p) => !p.selected)
    const playersWithUpdatedPositions = updatePlayerPositions(updatedPlayers)

    setPlayersState(playersWithUpdatedPositions)
    setPlayers(playersWithUpdatedPositions)

    // Se todos os jogadores já fizeram check-in
    if (allCheckedIn) {
      // Se a alocação automática estiver ativada, tente alocar para uma quadra disponível
      if (settings.autoAllocateGroups) {
        const allocated = autoAllocateGroupToCourt(newGroup)

        // Se não foi possível alocar para uma quadra, adicione à lista de espera de quadra
        if (!allocated) {
          setCourtWaitingGroupsState((prev) => [newGroup, ...prev])
          setCourtWaitingPlayers((prev) => [newGroup, ...prev])

          toast({
            title: "Group ready for court",
            description: `${groupType === "singles" ? "Singles" : "Doubles"} group added to court waiting list`,
          })
        }
      } else {
        // Se a alocação automática estiver desativada, adicione à lista de espera de quadra
        setCourtWaitingGroupsState((prev) => [newGroup, ...prev])
        setCourtWaitingPlayers((prev) => [newGroup, ...prev])

        toast({
          title: "Group ready for court",
          description: `${groupType === "singles" ? "Singles" : "Doubles"} group added to court waiting list`,
        })
      }

      // No mobile, mude para a seção de espera de quadra
      if (isMobile) {
        setActiveSection("waiting")
      }
    } else {
      // Se nem todos os jogadores fizeram check-in, adicione aos grupos de jogadores
      const updatedGroups = [newGroup, ...playerGroups]
      setPlayerGroupsState(updatedGroups)
      setPlayerGroups(updatedGroups)

      toast({
        title: "Group created",
        description: `${groupType === "singles" ? "Singles" : "Doubles"} group created with ${selectedPlayers.length} players`,
      })

      // No mobile, mude para a seção de grupos
      if (isMobile) {
        setActiveSection("groups")
      }
    }
  }

  const handlePlayerCheckIn = (playerId: string, groupId?: string) => {
    checkInPlayer(playerId)

    // Recarregar dados
    setPlayersState(getPlayers())

    // Se um groupId foi fornecido, atualize apenas esse grupo
    if (groupId) {
      const updatedGroups = playerGroups.map((group) => {
        if (group.id === groupId) {
          const updatedPlayers = group.players.map((player) =>
            player.id === playerId ? { ...player, isCheckedIn: true } : player,
          )

          const allCheckedIn = updatedPlayers.every((p) => p.isCheckedIn)

          return {
            ...group,
            players: updatedPlayers,
            isReady: allCheckedIn,
          }
        }
        return group
      })

      // Verificar se algum grupo está pronto para ir para Court Waiting
      const readyGroups = updatedGroups.filter((g) => g.isReady)
      const pendingGroups = updatedGroups.filter((g) => !g.isReady)

      if (readyGroups.length > 0) {
        // Se a alocação automática estiver ativada, tente alocar os grupos prontos para quadras disponíveis
        if (settings.autoAllocateGroups) {
          const remainingReadyGroups = readyGroups.filter((group) => {
            // Tenta alocar o grupo para uma quadra disponível
            // Se não conseguir, retorna true para manter o grupo na lista de espera
            return !autoAllocateGroupToCourt(group)
          })

          // Adicione os grupos restantes (que não foram alocados) à lista de espera de quadra
          if (remainingReadyGroups.length > 0) {
            setCourtWaitingGroupsState((prev) => [...prev, ...remainingReadyGroups])
            setCourtWaitingPlayers((prev) => [...prev, ...remainingReadyGroups])
          }
        } else {
          // Se a alocação automática estiver desativada, apenas mova os grupos para Court Waiting
          setCourtWaitingGroupsState((prev) => [...prev, ...readyGroups])
          setCourtWaitingPlayers((prev) => [...prev, ...readyGroups])
        }

        setPlayerGroupsState(pendingGroups)
        setPlayerGroups(pendingGroups)

        // No mobile, mude para a seção de espera de quadra se todos os jogadores do grupo fizeram check-in
        if (isMobile && readyGroups.length > 0) {
          setActiveSection("waiting")
        }
      } else {
        setPlayerGroupsState(updatedGroups)
        setPlayerGroups(updatedGroups)
      }
    } else {
      // Recarregar todos os dados
      setPlayerGroupsState(getPlayerGroups())
      setCourtWaitingGroupsState(getCourtWaitingPlayers())
    }

    toast({
      title: "Check-in confirmed",
      description: "Player check-in has been confirmed",
    })
  }

  const handleAssignGroupToCourt = (court: Court, group: PlayerGroup) => {
    if (court.status !== "available") {
      toast({
        title: "Court not available",
        description: `${court.name} is currently ${getStatusDisplayText(court.status).toLowerCase()}.`,
        variant: "destructive",
      })
      return
    }

    // Atualizar quadras
    const updatedCourts = courts.map((c) => {
      if (c.id === court.id) {
        // Calcular end time (90 minutos a partir de agora)
        const now = new Date()
        const endTime = new Date(now.getTime() + 90 * 60000)

        return {
          ...c,
          status: "in-use",
          players: group.players,
          startTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          endTime: endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      }
      return c
    })

    // Remover o grupo da lista de espera de quadra
    const updatedCourtWaitingGroups = courtWaitingGroups.filter((g) => g.id !== group.id)

    setCourtsState(updatedCourts)
    setCourts(updatedCourts)
    setCourtWaitingGroupsState(updatedCourtWaitingGroups)
    setCourtWaitingPlayers(updatedCourtWaitingGroups)

    toast({
      title: "Court allocated",
      description: `${group.type === "singles" ? "Singles" : "Doubles"} group assigned to ${court.name}`,
    })
  }

  const handleEditGroup = (groupId: string) => {
    setEditingGroupId(groupId)
    setShowEditModal(true)
  }

  const handleReplacePlayer = (playerId: string) => {
    setReplacingPlayerId(playerId)
  }

  const handleConfirmReplacement = (newPlayerId: string) => {
    if (!editingGroupId || !replacingPlayerId) return

    // Encontrar o grupo que está sendo editado
    const groupToEdit = playerGroups.find((g) => g.id === editingGroupId)
    if (!groupToEdit) return

    // Encontrar o jogador que será substituído
    const playerToReplace = groupToEdit.players.find((p) => p.id === replacingPlayerId)
    if (!playerToReplace) return

    // Encontrar o novo jogador na lista de espera
    const newPlayer = players.find((p) => p.id === newPlayerId)
    if (!newPlayer) return

    // Criar uma cópia atualizada do grupo com o jogador substituído
    const updatedGroup = {
      ...groupToEdit,
      players: groupToEdit.players.map((p) =>
        p.id === replacingPlayerId
          ? { ...newPlayer, groupId: groupToEdit.id, isCheckedIn: newPlayer.isCheckedIn || false }
          : p,
      ),
      // Verificar se todos os jogadores do grupo atualizado têm check-in
      isReady: groupToEdit.players
        .map((p) => (p.id === replacingPlayerId ? newPlayer.isCheckedIn || false : p.isCheckedIn || false))
        .every((checked) => checked),
    }

    // Atualizar os grupos
    const updatedGroups = playerGroups.map((g) => (g.id === editingGroupId ? updatedGroup : g))

    // Remover o novo jogador da lista de espera
    const updatedPlayers = players.filter((p) => p.id !== newPlayerId)
    const playersWithUpdatedPositions = updatePlayerPositions(updatedPlayers)

    // Atualizar estados e localStorage
    setPlayerGroupsState(updatedGroups)
    setPlayerGroups(updatedGroups)
    setPlayersState(playersWithUpdatedPositions)
    setPlayers(playersWithUpdatedPositions)

    // Adicionar o jogador substituído de volta à lista de espera
    const playerToAddBack = {
      ...playerToReplace,
      position: playersWithUpdatedPositions.length + 1,
      selected: false,
      groupId: undefined,
    }

    const playersWithAddedBack = [...playersWithUpdatedPositions, playerToAddBack]
    const finalPlayersWithPositions = updatePlayerPositions(playersWithAddedBack)

    setPlayersState(finalPlayersWithPositions)
    setPlayers(finalPlayersWithPositions)

    // Limpar estados de edição
    setEditingGroupId(null)
    setReplacingPlayerId(null)
    setShowEditModal(false)

    toast({
      title: "Player replaced",
      description: `${playerToReplace.name} has been replaced with ${newPlayer.name} in the group`,
    })
  }

  const handleCancelEdit = () => {
    setEditingGroupId(null)
    setReplacingPlayerId(null)
    setShowEditModal(false)
  }

  const handleDrop = (court: Court, e: React.DragEvent) => {
    e.preventDefault()

    const groupId = e.dataTransfer.getData("groupId")

    if (groupId) {
      // Estamos arrastando um grupo
      const group = courtWaitingGroups.find((g) => g.id === groupId)
      if (group) {
        handleAssignGroupToCourt(court, group)
      }
      return
    }

    // O código existente para arrastar jogadores individuais continua aqui...
    if (!draggingPlayer) return

    // Check if court is available
    if (court.status !== "available") {
      toast({
        title: "Court not available",
        description: `${court.name} is currently ${getStatusDisplayText(court.status).toLowerCase()}.`,
        variant: "destructive",
      })
      return
    }

    // Get all selected players
    const selectedPlayers = players.filter((p) => p.selected)

    // Check if we have enough players for a game
    if (isPeakHours && selectedPlayers.length !== 4) {
      toast({
        title: "Incorrect number of players",
        description: "During peak hours, you must select exactly 4 players for doubles",
        variant: "destructive",
      })
      return
    }

    if (!isPeakHours && selectedPlayers.length !== 2 && selectedPlayers.length !== 4) {
      toast({
        title: "Incorrect number of players",
        description: "Please select either 2 players for singles or 4 players for doubles",
        variant: "destructive",
      })
      return
    }

    // Add all selected players to the system
    selectedPlayers.forEach((player) => {
      addPlayerToSystem(player)
    })

    // Update courts
    const updatedCourts = courts.map((c) => {
      if (c.id === court.id) {
        // Calculate end time (90 minutes from now)
        const now = new Date()
        const endTime = new Date(now.getTime() + 90 * 60000)

        return {
          ...c,
          status: "in-use",
          players: selectedPlayers,
          startTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          endTime: endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      }
      return c
    })

    // Remove allocated players from waiting list
    const updatedPlayers = players.filter((p) => !selectedPlayers.some((sp) => sp.id === p.id))

    // Update positions for remaining players
    const playersWithUpdatedPositions = updatePlayerPositions(updatedPlayers)

    setCourtsState(updatedCourts)
    setPlayersState(playersWithUpdatedPositions)

    // Update localStorage
    setCourts(updatedCourts)
    setPlayers(playersWithUpdatedPositions)

    toast({
      title: "Court allocated",
      description: `${selectedPlayers.length} players assigned to ${court.name}`,
    })
  }

  const handleEndSession = (court: Court) => {
    // Primeiro, garantir que todos os jogadores da quadra estejam no sistema
    if (court.players && court.players.length > 0) {
      court.players.forEach((player) => {
        addPlayerToSystem(player)
      })
    }

    const updatedCourts = courts.map((c) => {
      if (c.id === court.id) {
        return {
          ...c,
          status: "available",
          players: [],
          startTime: undefined,
          endTime: undefined,
        }
      }
      return c
    })

    setCourtsState(updatedCourts)

    // Update localStorage
    setCourts(updatedCourts)

    // Verificar se há grupos prontos esperando por quadras
    if (settings.autoAllocateGroups && courtWaitingGroups.length > 0) {
      // Tente alocar o primeiro grupo da lista para a quadra que acabou de ficar disponível
      const firstGroup = courtWaitingGroups[0]
      const updatedCourt = updatedCourts.find((c) => c.id === court.id)

      if (updatedCourt) {
        handleAssignGroupToCourt(updatedCourt, firstGroup)
      }
    }

    toast({
      title: "Session ended",
      description: `${court.name} is now available`,
    })
  }

  // Renderização para mobile
  const renderMobileView = () => {
    return (
      <>
        {/* Tabs para navegação mobile */}
        <div className="flex border-b mb-4">
          <button
            className={`flex-1 py-2 px-4 text-center ${activeSection === "players" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveSection("players")}
          >
            Players ({players.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeSection === "groups" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveSection("groups")}
          >
            Groups ({playerGroups.length})
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center ${activeSection === "waiting" ? "border-b-2 border-primary font-medium" : ""}`}
            onClick={() => setActiveSection("waiting")}
          >
            Waiting ({courtWaitingGroups.length})
          </button>
        </div>

        {/* Conteúdo baseado na seção ativa */}
        {activeSection === "players" && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Players Waiting ({players.length})</span>
                <div className="flex items-center gap-2">
                  {isPeakHours && (
                    <Badge variant="outline" className="ml-2">
                      Doubles Only
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm">
                {players.filter((p) => p.selected).length > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Selected: {players.filter((p) => p.selected).length} players</span>
                    {isPeakHours ? (
                      <Badge variant={players.filter((p) => p.selected).length === 4 ? "success" : "outline"}>
                        {players.filter((p) => p.selected).length}/4 for doubles
                      </Badge>
                    ) : (
                      <Badge
                        variant={
                          players.filter((p) => p.selected).length === 2 ||
                          players.filter((p) => p.selected).length === 4
                            ? "success"
                            : "outline"
                        }
                      >
                        {players.filter((p) => p.selected).length}/2 for singles or /4 for doubles
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {players.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No players waiting</div>
                ) : (
                  players.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                        player.selected ? "border-primary bg-primary/10" : ""
                      }`}
                      onClick={() => togglePlayerSelection(player.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            player.selected ? "bg-primary border-primary" : "border-muted-foreground"
                          }`}
                        >
                          {player.selected && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="w-3 h-3 text-primary-foreground"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          )}
                        </div>
                        <Avatar className="w-10 h-10 mr-3">
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {getPlayerInitials(player.name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Check-in: {player.checkInTime}
                        </div>
                      </div>
                      <div
                        className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                          player.isCheckedIn ? "bg-green-600 text-white" : "bg-black text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayerCheckIn(player.id)
                        }}
                      >
                        {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updatedPlayers = players.map((p) => ({ ...p, selected: false }))
                    setPlayersState(updatedPlayers)
                    setPlayers(updatedPlayers)
                  }}
                  disabled={!players.some((p) => p.selected)}
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleCreateGroup}
                  disabled={
                    isPeakHours
                      ? players.filter((p) => p.selected).length !== 4
                      : players.filter((p) => p.selected).length !== 2 && players.filter((p) => p.selected).length !== 4
                  }
                >
                  Create Group
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "groups" && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Player Groups ({playerGroups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {playerGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No player groups</div>
                ) : (
                  playerGroups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-4 rounded-lg ${group.isReady ? "border-2 border-green-500" : "border border-gray-300"}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {group.type === "singles" ? "Singles" : "Doubles"} Group
                          <span className="ml-2 text-xs text-muted-foreground">Created at {group.createdAt}</span>
                        </h3>
                        <Button variant="outline" size="sm" onClick={() => handleEditGroup(group.id)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.players.map((player) => (
                          <div
                            key={player.id}
                            className={`flex items-center p-2 rounded-lg cursor-pointer ${
                              player.isCheckedIn ? "bg-green-600 text-white" : "bg-black text-white"
                            } ${editingGroupId === group.id && replacingPlayerId === player.id ? "ring-2 ring-yellow-400" : ""}`}
                            onClick={() => handlePlayerCheckIn(player.id, group.id)}
                          >
                            <Avatar className="w-8 h-8 mr-2 border border-white">
                              <AvatarFallback className="bg-white/20 text-white text-xs">
                                {getPlayerInitials(player.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-medium truncate">{player.name}</div>
                              <div className="text-xs text-white/80">
                                {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeSection === "waiting" && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>Court Waiting ({courtWaitingGroups.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                {courtWaitingGroups.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No groups waiting for courts</div>
                ) : (
                  courtWaitingGroups.map((group) => (
                    <div key={group.id} className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">
                          {group.type === "singles" ? "Singles" : "Doubles"} Group
                          <span className="ml-2 text-xs text-muted-foreground">Created at {group.createdAt}</span>
                        </h3>
                        <Badge variant="success">Ready for Court</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {group.players.map((player) => (
                          <div key={player.id} className="flex items-center p-2 bg-green-600 text-white rounded-lg">
                            <Avatar className="w-8 h-8 mr-2 border border-white">
                              <AvatarFallback className="bg-white/20 text-white text-xs">
                                {getPlayerInitials(player.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-medium truncate">{player.name}</div>
                              <div className="text-xs text-white/80">Checked-In</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <WaitingTimer createdAt={group.createdAt} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </>
    )
  }

  // Renderização para desktop
  const renderDesktopView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Players Waiting Column */}
        <Card className="h-[calc(100vh-220px)] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Players Waiting ({players.length})</span>
              <div className="flex items-center gap-2">
                {isPeakHours && (
                  <Badge variant="outline" className="ml-2">
                    Doubles Only
                  </Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="mb-2 text-sm">
              {players.filter((p) => p.selected).length > 0 && (
                <div className="flex items-center justify-between">
                  <span>Selected: {players.filter((p) => p.selected).length} players</span>
                  {isPeakHours ? (
                    <Badge variant={players.filter((p) => p.selected).length === 4 ? "success" : "outline"}>
                      {players.filter((p) => p.selected).length}/4 for doubles
                    </Badge>
                  ) : (
                    <Badge
                      variant={
                        players.filter((p) => p.selected).length === 2 || players.filter((p) => p.selected).length === 4
                          ? "success"
                          : "outline"
                      }
                    >
                      {players.filter((p) => p.selected).length}/2 for singles or /4 for doubles
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              {players.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No players waiting</div>
              ) : (
                players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${
                      player.selected ? "border-primary bg-primary/10" : ""
                    }`}
                    onClick={() => togglePlayerSelection(player.id)}
                    draggable={player.selected}
                    onDragStart={(e) => handleDragStart(player, e)}
                    ref={draggingPlayer?.id === player.id ? dragPlayerRef : null}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          player.selected ? "bg-primary border-primary" : "border-muted-foreground"
                        }`}
                      >
                        {player.selected && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="w-3 h-3 text-primary-foreground"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <Avatar className="w-10 h-10 mr-3">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {getPlayerInitials(player.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Check-in: {player.checkInTime}
                      </div>
                    </div>
                    <div
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        player.isCheckedIn ? "bg-green-600 text-white" : "bg-black text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayerCheckIn(player.id)
                      }}
                    >
                      {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <div className="p-4 border-t mt-auto">
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const updatedPlayers = players.map((p) => ({ ...p, selected: false }))
                  setPlayersState(updatedPlayers)
                  setPlayers(updatedPlayers)
                }}
                disabled={!players.some((p) => p.selected)}
              >
                Clear Selection
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={
                  isPeakHours
                    ? players.filter((p) => p.selected).length !== 4
                    : players.filter((p) => p.selected).length !== 2 && players.filter((p) => p.selected).length !== 4
                }
              >
                Create Group
              </Button>
            </div>
          </div>
        </Card>

        {/* Player Groups Column */}
        <Card className="h-[calc(100vh-220px)] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Player Groups ({playerGroups.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {playerGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No player groups</div>
              ) : (
                playerGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 rounded-lg ${group.isReady ? "border-2 border-green-500" : "border border-gray-300"}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {group.type === "singles" ? "Singles" : "Doubles"} Group
                        <span className="ml-2 text-xs text-muted-foreground">Created at {group.createdAt}</span>
                      </h3>
                      <Button variant="outline" size="sm" onClick={() => handleEditGroup(group.id)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.players.map((player) => (
                        <div
                          key={player.id}
                          className={`flex items-center p-2 rounded-lg cursor-pointer ${
                            player.isCheckedIn ? "bg-green-600 text-white" : "bg-black text-white"
                          } ${editingGroupId === group.id && replacingPlayerId === player.id ? "ring-2 ring-yellow-400" : ""}`}
                          onClick={() => handlePlayerCheckIn(player.id, group.id)}
                        >
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {getPlayerInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium truncate">{player.name}</div>
                            <div className="text-xs text-white/80">
                              {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Court Waiting Column */}
        <Card className="h-[calc(100vh-220px)] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle>Court Waiting ({courtWaitingGroups.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <div className="space-y-2">
              {courtWaitingGroups.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No groups waiting for courts</div>
              ) : (
                courtWaitingGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 border-2 border-green-500 rounded-lg bg-green-50"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("groupId", group.id)
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {group.type === "singles" ? "Singles" : "Doubles"} Group
                        <span className="ml-2 text-xs text-muted-foreground">Created at {group.createdAt}</span>
                      </h3>
                      <Badge variant="success">Ready for Court</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {group.players.map((player) => (
                        <div key={player.id} className="flex items-center p-2 bg-green-600 text-white rounded-lg">
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {getPlayerInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium truncate">{player.name}</div>
                            <div className="text-xs text-white/80">Checked-In</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <WaitingTimer createdAt={group.createdAt} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Court Management</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center">
              <Badge variant={isPeakHours ? "destructive" : "outline"}>
                {isPeakHours ? "Peak Hours" : "Off-Peak Hours"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => setIsPeakHours(!isPeakHours)} className="ml-2">
                Toggle
              </Button>
            </div>
            <div className="flex items-center">
              <Badge variant={settings.autoAllocateGroups ? "success" : "outline"}>
                {settings.autoAllocateGroups ? "Auto Allocation: ON" : "Auto Allocation: OFF"}
              </Badge>
            </div>
            <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Renderização condicional baseada no tamanho da tela */}
        {isMobile ? renderMobileView() : renderDesktopView()}

        {/* Courts Section */}
        <h2 className="text-xl font-bold mb-4">Courts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Updated court card rendering to include timer and score for in-use courts */}
          {courts.map((court) => (
            <div
              key={court.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                court.status === "available"
                  ? "border-green-300 hover:border-green-400"
                  : court.status === "in-use"
                    ? "border-blue-300"
                    : court.status === "maintenance"
                      ? "border-orange-300"
                      : court.status === "tournament"
                        ? "border-red-300"
                        : "border-purple-300"
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, court)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">{court.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    court.status === "available"
                      ? "bg-green-100 text-green-800"
                      : court.status === "in-use"
                        ? "bg-blue-100 text-blue-800"
                        : court.status === "maintenance"
                          ? "bg-orange-100 text-orange-800"
                          : court.status === "tournament"
                            ? "bg-red-100 text-red-800"
                            : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {getStatusDisplayText(court.status)}
                </span>
              </div>

              {court.status === "in-use" && court.players && court.players.length > 0 && (
                <>
                  <div className="text-sm text-gray-600 mb-3">
                    {court.startTime} - {court.endTime}
                  </div>
                  <div className="space-y-3 mb-3">
                    {court.players.map((player, index) => {
                      const playerStats = {
                        games: index === 0 ? 6 : index === 1 ? 3 : index === 2 ? 4 : 2,
                        sets: index === 0 ? 2 : index === 1 ? 1 : index === 2 ? 1 : 0,
                      }

                      return (
                        <div key={player.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {getPlayerInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {player.name.length > 15 ? `${player.name.substring(0, 15)}...` : player.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Games: {playerStats.games} | Sets: {playerStats.sets}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-center mb-3">
                    <button
                      onClick={() => handleEndSession(court)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      End Session
                    </button>
                  </div>
                  <PlayingTimer startTime={court.startTime || "00:00"} />
                  <ScoreDisplay courtId={court.id} />
                </>
              )}

              {court.status === "available" && (
                <div className="h-24 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Drag groups here</p>
                </div>
              )}

              {court.status === "maintenance" && (
                <div className="h-24 flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Under maintenance</p>
                  </div>
                </div>
              )}

              {court.status === "tournament" && (
                <div className="h-24 flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Reserved for tournament</p>
                  </div>
                </div>
              )}

              {court.status === "classes" && (
                <div className="h-24 flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    <p>Reserved for classes</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Modal de edição de grupo */}
        {showEditModal && editingGroupId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Edit Group</h3>

              {/* Mostrar jogadores do grupo */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Select player to replace:</h4>
                <div className="space-y-2">
                  {playerGroups
                    .find((g) => g.id === editingGroupId)
                    ?.players.map((player) => (
                      <div
                        key={player.id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer border ${
                          replacingPlayerId === player.id ? "border-primary bg-primary/10" : "border-gray-200"
                        }`}
                        onClick={() => handleReplacePlayer(player.id)}
                      >
                        <Avatar className="w-8 h-8 mr-2">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {getPlayerInitials(player.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Mostrar jogadores disponíveis para substituição */}
              {replacingPlayerId && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Select replacement player:</h4>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {players.length === 0 ? (
                      <div className="text-center py-2 text-muted-foreground">No players available</div>
                    ) : (
                      players.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center p-2 rounded-lg cursor-pointer border border-gray-200 hover:bg-muted/50"
                          onClick={() => handleConfirmReplacement(player.id)}
                        >
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {getPlayerInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{player.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {player.isCheckedIn ? "Checked-In" : "Waiting Check-in"}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
