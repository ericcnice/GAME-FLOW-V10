"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Home, ArrowLeft } from "lucide-react"

export default function ScorePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary-foreground">Tennis Court Manager</h1>
            <Link href="/">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart3 className="h-8 w-8" />
                Score System
              </h1>
              <p className="text-muted-foreground">Sistema de pontuação e estatísticas</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Score Component Placeholder
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">React Component Slot</h3>
                <p className="text-muted-foreground mb-4">
                  Este espaço está reservado para o componente React de pontuação que será integrado posteriormente.
                </p>
                <div className="text-sm text-muted-foreground bg-muted/30 rounded p-3">
                  <strong>Funcionalidades planejadas:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Registro de pontuação em tempo real</li>
                    <li>Estatísticas de desempenho dos jogadores</li>
                    <li>Histórico de partidas e resultados</li>
                    <li>Análise de tendências e rankings</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Link href="/admin/players">
                  <Button variant="outline">Ver Jogadores</Button>
                </Link>
                <Link href="/admin/tournaments">
                  <Button variant="outline">Ver Torneios</Button>
                </Link>
              </div>
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
