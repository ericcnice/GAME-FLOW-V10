import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-primary-foreground">Tennis Court Manager</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              <img
                src="/placeholder.svg?height=200&width=400"
                alt="Tennis courts"
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Court Status</h2>
              <p className="mb-4">
                View the current status of all tennis courts, including availability and wait times.
              </p>
              <Link href="/courts/status">
                <Button className="w-full">View Court Status</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              <QrCode className="h-24 w-24 text-primary" />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Queue Monitor</h2>
              <p className="mb-4">Scan the QR code to monitor your position in the queue from your mobile device.</p>
              <Link href="/queue">
                <Button className="w-full">View Queue</Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <div className="h-48 bg-muted flex items-center justify-center">
              <img src="/tennis-admin-dashboard.jpg" alt="Admin dashboard" className="object-cover w-full h-full" />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
              <p className="mb-4">
                Access the administrative dashboard to manage courts, players, and system settings.
              </p>
              <Link href="/admin/dashboard">
                <Button className="w-full">Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Tennis Court Management System</p>
        </div>
      </footer>
    </div>
  )
}
