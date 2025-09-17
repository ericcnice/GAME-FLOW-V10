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
import { Search, Plus, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Player {
  id: string
  name: string
  email: string
  phone: string
  cpf: string
  category: string
  status: "active" | "inactive" | "suspended"
  registrationDate: string
  lastActivity: string
  photo?: string
}

function PlayersManagementContent() {
  const searchParams = useSearchParams()
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const playersPerPage = 10

  useEffect(() => {
    loadPlayers()
  }, [])

  const loadPlayers = () => {
    try {
      const savedPlayers = localStorage.getItem("tennis-players")
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers))
      } else {
        // Mock data for demonstration
        const mockPlayers: Player[] = [
          {
            id: "1",
            name: "João Silva",
            email: "joao@email.com",
            phone: "(11) 99999-9999",
            cpf: "123.456.789-00",
            category: "Iniciante",
            status: "active",
            registrationDate: "2024-01-15",
            lastActivity: "2024-01-20",
          },
          {
            id: "2",
            name: "Maria Santos",
            email: "maria@email.com",
            phone: "(11) 88888-8888",
            cpf: "987.654.321-00",
            category: "Intermediário",
            status: "active",
            registrationDate: "2024-01-10",
            lastActivity: "2024-01-19",
          },
        ]
        setPlayers(mockPlayers)
        localStorage.setItem("tennis-players", JSON.stringify(mockPlayers))
      }
    } catch (error) {
      console.error("Error loading players:", error)
      setPlayers([])
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.cpf.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || player.status === statusFilter
    const matchesCategory = categoryFilter === "all" || player.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
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

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerenciamento de Jogadores</h1>
          <p className="text-muted-foreground">Gerencie os jogadores cadastrados no sistema</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Cadastrado em {new Date(player.registrationDate).toLocaleDateString("pt-BR")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {player.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {player.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{player.cpf}</TableCell>
                      <TableCell>{player.category}</TableCell>
                      <TableCell>{getStatusBadge(player.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/players/${player.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/players/edit/${player.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlayer(player.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
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
