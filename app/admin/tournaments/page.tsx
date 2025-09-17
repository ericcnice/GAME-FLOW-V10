"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Play, Crown, Award } from "lucide-react"
import { toast } from "sonner"

interface Player {
  id: string
  name: string
  slug: string
  ranking: number
  points: number
  photo?: string
}

interface Match {
  id: string
  player1: Player | null
  player2: Player | null
  winner: Player | null
  score?: string
  round: string
  position: number
}

interface Tournament {
  id: string
  name: string
  status: "setup" | "in-progress" | "completed"
  players: Player[]
  bracket: Match[]
  winner?: Player
  createdAt: string
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null)
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<string>("8")

  useEffect(() => {
    loadTournaments()
    loadPlayers()
  }, [])

  const loadTournaments = () => {
    try {
      const savedTournaments = localStorage.getItem("tennis-tournaments")
      if (savedTournaments) {
        const tournaments = JSON.parse(savedTournaments)
        setTournaments(tournaments)
        const activeTournament = tournaments.find((t: Tournament) => t.status !== "completed")
        if (activeTournament) {
          setCurrentTournament(activeTournament)
        }
      }
    } catch (error) {
      console.error("Error loading tournaments:", error)
    }
  }

  const loadPlayers = () => {
    try {
      const savedPlayers = localStorage.getItem("tennis-players")
      if (savedPlayers) {
        const players = JSON.parse(savedPlayers)
        const activePlayers = players
          .filter((p: any) => p.status === "active")
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            ranking: p.ranking,
            points: p.points,
            photo: p.photo,
          }))
          .sort((a: Player, b: Player) => a.ranking - b.ranking)
        setAvailablePlayers(activePlayers)
      }
    } catch (error) {
      console.error("Error loading players:", error)
    }
  }

  const generateBracket = (playerCount: number) => {
    if (availablePlayers.length < playerCount) {
      toast.error(`Não há jogadores suficientes. Disponíveis: ${availablePlayers.length}`)
      return
    }

    // Select top players by ranking
    const selectedPlayers = availablePlayers.slice(0, playerCount)

    // Create tournament bracket
    const bracket: Match[] = []
    let matchId = 1

    // Generate first round matches
    const rounds = Math.log2(playerCount)
    let currentRoundMatches = playerCount / 2

    // First round (Quarterfinals for 8 players, etc.)
    for (let i = 0; i < currentRoundMatches; i++) {
      bracket.push({
        id: `match-${matchId++}`,
        player1: selectedPlayers[i * 2],
        player2: selectedPlayers[i * 2 + 1],
        winner: null,
        round: getRoundName(rounds, 1),
        position: i,
      })
    }

    // Generate subsequent rounds
    for (let round = 2; round <= rounds; round++) {
      currentRoundMatches = currentRoundMatches / 2
      for (let i = 0; i < currentRoundMatches; i++) {
        bracket.push({
          id: `match-${matchId++}`,
          player1: null,
          player2: null,
          winner: null,
          round: getRoundName(rounds, round),
          position: i,
        })
      }
    }

    const tournament: Tournament = {
      id: `tournament-${Date.now()}`,
      name: `Torneio ${new Date().toLocaleDateString("pt-BR")}`,
      status: "in-progress",
      players: selectedPlayers,
      bracket,
      createdAt: new Date().toISOString(),
    }

    const updatedTournaments = [...tournaments, tournament]
    setTournaments(updatedTournaments)
    setCurrentTournament(tournament)
    localStorage.setItem("tennis-tournaments", JSON.stringify(updatedTournaments))

    toast.success(`Torneio criado com ${playerCount} jogadores!`)
  }

  const getRoundName = (totalRounds: number, currentRound: number): string => {
    const roundsFromEnd = totalRounds - currentRound + 1
    switch (roundsFromEnd) {
      case 1:
        return "Final"
      case 2:
        return "Semifinal"
      case 3:
        return "Quartas de Final"
      case 4:
        return "Oitavas de Final"
      default:
        return `Rodada ${currentRound}`
    }
  }

  const simulateMatch = (match: Match) => {
    if (!match.player1 || !match.player2) return

    // Simple simulation based on ranking (lower ranking = better player)
    const player1Strength = 1000 - match.player1.ranking * 10 + Math.random() * 200
    const player2Strength = 1000 - match.player2.ranking * 10 + Math.random() * 200

    const winner = player1Strength > player2Strength ? match.player1 : match.player2
    const loser = winner === match.player1 ? match.player2 : match.player1

    // Generate realistic tennis score
    const scores = ["6-4, 6-3", "6-2, 6-4", "7-5, 6-4", "6-3, 7-6", "6-4, 3-6, 6-2", "7-6, 6-4", "6-1, 6-3", "6-4, 6-2"]
    const score = scores[Math.floor(Math.random() * scores.length)]

    // Update match
    const updatedMatch = {
      ...match,
      winner,
      score,
    }

    // Update tournament bracket
    if (currentTournament) {
      const updatedBracket = currentTournament.bracket.map((m) => (m.id === match.id ? updatedMatch : m))

      // Advance winner to next round
      const nextRoundMatch = findNextRoundMatch(match, updatedBracket)
      if (nextRoundMatch) {
        const updatedNextMatch = {
          ...nextRoundMatch,
          [nextRoundMatch.player1 ? "player2" : "player1"]: winner,
        }
        updatedBracket[updatedBracket.findIndex((m) => m.id === nextRoundMatch.id)] = updatedNextMatch
      }

      const updatedTournament = {
        ...currentTournament,
        bracket: updatedBracket,
        winner: nextRoundMatch?.round === "Final" && winner ? winner : currentTournament.winner,
        status: nextRoundMatch?.round === "Final" && winner ? ("completed" as const) : currentTournament.status,
      }

      setCurrentTournament(updatedTournament)
      const updatedTournaments = tournaments.map((t) => (t.id === updatedTournament.id ? updatedTournament : t))
      setTournaments(updatedTournaments)
      localStorage.setItem("tennis-tournaments", JSON.stringify(updatedTournaments))

      toast.success(`${winner.name} venceu!`)
    }
  }

  const findNextRoundMatch = (currentMatch: Match, bracket: Match[]): Match | null => {
    const rounds = ["Quartas de Final", "Semifinal", "Final"]
    const currentRoundIndex = rounds.indexOf(currentMatch.round)
    if (currentRoundIndex === -1 || currentRoundIndex === rounds.length - 1) return null

    const nextRound = rounds[currentRoundIndex + 1]
    const nextRoundMatches = bracket.filter((m) => m.round === nextRound)
    const nextMatchPosition = Math.floor(currentMatch.position / 2)

    return nextRoundMatches[nextMatchPosition] || null
  }

  const resetTournament = () => {
    setCurrentTournament(null)
    toast.success("Torneio resetado!")
  }

  const renderBracket = () => {
    if (!currentTournament) return null

    const rounds = ["Quartas de Final", "Semifinal", "Final"]
    const bracketRounds = rounds.map((roundName) =>
      currentTournament.bracket.filter((match) => match.round === roundName),
    )

    return (
      <div className="flex justify-center items-center gap-8 overflow-x-auto pb-4">
        {bracketRounds.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex flex-col gap-4 min-w-[250px]">
            <h3 className="text-center font-bold text-lg mb-4">{rounds[roundIndex]}</h3>
            <div className="flex flex-col gap-6">
              {roundMatches.map((match) => (
                <Card key={match.id} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Player 1 */}
                      <div
                        className={`flex items-center gap-3 p-2 rounded ${
                          match.winner?.id === match.player1?.id
                            ? "bg-green-100 border-green-500 border"
                            : "bg-muted/50"
                        }`}
                      >
                        {match.player1 ? (
                          <>
                            <img
                              src={match.player1.photo || "/placeholder.svg"}
                              alt={match.player1.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{match.player1.name}</div>
                              <div className="text-xs text-muted-foreground">#{match.player1.ranking}</div>
                            </div>
                            {match.winner?.id === match.player1.id && <Crown className="h-4 w-4 text-yellow-500" />}
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">Aguardando...</div>
                        )}
                      </div>

                      {/* VS */}
                      <div className="text-center text-xs text-muted-foreground">VS</div>

                      {/* Player 2 */}
                      <div
                        className={`flex items-center gap-3 p-2 rounded ${
                          match.winner?.id === match.player2?.id
                            ? "bg-green-100 border-green-500 border"
                            : "bg-muted/50"
                        }`}
                      >
                        {match.player2 ? (
                          <>
                            <img
                              src={match.player2.photo || "/placeholder.svg"}
                              alt={match.player2.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{match.player2.name}</div>
                              <div className="text-xs text-muted-foreground">#{match.player2.ranking}</div>
                            </div>
                            {match.winner?.id === match.player2.id && <Crown className="h-4 w-4 text-yellow-500" />}
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">Aguardando...</div>
                        )}
                      </div>

                      {/* Score and Action */}
                      {match.score ? (
                        <div className="text-center">
                          <div className="text-sm font-medium">{match.score}</div>
                        </div>
                      ) : match.player1 && match.player2 ? (
                        <Button size="sm" onClick={() => simulateMatch(match)} className="w-full" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Simular
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Torneios
          </h1>
          <p className="text-muted-foreground">Gerencie torneios e chaves de eliminação</p>
        </div>

        {!currentTournament ? (
          <div className="space-y-6">
            {/* Tournament Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Criar Novo Torneio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Número de Jogadores</label>
                    <Select value={selectedPlayerCount} onValueChange={setSelectedPlayerCount}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Jogadores</SelectItem>
                        <SelectItem value="8">8 Jogadores</SelectItem>
                        <SelectItem value="16">16 Jogadores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">Jogadores Disponíveis</label>
                    <div className="text-2xl font-bold text-green-600">{availablePlayers.length}</div>
                  </div>
                </div>

                <Button
                  onClick={() => generateBracket(Number.parseInt(selectedPlayerCount))}
                  className="w-full"
                  disabled={availablePlayers.length < Number.parseInt(selectedPlayerCount)}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Gerar Chave do Torneio
                </Button>
              </CardContent>
            </Card>

            {/* Previous Tournaments */}
            {tournaments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Torneios Anteriores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tournaments
                      .filter((t) => t.status === "completed")
                      .slice(-5)
                      .map((tournament) => (
                        <div key={tournament.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{tournament.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(tournament.createdAt).toLocaleDateString("pt-BR")} • {tournament.players.length}{" "}
                              jogadores
                            </div>
                          </div>
                          {tournament.winner && (
                            <div className="flex items-center gap-2">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{tournament.winner.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tournament Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {currentTournament.name}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {currentTournament.players.length} jogadores •{" "}
                      <Badge variant={currentTournament.status === "completed" ? "default" : "secondary"}>
                        {currentTournament.status === "completed" ? "Finalizado" : "Em Andamento"}
                      </Badge>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {currentTournament.status === "completed" && currentTournament.winner && (
                      <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg">
                        <Crown className="h-4 w-4" />
                        <span className="font-medium">Campeão: {currentTournament.winner.name}</span>
                      </div>
                    )}
                    <Button variant="outline" onClick={resetTournament}>
                      Novo Torneio
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tournament Bracket */}
            <Card>
              <CardHeader>
                <CardTitle>Chave do Torneio</CardTitle>
              </CardHeader>
              <CardContent>{renderBracket()}</CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
