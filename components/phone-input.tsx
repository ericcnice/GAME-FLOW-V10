"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  id: string
  required?: boolean
}

export function PhoneInput({ value, onChange, id, required = false }: PhoneInputProps) {
  const [formattedValue, setFormattedValue] = useState(value)

  const formatPhoneNumber = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = phone.replace(/\D/g, "")

    // Formata o número conforme o padrão +XX XX XXXXX XXXX
    let formatted = ""

    if (cleaned.length > 0) {
      formatted = "+"

      if (cleaned.length >= 2) {
        formatted += cleaned.substring(0, 2) + " "

        if (cleaned.length >= 4) {
          formatted += cleaned.substring(2, 4) + " "

          if (cleaned.length >= 9) {
            formatted += cleaned.substring(4, 9) + " "

            if (cleaned.length >= 13) {
              formatted += cleaned.substring(9, 13)
            } else {
              formatted += cleaned.substring(9)
            }
          } else {
            formatted += cleaned.substring(4)
          }
        } else {
          formatted += cleaned.substring(2)
        }
      } else {
        formatted += cleaned
      }
    }

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    setFormattedValue(formatted)

    // Passa apenas os dígitos para o componente pai
    onChange(formatted)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>Celular (WhatsApp){required && <span className="text-destructive">*</span>}</Label>
      <Input
        id={id}
        value={formattedValue}
        onChange={handleChange}
        placeholder="+55 11 98765 4321"
        required={required}
      />
      <p className="text-xs text-muted-foreground">Formato: +XX XX XXXXX XXXX</p>
    </div>
  )
}
