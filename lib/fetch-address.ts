import type { Address } from "./court-state"

export async function fetchAddressByCEP(cep: string): Promise<Address | null> {
  try {
    // Remove caracteres não numéricos
    const cleanCEP = cep.replace(/[^\d]/g, "")

    if (cleanCEP.length !== 8) {
      return null
    }

    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
    const data = await response.json()

    if (data.erro) {
      return null
    }

    return {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      number: "",
      complement: "",
    }
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
    return null
  }
}
