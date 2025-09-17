"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Users, Settings, MenuIcon, Home, Trophy } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export function AdminHeader() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path
  }

  const menuItems = [
    { path: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" />, label: "Dashboard" },
    { path: "/admin/courts", icon: <Calendar className="h-4 w-4 mr-2" />, label: "Courts" },
    { path: "/admin/players", icon: <Users className="h-4 w-4 mr-2" />, label: "Players" },
    { path: "/admin/tournaments", icon: <Trophy className="h-4 w-4 mr-2" />, label: "Tournaments" },
    { path: "/admin/settings", icon: <Settings className="h-4 w-4 mr-2" />, label: "Settings" },
  ]

  return (
    <header className="bg-primary py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-primary-foreground mr-4 md:mr-8">Tennis Court Manager</h1>

            {/* Menu Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link href={item.path} key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "secondary" : "ghost"}
                    className={`${isActive(item.path) ? "text-primary font-medium" : "text-primary-foreground"} hover:text-primary-foreground hover:bg-primary-foreground/10`}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center">
            {/* Menu Mobile */}
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-primary-foreground mr-2">
                    <MenuIcon className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[250px] sm:w-[300px] bg-background">
                  <div className="flex flex-col h-full">
                    <div className="py-4 border-b">
                      <h2 className="text-lg font-bold">Tennis Court Manager</h2>
                    </div>
                    <nav className="flex flex-col py-4 space-y-1">
                      {menuItems.map((item) => (
                        <Link href={item.path} key={item.path} onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant={isActive(item.path) ? "secondary" : "ghost"}
                            className={`w-full justify-start ${isActive(item.path) ? "bg-secondary" : ""}`}
                          >
                            {item.icon}
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto py-4 border-t">
                      <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          <Home className="h-4 w-4 mr-2" />
                          Home
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Link href="/">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
