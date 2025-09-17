"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// Importe o novo componente
import { CustomBadge } from "@/components/custom-badge"
import { Button } from "@/components/ui/button"
import { Clock, RefreshCw, ExternalLink } from "lucide-react"
import {
  getCourts,
  getPlayers,
  getStatusBadgeVariant,
  getStatusDisplayText,
  type Court,
  type Player,
} from "@/lib/court-state"
import { RefreshIndicator } from "@/components/refresh-indicator"

export default function QueueMonitor() {
  const [players, setPlayers] = useState<Player[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [currentTime, setCurrentTime] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Mobile access URL
  const mobileAccessUrl = "https://v0-tennis-club-app-nine.vercel.app/queue"

  // Function to update data
  const updateData = () => {
    setPlayers(getPlayers())
    setCourts(getCourts())
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    setLastUpdated(now)
  }

  useEffect(() => {
    // Initial data load
    updateData()

    // Set up time update interval (every minute)
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 60000)

    // Set up data refresh interval (every 10 seconds)
    const refreshInterval = setInterval(updateData, 10000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  const availableCourts = courts.filter((court) => court.status === "available").length
  const estimatedWaitTime = players.length > 0 ? (Math.ceil(players.length / 4) * 90) / Math.max(1, availableCourts) : 0

  const handleRefresh = () => {
    // Manual refresh
    updateData()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(mobileAccessUrl)}`

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "p-0" : "p-4"}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tennis Court Queue Monitor</h1>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground mr-2">Auto-updates every 10 seconds</div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Queue</CardTitle>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{currentTime}</span>
                </div>
              </div>
              <CardDescription>Estimated wait time: {estimatedWaitTime} minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No players in queue</div>
                ) : (
                  players.map((player) => (
                    <div key={player.id} className="flex items-center p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold mr-3">
                        {player.position || "?"}
                      </div>
                      <img
                        src={player.photoUrl || "/placeholder.svg"}
                        alt={player.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Check-in: {player.checkInTime}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Court Status</CardTitle>
                <CardDescription>
                  Available courts: {availableCourts} of {courts.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {courts.map((court) => (
                    // Substitua o Badge pelo CustomBadge na linha onde exibe o status da quadra
                    <div key={court.id} className="text-center p-2 border rounded-lg">
                      <div className="font-medium">{court.name}</div>
                      <CustomBadge variant={getStatusBadgeVariant(court.status)} className="mt-1">
                        {getStatusDisplayText(court.status)}
                      </CustomBadge>
                      {court.endTime && <div className="text-xs mt-1">Until {court.endTime}</div>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Access</CardTitle>
                <CardDescription>Scan the QR code to monitor the queue on your mobile device</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-white rounded-lg">
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code for mobile access" className="w-32 h-32" />
                </div>
                <a
                  href={mobileAccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-xs text-primary flex items-center hover:underline"
                >
                  {mobileAccessUrl}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-4 text-right">
          <RefreshIndicator lastUpdated={lastUpdated} />
        </div>
      </div>
    </div>
  )
}
