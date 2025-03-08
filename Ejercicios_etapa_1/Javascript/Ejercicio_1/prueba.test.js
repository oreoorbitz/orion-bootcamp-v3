import { describe, it, expect } from "vitest"
import { edadEnDias } from "./index.js" 

describe("edadEnDias", () => {
  it("debe calcular correctamente la edad en días para 1 año", () => {
    expect(edadEnDias(1)).toBe(365)
  })

  it("debe calcular correctamente la edad en días para 0 años", () => {
    expect(edadEnDias(0)).toBe(0)
  })

  it("debe calcular correctamente la edad en días para 10 años", () => {
    expect(edadEnDias(10)).toBe(3650)
  })
})
