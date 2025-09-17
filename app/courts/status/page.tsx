"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowLeft, RefreshCw } from "lucide-react"
import { getCourts, getStatusBadgeVariant, getStatusDisplayText, type Court } from "@/lib/court-state"
import { RefreshIndicator } from "@/components/refresh-indicator"
// Importe o novo componente
import { CustomBadge } from "@/components/custom-badge"

export default function CourtStatus() {
  const [courts, setCourts] = useState<Court[]>([])
  const [currentTime, setCurrentTime] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Function to update data
  const updateData = () => {
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

  const handleRefresh = () => {
    // Manual refresh
    updateData()
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Court Status</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-sm text-muted-foreground mr-2">Auto-updates every 10 seconds</div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>{currentTime}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courts.map((court) => (
            <Card
              key={court.id}
              className={`
                ${court.status === "available" ? "border-green-500/50" : ""}
                ${court.status === "in-use" ? "border-blue-500/50" : ""}
                ${court.status === "maintenance" ? "border-orange-500/50" : ""}
                ${court.status === "classes" ? "border-purple-500/50" : ""}
                ${court.status === "tournament" ? "border-red-500/50" : ""}
              `}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{court.name}</CardTitle>
                  <CustomBadge variant={getStatusBadgeVariant(court.status)}>
                    {getStatusDisplayText(court.status)}
                  </CustomBadge>
                </div>
                {court.status === "in-use" && (
                  <CardDescription>
                    {court.startTime} - {court.endTime}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {court.status === "available" ? (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-muted-foreground">Ready for play</p>
                  </div>
                ) : court.status === "in-use" && court.players ? (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Players:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {court.players.map((player, index) => (
                        <div key={player.id || index} className="text-sm p-2 bg-muted rounded-lg">
                          {player.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : court.status === "classes" ? (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-muted-foreground">Reserved for classes</p>
                  </div>
                ) : court.status === "tournament" ? (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-muted-foreground">Reserved for tournament</p>
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center">
                    <p className="text-muted-foreground">Under maintenance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 text-right">
          <RefreshIndicator lastUpdated={lastUpdated} />
        </div>
      </div>
    </div>
  )
}
