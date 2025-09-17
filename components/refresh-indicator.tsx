"use client"

import { useState, useEffect } from "react"
import { RefreshCw } from "lucide-react"

interface RefreshIndicatorProps {
  lastUpdated: Date
}

export function RefreshIndicator({ lastUpdated }: RefreshIndicatorProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setIsRefreshing(true)
    const timer = setTimeout(() => setIsRefreshing(false), 1000)
    return () => clearTimeout(timer)
  }, [lastUpdated])

  return (
    <div className="flex items-center">
      <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin text-primary" : "text-muted-foreground"}`} />
      <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
    </div>
  )
}
