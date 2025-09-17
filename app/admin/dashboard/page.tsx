"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, Calendar, CheckCircle, Activity, BookOpen, UserCheck, UserPlus } from "lucide-react"
import AdminHeader from "@/components/admin-header"
import { PopularityChart } from "@/components/popularity-chart"
import {
  getCourts,
  getPlayers,
  getAllSystemPlayers,
  type Court,
  type Player,
  type SystemPlayer,
} from "@/lib/court-state"

export default function AdminDashboard() {
  const [courts, setCourts] = useState<Court[]>([])
  const [waitingPlayers, setWaitingPlayers] = useState<Player[]>([])
  const [systemPlayers, setSystemPlayers] = useState<SystemPlayer[]>([])
  const [stats, setStats] = useState({
    totalPlayers: 0,
    activePlayers: 0,
    playersPlaying: 0,
    totalCourts: 0,
    availableCourts: 0,
    averageWaitTime: 0,
    totalBookings: 0,
    dailyCheckIns: 0,
    playersWaiting: 0,
  })

  // Carregar dados e calcular estatísticas
  useEffect(() => {
    const loadData = () => {
      const courtsData = getCourts()
      const waitingPlayersData = getPlayers()
      const systemPlayersData = getAllSystemPlayers()

      setCourts(courtsData)
      setWaitingPlayers(waitingPlayersData)
      setSystemPlayers(systemPlayersData)

      // Calcular estatísticas
      const totalPlayers = systemPlayersData.length
      const activePlayers = systemPlayersData.filter((p) => p.status === "active").length

      // Contar jogadores atualmente jogando
      let playersPlaying = 0
      courtsData.forEach((court) => {
        if (court.status === "in-use") {
          playersPlaying += court.players.length
        }
      })

      const totalCourts = courtsData.length
      const availableCourts = courtsData.filter((court) => court.status === "available").length

      // Calcular tempo médio de espera (90 minutos por grupo de 4 jogadores)
      const waitingGroups = Math.ceil(waitingPlayersData.length / 4)
      const averageWaitTime = waitingGroups > 0 ? (waitingGroups * 90) / Math.max(1, availableCourts) : 0

      // Simular total de reservas para o dia (jogadores jogando + jogadores na fila)
      const totalBookings = playersPlaying / 4 + waitingGroups

      // Número de check-ins diários (simulado)
      // Em um sistema real, isso seria calculado a partir de registros de check-in do dia
      const dailyCheckIns = waitingPlayersData.length + playersPlaying

      // Número de jogadores na fila de espera
      const playersWaiting = waitingPlayersData.length

      setStats({
        totalPlayers,
        activePlayers,
        playersPlaying,
        totalCourts,
        availableCourts,
        averageWaitTime,
        totalBookings: Math.ceil(totalBookings),
        dailyCheckIns,
        playersWaiting,
      })
    }

    loadData()

    // Atualizar a cada 30 segundos
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/admin/courts">
            <Button>Manage Courts</Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Players</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">Registered in the system</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Players</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activePlayers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.activePlayers / Math.max(1, stats.totalPlayers)) * 100)}% of total players
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Players Playing</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.playersPlaying}</div>
              <p className="text-xs text-muted-foreground">Currently on courts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Courts</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.availableCourts}/{stats.totalCourts}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((stats.availableCourts / Math.max(1, stats.totalCourts)) * 100)}% available
              </p>
            </CardContent>
          </Card>

          {/* Novo card: Nº CheckIns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Nº CheckIns</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dailyCheckIns}</div>
              <p className="text-xs text-muted-foreground">Today's check-ins</p>
            </CardContent>
          </Card>

          {/* Novo card: Players Waiting */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Players Waiting</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.playersWaiting}</div>
              <p className="text-xs text-muted-foreground">In queue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(stats.averageWaitTime)} min</div>
              <p className="text-xs text-muted-foreground">{waitingPlayers.length} players waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">For today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <PopularityChart />

          <Card>
            <CardHeader>
              <CardTitle>Court Status</CardTitle>
              <CardDescription>Current status of all courts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courts.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No courts found</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {courts.map((court) => (
                      <div
                        key={court.id}
                        className={`p-3 rounded-lg border ${
                          court.status === "available"
                            ? "border-green-500/50"
                            : court.status === "in-use"
                              ? "border-blue-500/50"
                              : court.status === "maintenance"
                                ? "border-orange-500/50"
                                : court.status === "classes"
                                  ? "border-purple-500/50"
                                  : "border-red-500/50"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{court.name}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              court.status === "available"
                                ? "bg-green-100 text-green-800"
                                : court.status === "in-use"
                                  ? "bg-blue-100 text-blue-800"
                                  : court.status === "maintenance"
                                    ? "bg-orange-100 text-orange-800"
                                    : court.status === "classes"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-red-100 text-red-800"
                            }`}
                          >
                            {court.status === "in-use"
                              ? "In Use"
                              : court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                          </span>
                        </div>
                        {court.status === "in-use" && (
                          <div className="text-xs text-muted-foreground mt-1">Until {court.endTime}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
              <CardDescription>Players who recently checked in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waitingPlayers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No recent check-ins</div>
                ) : (
                  <div className="space-y-2">
                    {waitingPlayers.slice(0, 5).map((player) => (
                      <div key={player.id} className="flex items-center p-2 border rounded-lg">
                        <img
                          src={player.photoUrl || "/placeholder.svg"}
                          alt={player.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <div className="font-medium text-sm">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.checkInTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
