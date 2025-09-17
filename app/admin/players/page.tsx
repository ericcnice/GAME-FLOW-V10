"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Trophy,
  TrendingUp,
  History,
  Lightbulb,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  User,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"

interface Player {
  id: string
  name: string
  slug: string
  email: string
  phone: string
  cpf: string
  category: string
  level: string
  status: "active" | "inactive" | "suspended"
  registrationDate: string
  lastActivity: string
  lastCheckIn: string
  photo?: string
  ranking: number
  wins: number
  losses: number
  winRate: number
  points: number
  gender?: "male" | "female"
}

const generateMockPlayers = (): Player[] => {
  const requiredPlayers = [
    { name: "Heloisa Bertelli", slug: "@heloisa.bertelli", gender: "female" as const },
    { name: "Yasmim Costa", slug: "@yasmim.costa", gender: "female" as const },
    { name: "Manuel Cunha", slug: "@manuel.cunha", gender: "male" as const },
    { name: "Pedro Cunha", slug: "@pedro.cunha", gender: "male" as const },
    { name: "Eric Nice", slug: "@eric.nice", gender: "male" as const },
  ]

  const maleNames = [
    "Bruno",
    "Carlos",
    "Eduardo",
    "Gabriel",
    "Igor",
    "Lucas",
    "Nicolas",
    "Paulo",
    "Sergio",
    "Victor",
    "André",
    "Caio",
    "Enzo",
    "Gustavo",
    "João",
    "Leonardo",
    "Nathan",
    "Rafael",
    "Thiago",
    "William",
    "Alessandro",
    "Cesar",
    "Emilio",
    "Henrique",
    "Jorge",
    "Marcelo",
    "Oscar",
    "Ricardo",
    "Tomas",
    "Vinicius",
  ]

  const femaleNames = [
    "Ana",
    "Diana",
    "Fernanda",
    "Helena",
    "Julia",
    "Mariana",
    "Olivia",
    "Rafaela",
    "Tatiana",
    "Zoe",
    "Beatriz",
    "Daniela",
    "Fabiana",
    "Isabela",
    "Karina",
    "Monica",
    "Patricia",
    "Sabrina",
    "Vanessa",
    "Ximena",
    "Bianca",
    "Debora",
    "Flavia",
    "Ingrid",
    "Larissa",
    "Natalia",
    "Priscila",
    "Silvia",
    "Ursula",
    "Yara",
  ]

  const lastNames = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Pereira",
    "Lima",
    "Gomes",
    "Costa",
    "Ribeiro",
    "Martins",
    "Carvalho",
    "Almeida",
    "Lopes",
    "Soares",
    "Fernandes",
    "Vieira",
    "Barbosa",
    "Rocha",
    "Dias",
    "Monteiro",
    "Cardoso",
    "Reis",
    "Araujo",
    "Cavalcanti",
    "Nascimento",
    "Moreira",
    "Freitas",
    "Pinto",
    "Mendes",
    "Castro",
    "Campos",
    "Correia",
    "Teixeira",
    "Miranda",
    "Batista",
    "Nunes",
    "Machado",
  ]

  const categories = ["Iniciante", "Intermediário", "Avançado"]
  const levels = ["A", "B", "C", "D"]
  const statuses: ("active" | "inactive" | "suspended")[] = [
    "active",
    "active",
    "active",
    "active",
    "inactive",
    "suspended",
  ]

  const players: Player[] = []

  // Add required players first
  requiredPlayers.forEach((req, index) => {
    const ranking = Math.floor(Math.random() * 50) + 1
    const wins = Math.floor(Math.random() * 100) + 10
    const losses = Math.floor(Math.random() * 50) + 5
    const winRate = Math.round((wins / (wins + losses)) * 100)

    const isEricNice = req.name === "Eric Nice"

    players.push({
      id: `req-${index + 1}`,
      name: req.name,
      slug: req.slug,
      email: isEricNice ? "eric.nice@email.com" : `${req.name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      phone: isEricNice
        ? "(11) 90000-0000"
        : `(11) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
      cpf: `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
      category: isEricNice ? "Avançado" : categories[Math.floor(Math.random() * categories.length)],
      level: isEricNice ? "A" : levels[Math.floor(Math.random() * levels.length)],
      status: "active",
      registrationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      lastActivity: new Date(2024, 11, Math.floor(Math.random() * 20) + 1).toISOString().split("T")[0],
      lastCheckIn: new Date(2024, 11, Math.floor(Math.random() * 7) + 15).toISOString().split("T")[0],
      photo: `/placeholder.svg?height=40&width=40&query=${req.gender === "male" ? "male" : "female"} tennis player ${req.name}`,
      ranking,
      wins,
      losses,
      winRate,
      points: Math.floor(Math.random() * 2000) + 500,
      gender: req.gender,
    })
  })

  // Generate remaining 195 players (200 total - 5 required)
  for (let i = 5; i < 200; i++) {
    const isMale = Math.random() > 0.5
    const firstName = isMale
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const slug = `@${firstName.toLowerCase()}.${lastName.toLowerCase()}`
    const ranking = i + 1
    const wins = Math.floor(Math.random() * 80) + 5
    const losses = Math.floor(Math.random() * 40) + 2
    const winRate = Math.round((wins / (wins + losses)) * 100)

    players.push({
      id: `player-${i + 1}`,
      name,
      slug,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `(11) ${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
      cpf: `${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}.${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90) + 10}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      level: levels[Math.floor(Math.random() * levels.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      registrationDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        .toISOString()
        .split("T")[0],
      lastActivity: new Date(2024, 11, Math.floor(Math.random() * 20) + 1).toISOString().split("T")[0],
      lastCheckIn: new Date(2024, 11, Math.floor(Math.random() * 7) + 15).toISOString().split("T")[0],
      photo: `/placeholder.svg?height=40&width=40&query=${isMale ? "male" : "female"} tennis player ${name}`,
      ranking,
      wins,
      losses,
      winRate,
      points: Math.floor(Math.random() * 1500) + 200,
      gender: isMale ? "male" : "female",
    })
  }

  return players
    .sort((a, b) => b.points - a.points)
    .map((player, index) => ({
      ...player,
      ranking: index + 1,
    }))
}

function PlayersManagementContent() {
  const searchParams = useSearchParams()
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(null)
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Player>>({})
  const playersPerPage = 10

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = () => {
    try {
      const savedPlayers = localStorage.getItem("tennis-players")
      if (savedPlayers) {
        const parsedPlayers = JSON.parse(savedPlayers)
        if (parsedPlayers.length < 200) {
          const mockPlayers = generateMockPlayers()
          setPlayers(mockPlayers)
          localStorage.setItem("tennis-players", JSON.stringify(mockPlayers))
        } else {
          setPlayers(parsedPlayers)
        }
      } else {
        const mockPlayers = generateMockPlayers()
        setPlayers(mockPlayers)
        localStorage.setItem("tennis-players", JSON.stringify(mockPlayers))
      }
    } catch (error) {
      console.error("Error loading players:", error)
      const mockPlayers = generateMockPlayers()
      setPlayers(mockPlayers)
      localStorage.setItem("tennis-players", JSON.stringify(mockPlayers))
    }
  }

  const handleViewPlayer = (playerId: string) => {
    setExpandedPlayer(expandedPlayer === playerId ? null : playerId)
    setEditingPlayer(null)
  }

  const handleEditPlayer = (playerId: string) => {
    const player = players.find((p) => p.id === playerId)
    if (player) {
      setEditingPlayer(playerId)
      setEditForm({
        email: player.email,
        phone: player.phone,
        slug: player.slug,
        category: player.category,
        level: player.level,
        status: player.status,
      })
      setExpandedPlayer(null)
    }
  }

  const handleSaveEdit = (playerId: string) => {
    const updatedPlayers = players.map((player) => (player.id === playerId ? { ...player, ...editForm } : player))
    setPlayers(updatedPlayers)
    localStorage.setItem("tennis-players", JSON.stringify(updatedPlayers))
    setEditingPlayer(null)
    setEditForm({})
    toast.success("Jogador atualizado com sucesso!")
  }

  const handleCancelEdit = () => {
    setEditingPlayer(null)
    setEditForm({})
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.cpf.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || player.status === statusFilter
    const matchesCategory = categoryFilter === "all" || player.category === categoryFilter
    const matchesLevel = levelFilter === "all" || player.level === levelFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesLevel
  })

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage)
  const startIndex = (currentPage - 1) * playersPerPage
  const paginatedPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage)

  const handleDeletePlayer = (playerId: string) => {
    const updatedPlayers = players.filter((p) => p.id !== playerId)
    setPlayers(updatedPlayers)
    localStorage.setItem("tennis-players", JSON.stringify(updatedPlayers))
    toast.success("Jogador removido com sucesso!")
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    }
    const labels = {
      active: "Ativo",
      inactive: "Inativo",
      suspended: "Suspenso",
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>
    )
  }

  const generatePlayerStats = (player: Player) => {
    const totalMatches = player.wins + player.losses
    const avgMatchDuration = Math.floor(Math.random() * 60) + 45 // 45-105 minutes
    const totalCourtTime = totalMatches * avgMatchDuration
    const gamesPerWeek = Math.floor(Math.random() * 5) + 1
    const gamesPerMonth = gamesPerWeek * 4

    // Generate recent opponents
    const recentOpponents = players
      .filter((p) => p.id !== player.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((p) => p.name)

    return {
      totalMatches,
      avgMatchDuration,
      totalCourtTime,
      gamesPerWeek,
      gamesPerMonth,
      recentOpponents,
    }
  }

  const topPlayers = players.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Jogadores</h1>
          <p className="text-muted-foreground">Gerencie os {players.length} jogadores cadastrados no sistema</p>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Lista
            </TabsTrigger>
            <TabsTrigger value="ranking" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, email, @slug ou CPF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="suspended">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Iniciante">Iniciante</SelectItem>
                      <SelectItem value="Intermediário">Intermediário</SelectItem>
                      <SelectItem value="Avançado">Avançado</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="A">Nível A</SelectItem>
                      <SelectItem value="B">Nível B</SelectItem>
                      <SelectItem value="C">Nível C</SelectItem>
                      <SelectItem value="D">Nível D</SelectItem>
                    </SelectContent>
                  </Select>

                  <Link href="/admin/players/register">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Jogador
                    </Button>
                  </Link>
                </div>
              </CardHeader>
            </Card>

            {/* Players Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jogador</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Categoria/Nível</TableHead>
                        <TableHead>Último Check-in</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Enhanced player card rendering with proper expandable view and inline editing */}
                      {paginatedPlayers.map((player) => (
                        <Card key={player.id} className="mb-4">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={player.photo || "/placeholder.svg"} alt={player.name} />
                                  <AvatarFallback>
                                    {player.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{player.name}</h3>
                                  <p className="text-sm text-muted-foreground">{player.slug}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    {getStatusBadge(player.status)}
                                    <Badge variant="outline">
                                      {player.category} {player.level}
                                    </Badge>
                                    <Badge variant="secondary">#{player.ranking}</Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)}
                                >
                                  {expandedPlayer === player.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewPlayer(player.id)}>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setEditingPlayer(player.id)
                                        setEditForm(player)
                                        setExpandedPlayer(player.id)
                                      }}
                                    >
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleDeletePlayer(player.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {expandedPlayer === player.id && (
                              <div className="mt-4 pt-4 border-t">
                                {editingPlayer === player.id ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="edit-email">Email</Label>
                                        <Input
                                          id="edit-email"
                                          value={editForm.email || ""}
                                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-phone">Phone</Label>
                                        <Input
                                          id="edit-phone"
                                          value={editForm.phone || ""}
                                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-username">Username</Label>
                                        <Input
                                          id="edit-username"
                                          value={editForm.slug || ""}
                                          onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-category">Category</Label>
                                        <Select
                                          value={editForm.category || ""}
                                          onValueChange={(value) => setEditForm({ ...editForm, category: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="Iniciante">Iniciante</SelectItem>
                                            <SelectItem value="Intermediário">Intermediário</SelectItem>
                                            <SelectItem value="Avançado">Avançado</SelectItem>
                                            <SelectItem value="Profissional">Profissional</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-level">Level</Label>
                                        <Select
                                          value={editForm.level || ""}
                                          onValueChange={(value) => setEditForm({ ...editForm, level: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="A">A</SelectItem>
                                            <SelectItem value="B">B</SelectItem>
                                            <SelectItem value="C">C</SelectItem>
                                            <SelectItem value="D">D</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="edit-status">Status</Label>
                                        <Select
                                          value={editForm.status || ""}
                                          onValueChange={(value) =>
                                            setEditForm({
                                              ...editForm,
                                              status: value as "active" | "inactive" | "suspended",
                                            })
                                          }
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                      </Button>
                                      <Button onClick={() => handleSaveEdit(player.id)}>Save Changes</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Contact Info
                                      </h4>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                          <Mail className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{player.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Phone className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{player.phone}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{player.cpf}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Performance
                                      </h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Wins</span>
                                          <span className="text-sm font-medium text-green-600">{player.wins}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Losses</span>
                                          <span className="text-sm font-medium text-red-600">{player.losses}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Win Rate</span>
                                          <span className="text-sm font-medium">{player.winRate}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Points</span>
                                          <span className="text-sm font-medium">{player.points}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                        Activity
                                      </h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span className="text-sm">Registered</span>
                                          <span className="text-sm">
                                            {new Date(player.registrationDate).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Last Activity</span>
                                          <span className="text-sm">
                                            {new Date(player.lastActivity).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm">Last Check-in</span>
                                          <span className="text-sm">
                                            {new Date(player.lastCheckIn).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + playersPerPage, filteredPlayers.length)} de{" "}
                {filteredPlayers.length} jogadores
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ranking" className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Ranking de Jogadores</h2>
                <p className="text-muted-foreground">Classificação baseada em pontos e desempenho</p>
              </CardHeader>
              <CardContent>
                {/* Top 3 Podium */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {topPlayers.map((player, index) => (
                    <Card
                      key={player.id}
                      className={`text-center ${index === 0 ? "ring-2 ring-yellow-500" : index === 1 ? "ring-2 ring-gray-400" : "ring-2 ring-amber-600"}`}
                    >
                      <CardContent className="pt-6">
                        <div
                          className={`text-4xl mb-2 ${index === 0 ? "text-yellow-500" : index === 1 ? "text-gray-400" : "text-amber-600"}`}
                        >
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </div>
                        <img
                          src={player.photo || "/placeholder.svg"}
                          alt={player.name}
                          className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                        />
                        <h3 className="font-bold">{player.name}</h3>
                        <p className="text-sm text-muted-foreground">{player.slug}</p>
                        <div className="mt-2">
                          <div className="text-lg font-bold">{player.points} pts</div>
                          <div className="text-sm text-muted-foreground">{player.winRate}% vitórias</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Full Ranking Table */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Posição</TableHead>
                        <TableHead>Jogador</TableHead>
                        <TableHead>Pontos</TableHead>
                        <TableHead>Vitórias</TableHead>
                        <TableHead>Derrotas</TableHead>
                        <TableHead>Taxa de Vitória</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {players.slice(0, 20).map((player) => (
                        <TableRow key={player.id} className={player.ranking <= 3 ? "bg-muted/50" : ""}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">#{player.ranking}</span>
                              {player.ranking <= 3 && (
                                <span className="text-lg">
                                  {player.ranking === 1 ? "🥇" : player.ranking === 2 ? "🥈" : "🥉"}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={player.photo || "/placeholder.svg"}
                                alt={player.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <div className="font-medium">{player.name}</div>
                                <div className="text-sm text-muted-foreground">{player.slug}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold">{player.points}</TableCell>
                          <TableCell className="text-green-600">{player.wins}</TableCell>
                          <TableCell className="text-red-600">{player.losses}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{player.winRate}%</span>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 transition-all"
                                  style={{ width: `${player.winRate}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Histórico de Jogos</h2>
                <p className="text-muted-foreground">Registro de partidas e resultados</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Jogadores</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Quadra</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 15 }, (_, i) => {
                      if (players.length < 2) return null

                      const player1Index = Math.floor(Math.random() * players.length)
                      const player2Index = Math.floor(Math.random() * players.length)
                      const player1 = players[player1Index]
                      const player2 = players[player2Index]

                      if (!player1 || !player2 || player1.id === player2.id) return null

                      const score1 = Math.floor(Math.random() * 3) + 1
                      const score2 = Math.floor(Math.random() * 3) + 1
                      const date = new Date(2024, 11, Math.floor(Math.random() * 20) + 1)

                      return (
                        <TableRow key={i}>
                          <TableCell>{date.toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={player1?.photo || "/placeholder.svg"}
                                alt={player1?.name || "Player"}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm">{player1?.name}</span>
                              <span className="text-muted-foreground">vs</span>
                              <img
                                src={player2?.photo || "/placeholder.svg"}
                                alt={player2?.name || "Player"}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm">{player2?.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={score1 > score2 ? "font-bold text-green-600" : "text-muted-foreground"}>
                              {score1}
                            </span>
                            <span className="mx-1">-</span>
                            <span className={score2 > score1 ? "font-bold text-green-600" : "text-muted-foreground"}>
                              {score2}
                            </span>
                          </TableCell>
                          <TableCell>{Math.floor(Math.random() * 60) + 60} min</TableCell>
                          <TableCell>Quadra {Math.floor(Math.random() * 4) + 1}</TableCell>
                        </TableRow>
                      )
                    }).filter(Boolean)}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Tendências de Desempenho
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Jogadores em Ascensão</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {players.filter((p) => p.winRate > 70).length} jogadores com taxa de vitória acima de 70%
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Categoria Mais Ativa</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Intermediário representa{" "}
                      {Math.round(
                        (players.filter((p) => p.category === "Intermediário").length / players.length) * 100,
                      )}
                      % dos jogadores
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-900">Recomendação</h4>
                    <p className="text-sm text-orange-700 mt-1">
                      Considere organizar torneios por categoria para melhor engajamento
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Insights de IA
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Padrão de Atividade</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Pico de atividade entre jogadores de nível B e C nos últimos 30 dias
                    </p>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-900">Oportunidade de Crescimento</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      {players.filter((p) => p.status === "inactive").length} jogadores inativos podem ser reengajados
                      com promoções
                    </p>
                  </div>
                  <div className="p-4 bg-pink-50 rounded-lg">
                    <h4 className="font-medium text-pink-900">Sugestão de Pareamento</h4>
                    <p className="text-sm text-pink-700 mt-1">
                      Sistema pode sugerir duplas baseado em nível e histórico de vitórias
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function PlayersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayersManagementContent />
    </Suspense>
  )
}
