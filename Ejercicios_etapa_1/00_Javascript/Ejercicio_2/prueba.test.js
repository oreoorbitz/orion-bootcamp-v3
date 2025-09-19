import { describe, it, expect } from "vitest"
import { cualEsTuNombre } from "./index.js" // Ensure correct path

describe("cualEsTuNombre", () => {
  it("Debe devolver 'Hola Juan Pérez!'", () => {
    expect(cualEsTuNombre("Juan", "Pérez")).toBe("Hola Juan Pérez!")
  })

  it("Debe devolver 'Hola Ana Gómez!'", () => {
    expect(cualEsTuNombre("Ana", "Gómez")).toBe("Hola Ana Gómez!")
  })
})
