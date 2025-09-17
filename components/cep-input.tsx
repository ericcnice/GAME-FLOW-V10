"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchAddressByCEP } from "@/lib/fetch-address"
import type { Address } from "@/lib/court-state"

interface CEPInputProps {
  value: string
  onChange: (value: string) => void
  onAddressFound: (address: Address | null) => void
  id: string
  required?: boolean
}

export function CEPInput({ value, onChange, onAddressFound, id, required = false }: CEPInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatCEP = (cep: string) => {
    // Remove todos os caracteres não numéricos
    const cleaned = cep.replace(/\D/g, "")

    // Formata o CEP como XXXXX-XXX
    if (cleaned.length <= 5) {
      return cleaned
    } else {
      return `${cleaned.substring(0, 5)}-${cleaned.substring(5, 8)}`
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatCEP(input)
    onChange(formatted)
    setError(null)
  }

  const handleSearch = async () => {
    if (value.replace(/\D/g, "").length !== 8) {
      setError("CEP deve conter 8 dígitos")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const address = await fetchAddressByCEP(value)
      if (address) {
        onAddressFound(address)
      } else {
        setError("CEP não encontrado")
        onAddressFound(null)
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setError("Erro ao buscar CEP")
      onAddressFound(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>CEP{required && <span className="text-destructive">*</span>}</Label>
      <div className="flex space-x-2">
        <Input
          id={id}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="12345-678"
          required={required}
          className={error ? "border-destructive" : ""}
          maxLength={9}
        />
        <Button type="button" onClick={handleSearch} disabled={isLoading || value.replace(/\D/g, "").length !== 8}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Digite o CEP e clique em buscar para preencher o endereço automaticamente
      </p>
    </div>
  )
}
