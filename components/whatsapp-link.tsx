import type React from "react"
import { Phone } from "lucide-react"

interface WhatsAppLinkProps {
  phoneNumber: string
  children?: React.ReactNode
}

export function WhatsAppLink({ phoneNumber, children }: WhatsAppLinkProps) {
  // Remove todos os caracteres não numéricos
  const cleanedNumber = phoneNumber.replace(/\D/g, "")

  // Cria o link do WhatsApp
  const whatsappUrl = `https://wa.me/${cleanedNumber}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-primary hover:underline"
    >
      {children || (
        <>
          <Phone className="h-3 w-3 mr-1" />
          <span>{phoneNumber}</span>
        </>
      )}
    </a>
  )
}
