import { describe, it, expect } from "vitest"
import { doble, triple, dobleMasTriple } from "./index.js"

describe("doble", () => {
  it("Debe devolver el doble del número", () => {
    expect(doble(2)).toBe(4)
    expect(doble(5)).toBe(10)
    expect(doble(-3)).toBe(-6)
    expect(doble(0)).toBe(0)
  })
})

describe("triple", () => {
  it("Debe devolver el triple del número", () => {
    expect(triple(3)).toBe(9)
    expect(triple(4)).toBe(12)
    expect(triple(-2)).toBe(-6)
    expect(triple(0)).toBe(0)
  })
})

describe("dobleMasTriple", () => {
  it("Debe devolver la suma del doble y el triple del número", () => {
    expect(dobleMasTriple(2)).toBe(10) // 4 + 6 = 10
    expect(dobleMasTriple(5)).toBe(25) // 10 + 15 = 25
    expect(dobleMasTriple(-3)).toBe(-15) // -6 + -9 = -15
    expect(dobleMasTriple(0)).toBe(0) // 0 + 0 = 0
  })
})
