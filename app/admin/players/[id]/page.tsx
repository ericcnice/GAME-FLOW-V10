"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Users } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import AdminHeader from "@/components/admin-header"
import { useToast } from "@/hooks/use-toast"
import {
  getAllSystemPlayers,
  setAllSystemPlayers,
  getPlayers,
  setPlayers,
  updatePlayerPositions,
  type SystemPlayer,
} from "@/lib/court-state"

export default function PlayerDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [player, setPlayer] = useState<SystemPlayer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPlayer = () => {
      const systemPlayers = getAllSystemPlayers()
      const foundPlayer = systemPlayers.find((p) => p.id === params.id)

      if (foundPlayer) {
        setPlayer(foundPlayer)
      } else {
        toast({
          title: "Jogador não encontrado",
          description: "O jogador solicitado não foi encontrado no sistema",
          variant: "destructive",
        })
        router.push("/admin/players")
      }

      setIsLoading(false)
    }

    loadPlayer()
  }, [params.id, router, toast])

  const handleDelete = () => {
    if (!player) return

    // Remove from system players
    const systemPlayers = getAllSystemPlayers()
    const updatedSystemPlayers = systemPlayers.filter((p) => p.id !== player.id)
    setAllSystemPlayers(updatedSystemPlayers)

    // Also remove from waiting list if they exist there
    const waitingListPlayers = getPlayers()
    const updatedWaitingList = waitingListPlayers.filter((p) => p.id !== player.id)

    if (updatedWaitingList.length !== waitingListPlayers.length) {
      // Player was in waiting list, update positions
      const playersWithUpdatedPositions = updatePlayerPositions(updatedWaitingList)
      setPlayers(playersWithUpdatedPositions)
    }

    toast({
      title: "Jogador removido",
      description: `${player.name} foi removido do sistema`,
    })

    router.push("/admin/players")
  }

  const handleCheckIn = () => {
    if (!player) return

    // Add player to waiting list
    const waitingListPlayers = getPlayers()
    const now = new Date()
    const checkInTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    // Check if player is already in waiting list
    if (waitingListPlayers.some((p) => p.id === player.id)) {
      toast({
        title: "Jogador já está na lista",
        description: `${player.name} já está na lista de espera`,
        variant: "destructive",
      })
      return
    }

    // Add player to beginning of waiting list
    const waitingListPlayer = {
      id: player.id,
      name: player.name,
      photoUrl: player.photoUrl,
      checkInTime,
      position: 1, // Will be recalculated
    }

    // Add to beginning and update all positions
    const updatedWaitingList = [waitingListPlayer, ...waitingListPlayers]
    const playersWithUpdatedPositions = updatedWaitingList.map((player, index) => ({
      ...player,
      position: index + 1,
    }))

    setPlayers(playersWithUpdatedPositions)

    // Update last check-in time in system players
    const systemPlayers = getAllSystemPlayers()
    const updatedSystemPlayers = systemPlayers.map((p) => {
      if (p.id === player.id) {
        return {
          ...p,
          lastCheckIn: checkInTime,
        }
      }
      return p
    })
    setAllSystemPlayers(updatedSystemPlayers)

    toast({
      title: "Check-in realizado",
      description: `${player.name} foi adicionado à lista de espera`,
    })

    // Reload player data
    setPlayer((prev) => (prev ? { ...prev, lastCheckIn: checkInTime } : null))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <p>Carregando...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <p>Jogador não encontrado</p>
          </div>
        </main>
      </div>
    )
  }

  // Verificar se o jogador está na lista de espera
  const waitingListPlayers = getPlayers()
  const isCheckedIn = waitingListPlayers.some((p) => p.id === player.id)

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/players")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Detalhes do Jogador</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Coluna da esquerda - Informações básicas */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <img
                    src={player.photoUrl || "/placeholder.svg?height=150&width=150"}
                    alt={player.name}
                    className="h-[200px] w-[200px] object-cover rounded-full border border-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                    <p className="text-lg font-medium">{player.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <Badge
                      variant={
                        player.status === "active"
                          ? "success"
                          : player.status === "inactive"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {player.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">E-mail</h3>
                    <p>{player.email || "Não informado"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Telefone</h3>
                    {player.phone ? <WhatsAppLink phoneNumber={player.phone} /> : <p>Não informado</p>}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Membership ID</h3>
                    <p>{player.membershipId || "Não informado"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">CPF</h3>
                    <p>
                      {player.cpf
                        ? `${player.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}`
                        : "Não informado"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Último Check-in</h3>
                    <p>{player.lastCheckIn || "Nunca"}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
                    <p>{player.isGuest ? "Convidado" : "Associado"}</p>
                  </div>

                  {player.isGuest && player.guestOf && (
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Convidado de</h3>
                      <p>{player.guestOf}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  {!isCheckedIn && (
                    <Button onClick={handleCheckIn} className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Fazer Check-in
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/players/edit/${player.id}`)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Jogador
                  </Button>

                  <Button variant="destructive" onClick={handleDelete} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Jogador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna da direita - Endereço e outras informações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {player.address ? (
                  <div className="space-y-2">
                    <p>
                      {player.address.street}, {player.address.number}
                      {player.address.complement && `, ${player.address.complement}`}
                    </p>
                    <p>
                      {player.address.neighborhood}, {player.address.city} - {player.address.state}
                    </p>
                    <p>CEP: {player.address.cep}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Endereço não informado</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Histórico não disponível</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
