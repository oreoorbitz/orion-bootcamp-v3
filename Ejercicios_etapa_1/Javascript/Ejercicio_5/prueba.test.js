import { describe, it, expect } from 'vitest'
import { convertirCentsAMoneda } from './index.js'

describe('convertirCentsAMoneda', () => {
  it('debe retornar "Valor invalido" cuando centavos es negativo', () => {
    expect(convertirCentsAMoneda(-100, "USD")).toBe("Valor invalido")
  })

  it('debe retornar "Codigo de moneda invalido" cuando el código de moneda no existe', () => {
    expect(convertirCentsAMoneda(200, "ABC")).toBe("Codigo de moneda invalido")
  })

  it('debe convertir centavos a formato monetario para USD', () => {
    expect(convertirCentsAMoneda(1234, "USD")).toBe("$12.34")
  })

  it('debe convertir centavos a formato monetario para EUR', () => {
    expect(convertirCentsAMoneda(50, "EUR")).toBe("€0.50")
  })

  it('debe convertir centavos a formato monetario para GBP', () => {
    expect(convertirCentsAMoneda(2000, "GBP")).toBe("£20.00")
  })
})
