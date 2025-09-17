import type React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CustomBadgeProps {
  variant: string
  children: React.ReactNode
  className?: string
}

export function CustomBadge({ variant, children, className }: CustomBadgeProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "custom-green":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "custom-blue":
        return "bg-blue-500 hover:bg-blue-600 text-white"
      case "custom-orange":
        return "bg-orange-500 hover:bg-orange-600 text-white"
      case "custom-purple":
        return "bg-purple-500 hover:bg-purple-600 text-white"
      case "custom-red":
        return "bg-red-500 hover:bg-red-600 text-white"
      default:
        return ""
    }
  }

  return <Badge className={cn(getVariantClasses(), className)}>{children}</Badge>
}
