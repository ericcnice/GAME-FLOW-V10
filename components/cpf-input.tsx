"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateCPF, formatCPF } from "@/lib/validate-cpf"

interface CPFInputProps {
  value: string
  onChange: (value: string, isValid: boolean) => void
  id: string
  required?: boolean
}

export function CPFInput({ value, onChange, id, required = false }: CPFInputProps) {
  const [formattedValue, setFormattedValue] = useState(value ? formatCPF(value) : "")
  const [isValid, setIsValid] = useState(value ? validateCPF(value) : true)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (value) {
      setFormattedValue(formatCPF(value))
      setIsValid(validateCPF(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value

    // Remove caracteres não numéricos para validação
    const cleaned = input.replace(/\D/g, "")

    // Formata o CPF
    const formatted = formatCPF(cleaned)
    setFormattedValue(formatted)

    // Valida o CPF apenas se tiver 11 dígitos
    const valid = cleaned.length === 11 ? validateCPF(cleaned) : true
    setIsValid(valid)

    // Passa o valor e a validade para o componente pai
    onChange(cleaned, valid)
  }

  const handleBlur = () => {
    setTouched(true)

    // Valida o CPF quando o campo perde o foco
    if (formattedValue.replace(/\D/g, "").length === 11) {
      const valid = validateCPF(formattedValue.replace(/\D/g, ""))
      setIsValid(valid)
    } else if (formattedValue.replace(/\D/g, "").length > 0) {
      setIsValid(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>CPF{required && <span className="text-destructive">*</span>}</Label>
      <Input
        id={id}
        value={formattedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="123.456.789-00"
        required={required}
        className={touched && !isValid ? "border-destructive" : ""}
      />
      {touched && !isValid && <p className="text-xs text-destructive">CPF inválido</p>}
    </div>
  )
}
