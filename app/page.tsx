import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <header className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-3xl font-bold text-white">Game Flow</div>
            <div className="text-lg text-gray-300 italic">Play. Connect. Evolve.</div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {/* Court Status Card - Yellow Rectangle */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(255,255,0,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="w-24 h-16 bg-yellow-500 rounded-lg group-hover:shadow-[0_0_20px_4px_rgba(255,255,0,0.7)] transition-all duration-300"></div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Court Status</h2>
              <p className="mb-4 text-gray-300 text-sm">
                View the current status of all tennis courts, including availability and wait times.
              </p>
              <Link href="/courts/status">
                <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">View Court Status</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Queue Monitor Card - White Circle */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(255,255,255,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-white group-hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.7)] transition-all duration-300"></div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Queue Monitor</h2>
              <p className="mb-4 text-gray-300 text-sm">
                Monitor your position in the queue and get real-time updates on wait times.
              </p>
              <Link href="/queue">
                <Button className="w-full bg-white hover:bg-gray-100 text-black">View Queue</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Dashboard Card - Green Triangle */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(34,197,94,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[60px] border-l-transparent border-r-transparent border-b-green-500 group-hover:drop-shadow-[0_0_10px_rgba(34,197,94,0.7)] transition-all duration-300"></div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Admin Dashboard</h2>
              <p className="mb-4 text-gray-300 text-sm">
                Access the administrative dashboard to manage courts, players, and system settings.
              </p>
              <Link href="/admin/dashboard">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Players Card - White Circle */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(59,130,246,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-blue-400 group-hover:shadow-[0_0_20px_4px_rgba(59,130,246,0.7)] transition-all duration-300"></div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Players</h2>
              <p className="mb-4 text-gray-300 text-sm">
                Manage player profiles, rankings, and track performance statistics.
              </p>
              <Link href="/admin/players">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">View Players</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tournaments Card - Circle + Triangle Combination */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(168,85,247,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-purple-400 group-hover:shadow-[0_0_15px_4px_rgba(168,85,247,0.7)] transition-all duration-300"></div>
                <div className="absolute -top-2 -right-2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] transition-all duration-300"></div>
              </div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Tournaments</h2>
              <p className="mb-4 text-gray-300 text-sm">
                Create and manage tournaments with interactive bracket systems and match tracking.
              </p>
              <Link href="/admin/tournaments">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">View Tournaments</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Score Card - White Square Outline */}
          <Card className="bg-black border-gray-700 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_8px_rgba(156,163,175,0.3)] transition-all duration-300">
            <div className="h-48 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-gray-400 rounded-lg group-hover:shadow-[0_0_20px_4px_rgba(156,163,175,0.7)] transition-all duration-300"></div>
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Score</h2>
              <p className="mb-4 text-gray-300 text-sm">
                Track match scores, statistics, and performance analytics for all players.
              </p>
              <Link href="/score">
                <Button className="w-full bg-gray-500 hover:bg-gray-600 text-white">View Scores</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Game Flow - Tennis Court Management System</p>
        </div>
      </footer>
    </div>
  )
}
