import { describe, it, expect } from 'vitest'
import { 
  accederArray, 
  manipulaArray, 
  sumarElementos, 
  generarRango, 
  organizarPorTipo, 
  miMapa, 
  miFilter, 
  miReduce, 
  usaMap, 
  usaFilter, 
  usaReduce 
} from './index.js'

describe("accederArray", () => {
  it("debe retornar el elemento en el array según el índice", () => {
    const arr = ['a', 2, 'c']
    expect(accederArray(arr, 0)).toBe('a')
    expect(accederArray(arr, 1)).toBe(2)
    expect(accederArray(arr, 2)).toBe('c')
  })
})

describe("manipulaArray", () => {
  it("debe retornar el segundo elemento del nuevo array", () => {
    // For example, if the function pushes "x", "y", "z", then the second element is "y"
    expect(manipulaArray([], "x", "y", "z")).toBe("y")
  })
})

describe("sumarElementos", () => {
  it("debe retornar la suma de todos los elementos si son números", () => {
    expect(sumarElementos([200, 200, 20])).toBe(420)
  })
  it("debe retornar 'Datos inválidos' si algún elemento no es un número", () => {
    expect(sumarElementos([200, "200", 20])).toBe("Datos inválidos")
  })
})

describe("generarRango", () => {
  it("debe retornar un array con números desde 0 hasta n (inclusive)", () => {
    expect(generarRango(5)).toEqual([0, 1, 2, 3, 4, 5])
  })
  it("debe retornar 'Datos inválidos' si n no es un número", () => {
    expect(generarRango("a")).toBe("Datos inválidos")
  })
})

describe("organizarPorTipo", () => {
  it("debe devolver un objeto con las propiedades 'strings' y 'numbers'", () => {
    const input = [1, "hola", 3, "mundo", true]
    // Suponiendo que los booleans se ignoran, se espera:
    expect(organizarPorTipo(input)).toEqual({
      numbers: [1, 3],
      strings: ["hola", "mundo"]
    })
  })
})

describe("miMapa", () => {
  it("debe retornar un nuevo array con la función aplicada a cada elemento", () => {
    const doble = x => x * 2
    expect(miMapa([1, 2, 3, 4], doble)).toEqual([2, 4, 6, 8])
  })
})

describe("miFilter", () => {
  it("debe retornar un nuevo array con los elementos que cumplen la condición", () => {
    const esPar = x => x % 2 === 0
    expect(miFilter([1, 2, 3, 4, 5, 6], esPar)).toEqual([2, 4, 6])
  })
})

describe("miReduce", () => {
  it("debe retornar el resultado acumulado tras aplicar la función reductora", () => {
    const sumar = (acc, val) => acc + val
    expect(miReduce([1, 2, 3, 4], sumar, 0)).toBe(10)
  })
})

describe("usaMap", () => {
  it("debe retornar un nuevo array usando el método .map", () => {
    const multiplicarPorTres = x => x * 3
    expect(usaMap([1, 2, 3, 4], multiplicarPorTres)).toEqual([3, 6, 9, 12])
  })
})

describe("usaFilter", () => {
  it("debe retornar un nuevo array usando el método .filter", () => {
    const esImparejo = x => x % 2 !== 0
    expect(usaFilter([1, 2, 3, 4, 5, 6], esImparejo)).toEqual([1, 3, 5])
  })
})

describe("usaReduce", () => {
  it("debe retornar el resultado acumulado usando el método .reduce", () => {
    const multiplicar = (acc, val) => acc * val
    expect(usaReduce([1, 2, 3, 4], multiplicar, 1)).toBe(24)
  })
})
