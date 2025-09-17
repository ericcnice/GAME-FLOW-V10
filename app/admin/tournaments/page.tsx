"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Users, Calendar, Play, Crown, Award, Share2, X } from "lucide-react"
import { toast } from "sonner"

interface Player {
  id: string
  name: string
  slug: string
  ranking: number
  points: number
  photo?: string
  wins?: number
  losses?: number
  lastMatch?: string
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
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

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
            wins: Math.floor(Math.random() * 20) + 5,
            losses: Math.floor(Math.random() * 10) + 2,
            lastMatch: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
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

    const selectedPlayers = availablePlayers.slice(0, playerCount)

    const bracket: Match[] = []
    let matchId = 1

    const rounds = Math.log2(playerCount)
    let currentRoundMatches = playerCount / 2

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
      case 5:
        return "Primeira Rodada"
      default:
        return `Rodada ${currentRound}`
    }
  }

  const simulateMatch = (match: Match) => {
    if (!match.player1 || !match.player2) return

    const player1Strength = 1000 - match.player1.ranking * 10 + Math.random() * 200
    const player2Strength = 1000 - match.player2.ranking * 10 + Math.random() * 200

    const winner = player1Strength > player2Strength ? match.player1 : match.player2
    const loser = winner === match.player1 ? match.player2 : match.player1

    const scores = ["6-4, 6-3", "6-2, 6-4", "7-5, 6-4", "6-3, 7-6", "6-4, 3-6, 6-2", "7-6, 6-4", "6-1, 6-3", "6-4, 6-2"]
    const score = scores[Math.floor(Math.random() * scores.length)]

    const updatedMatch = {
      ...match,
      winner,
      score,
    }

    if (currentTournament) {
      const updatedBracket = currentTournament.bracket.map((m) => (m.id === match.id ? updatedMatch : m))

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
    const rounds = ["Primeira Rodada", "Oitavas de Final", "Quartas de Final", "Semifinal", "Final"]
    const currentRoundIndex = rounds.indexOf(currentMatch.round)
    if (currentRoundIndex === -1 || currentRoundIndex === rounds.length - 1) return null

    const nextRound = rounds[currentRoundIndex + 1]
    const nextRoundMatches = bracket.filter((m) => m.round === nextRound)
    const nextMatchPosition = Math.floor(currentMatch.position / 2)

    return nextRoundMatches[nextMatchPosition] || null
  }

  const resetTournament = () => {
    setCurrentTournament(null)
    setExpandedMatch(null)
    toast.success("Torneio resetado!")
  }

  const shareMatch = async (match: Match) => {
    if (!match.player1 || !match.player2) return

    const matchText = `🎾 ${match.player1.name} vs ${match.player2.name}\n${match.round} - ${currentTournament?.name}\n\n#TennisCourtManager`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Partida de Tênis",
          text: matchText,
        })
      } catch (error) {
        navigator.clipboard.writeText(matchText)
        toast.success("Link copiado para a área de transferência!")
      }
    } else {
      navigator.clipboard.writeText(matchText)
      toast.success("Texto copiado para a área de transferência!")
    }
  }

  const shareToWhatsApp = (match: Match) => {
    if (!match.player1 || !match.player2) return

    const matchText = `🎾 ${match.player1.name} vs ${match.player2.name}\n${match.round} - ${currentTournament?.name}\n\n#TennisCourtManager`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(matchText)}`
    window.open(whatsappUrl, "_blank")
  }

  const renderBracket = () => {
    if (!currentTournament) return null

    const allRounds = ["Primeira Rodada", "Oitavas de Final", "Quartas de Final", "Semifinal", "Final"]
    const tournamentRounds = allRounds.filter((roundName) =>
      currentTournament.bracket.some((match) => match.round === roundName),
    )

    const bracketRounds = tournamentRounds.map((roundName) =>
      currentTournament.bracket.filter((match) => match.round === roundName),
    )

    return (
      <div className="flex justify-center items-center gap-8 overflow-x-auto pb-4">
        {bracketRounds.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex flex-col gap-4 min-w-[250px]">
            <h3 className="text-center font-bold text-lg mb-4">{tournamentRounds[roundIndex]}</h3>
            <div className="flex flex-col gap-6">
              {roundMatches.map((match) => (
                <div key={match.id} className="relative">
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      expandedMatch === match.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setExpandedMatch(expandedMatch === match.id ? null : match.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
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
                                src={
                                  match.player1.photo ||
                                  `/placeholder.svg?height=32&width=32&text=${match.player1.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`
                                }
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

                        <div className="text-center text-xs text-muted-foreground">VS</div>

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
                                src={
                                  match.player2.photo ||
                                  `/placeholder.svg?height=32&width=32&text=${match.player2.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`
                                }
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

                        {match.score ? (
                          <div className="text-center">
                            <div className="text-sm font-medium">{match.score}</div>
                          </div>
                        ) : match.player1 && match.player2 ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              simulateMatch(match)
                            }}
                            className="w-full"
                            variant="outline"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Simular
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>

                  {expandedMatch === match.id && match.player1 && match.player2 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-2 animate-in slide-in-from-top-2 duration-300">
                      <Card className="border-2 border-blue-500 shadow-xl">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Head-to-Head</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedMatch(null)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center space-y-2">
                              <img
                                src={
                                  match.player1.photo ||
                                  `/placeholder.svg?height=64&width=64&text=${match.player1.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`
                                }
                                alt={match.player1.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto"
                              />
                              <div className="font-medium">{match.player1.name}</div>
                              <div className="text-sm text-muted-foreground">Ranking #{match.player1.ranking}</div>
                              <div className="text-xs space-y-1">
                                <div>Vitórias: {match.player1.wins}</div>
                                <div>Derrotas: {match.player1.losses}</div>
                                <div>Último jogo: {match.player1.lastMatch}</div>
                              </div>
                            </div>
                            <div className="text-center space-y-2">
                              <img
                                src={
                                  match.player2.photo ||
                                  `/placeholder.svg?height=64&width=64&text=${match.player2.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`
                                }
                                alt={match.player2.name}
                                className="w-16 h-16 rounded-full object-cover mx-auto"
                              />
                              <div className="font-medium">{match.player2.name}</div>
                              <div className="text-sm text-muted-foreground">Ranking #{match.player2.ranking}</div>
                              <div className="text-xs space-y-1">
                                <div>Vitórias: {match.player2.wins}</div>
                                <div>Derrotas: {match.player2.losses}</div>
                                <div>Último jogo: {match.player2.lastMatch}</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                shareToWhatsApp(match)
                              }}
                              className="flex-1"
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              WhatsApp
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                shareMatch(match)
                              }}
                              className="flex-1"
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              Compartilhar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
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
