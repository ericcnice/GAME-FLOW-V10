"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { PhotoCapture } from "@/components/photo-capture"
import { PhoneInput } from "@/components/phone-input"
import { CPFInput } from "@/components/cpf-input"
import { CEPInput } from "@/components/cep-input"
import AdminHeader from "@/components/admin-header"
import { useToast } from "@/hooks/use-toast"
import {
  getAllSystemPlayers,
  setAllSystemPlayers,
  getPlayers,
  setPlayers,
  updatePlayer,
  type Address,
} from "@/lib/court-state"

export default function EditPlayer({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()

  const [photoUrl, setPhotoUrl] = useState("/placeholder.svg?height=150&width=150")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [membershipId, setMembershipId] = useState("")
  const [cpf, setCpf] = useState("")
  const [isCpfValid, setIsCpfValid] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const [guestOf, setGuestOf] = useState("")
  const [checkInAfterRegister, setCheckInAfterRegister] = useState(false)

  // Campos de endereço
  const [cep, setCep] = useState("")
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar dados do jogador
  useEffect(() => {
    const loadPlayerData = () => {
      const systemPlayers = getAllSystemPlayers()
      const player = systemPlayers.find((p) => p.id === params.id)

      if (!player) {
        toast({
          title: "Jogador não encontrado",
          description: "Não foi possível encontrar os dados do jogador",
          variant: "destructive",
        })
        router.push("/admin/players")
        return
      }

      // Preencher os campos com os dados do jogador
      setPhotoUrl(player.photoUrl || "/placeholder.svg?height=150&width=150")
      setName(player.name || "")
      setEmail(player.email || "")
      setPhone(player.phone || "")
      setMembershipId(player.membershipId || "")
      setCpf(player.cpf || "")
      setIsCpfValid(true)
      setIsGuest(player.isGuest || false)
      setGuestOf(player.guestOf || "")

      // Preencher os campos de endereço
      if (player.address) {
        setCep(player.address.cep || "")
        setStreet(player.address.street || "")
        setNumber(player.address.number || "")
        setComplement(player.address.complement || "")
        setNeighborhood(player.address.neighborhood || "")
        setCity(player.address.city || "")
        setState(player.address.state || "")
      }

      setIsLoading(false)
    }

    loadPlayerData()
  }, [params.id, router, toast])

  const handlePhotoCapture = (url: string) => {
    setPhotoUrl(url)
  }

  const handleCpfChange = (value: string, valid: boolean) => {
    setCpf(value)
    setIsCpfValid(valid)
  }

  const handleAddressFound = (address: Address | null) => {
    if (address) {
      setStreet(address.street)
      setNeighborhood(address.neighborhood)
      setCity(address.city)
      setState(address.state)
      // Foca no campo de número após preencher o endereço
      document.getElementById("number")?.focus()
    } else {
      setStreet("")
      setNeighborhood("")
      setCity("")
      setState("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isCpfValid && cpf.length > 0) {
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique o CPF informado",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Criar objeto de endereço
      const address: Address = {
        cep,
        street,
        neighborhood,
        city,
        state,
        number,
        complement,
      }

      // Atualizar objeto do jogador
      const systemPlayers = getAllSystemPlayers()
      const updatedSystemPlayers = systemPlayers.map((player) => {
        if (player.id === params.id) {
          return {
            ...player,
            name,
            photoUrl,
            email,
            phone,
            membershipId,
            cpf,
            address,
            isGuest,
            guestOf: isGuest ? guestOf : undefined,
          }
        }
        return player
      })

      setAllSystemPlayers(updatedSystemPlayers)

      // Atualizar na lista de espera, se existir
      const waitingListPlayers = getPlayers()
      const playerInWaitingList = waitingListPlayers.find((p) => p.id === params.id)

      if (playerInWaitingList) {
        updatePlayer(params.id, {
          name,
          photoUrl,
        })
      }

      // Se marcou para fazer check-in e não está na lista de espera, adicionar
      if (checkInAfterRegister && !playerInWaitingList) {
        const now = new Date()
        const checkInTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

        const waitingListPlayer = {
          id: params.id,
          name,
          photoUrl,
          checkInTime,
          position: waitingListPlayers.length + 1,
        }

        setPlayers([...waitingListPlayers, waitingListPlayer])
      }

      toast({
        title: "Jogador atualizado com sucesso",
        description:
          checkInAfterRegister && !playerInWaitingList
            ? `${name} foi atualizado e adicionado à lista de espera`
            : `${name} foi atualizado no sistema`,
      })

      // Redirecionar para a lista de jogadores
      router.push("/admin/players")
    } catch (error) {
      console.error("Erro ao atualizar jogador:", error)
      toast({
        title: "Erro ao atualizar jogador",
        description: "Ocorreu um erro ao atualizar o jogador. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-full">
            <p>Carregando dados do jogador...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Editar Jogador</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Coluna da esquerda */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Dados básicos do jogador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <PhotoCapture onPhotoCapture={handlePhotoCapture} initialPhotoUrl={photoUrl} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome Completo<span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-mail<span className="text-destructive">*</span>
                    </Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>

                  <PhoneInput id="phone" value={phone} onChange={setPhone} required />

                  <CPFInput id="cpf" value={cpf} onChange={handleCpfChange} required />

                  <div className="space-y-2">
                    <Label htmlFor="membershipId">
                      Membership ID<span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="membershipId"
                      value={membershipId}
                      onChange={(e) => setMembershipId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="isGuest" checked={isGuest} onCheckedChange={setIsGuest} />
                    <Label htmlFor="isGuest">Convidado de um associado</Label>
                  </div>

                  {isGuest && (
                    <div className="space-y-2">
                      <Label htmlFor="guestOf">
                        Nome do Associado<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="guestOf"
                        value={guestOf}
                        onChange={(e) => setGuestOf(e.target.value)}
                        required={isGuest}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Coluna da direita */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                  <CardDescription>Informações de endereço do jogador</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CEPInput id="cep" value={cep} onChange={setCep} onAddressFound={handleAddressFound} required />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="street">
                        Logradouro<span className="text-destructive">*</span>
                      </Label>
                      <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} required readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="number">
                        Número<span className="text-destructive">*</span>
                      </Label>
                      <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="neighborhood">
                        Bairro<span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="neighborhood"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        required
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">
                        Cidade<span className="text-destructive">*</span>
                      </Label>
                      <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">
                        Estado<span className="text-destructive">*</span>
                      </Label>
                      <Input id="state" value={state} onChange={(e) => setState(e.target.value)} required readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Opções</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="checkInAfterRegister"
                      checked={checkInAfterRegister}
                      onCheckedChange={(checked) => setCheckInAfterRegister(checked === true)}
                    />
                    <Label htmlFor="checkInAfterRegister">
                      Fazer check-in após atualizar (adicionar à lista de espera)
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/players")}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
