"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

// Função para gerar dados de ocupação por hora para um dia específico
const generateHourlyData = (dayOffset: number) => {
  // Gera dados ligeiramente diferentes para cada dia
  const multiplier = (7 - dayOffset) / 7 // Dias mais recentes têm valores maiores

  return [
    { hour: "6AM", occupancy: Math.round(10 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "7AM", occupancy: Math.round(20 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "8AM", occupancy: Math.round(35 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "9AM", occupancy: Math.round(45 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "10AM", occupancy: Math.round(60 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "11AM", occupancy: Math.round(75 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "12PM", occupancy: Math.round(65 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "1PM", occupancy: Math.round(55 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "2PM", occupancy: Math.round(50 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "3PM", occupancy: Math.round(60 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "4PM", occupancy: Math.round(75 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "5PM", occupancy: Math.round(90 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "6PM", occupancy: Math.round(100 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "7PM", occupancy: Math.round(85 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "8PM", occupancy: Math.round(70 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "9PM", occupancy: Math.round(45 * multiplier * (0.8 + Math.random() * 0.4)) },
    { hour: "10PM", occupancy: Math.round(20 * multiplier * (0.8 + Math.random() * 0.4)) },
  ]
}

// Função para obter a cor da barra com base na ocupação
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const occupancy = payload[0].value

    return (
      <div className="bg-background border rounded-md p-2 shadow-sm">
        <p className="font-medium">{`${payload[0].payload.hour}`}</p>
        <p className="text-sm">{`${occupancy}% occupancy`}</p>
      </div>
    )
  }

  return null
}

export function PopularityChart() {
  // Gerar as datas para os últimos 7 dias
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, i)
    return {
      value: String(i),
      label: format(date, "EEE, dd/MM", { locale: ptBR }),
      date,
    }
  })

  // Estado para controlar o dia selecionado (0 = hoje, 1 = ontem, etc.)
  const [selectedDay, setSelectedDay] = useState("0")

  // Dados de ocupação para o dia selecionado
  const dayData = generateHourlyData(Number(selectedDay))

  // Identificar os 6 horários de maior movimento
  const topHours = [...dayData]
    .sort((a, b) => b.occupancy - a.occupancy)
    .slice(0, 6)
    .map((item) => item.hour)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Court Popularity</CardTitle>
        <CardDescription>Hourly court occupancy by day</CardDescription>
        <Tabs value={selectedDay} onValueChange={setSelectedDay} className="mt-2">
          <TabsList className="grid grid-cols-7 w-full">
            {days.map((day) => (
              <TabsTrigger key={day.value} value={day.value} className="text-xs">
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="hour" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="occupancy"
                radius={[4, 4, 0, 0]}
                barSize={20}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {dayData.map((entry, index) => (
                  <rect
                    key={`rect-${index}`}
                    x={0}
                    y={0}
                    width={20}
                    height={300}
                    fill={topHours.includes(entry.hour) ? "#000000" : "transparent"}
                    stroke="#000000"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
