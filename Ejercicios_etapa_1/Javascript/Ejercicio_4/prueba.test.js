import { describe, it, expect } from "vitest"
import { checarTipo, falsosoVerdadoso, divisionSegura, valorSeguro } from "./index.js"

describe('checarTipo', () => {
    it('Debe devolver si la variable es el tipo esperado', () => {
        expect(checarTipo(21, "number")).toBe("La variable es 21: true")
        expect(checarTipo("String", "number")).toBe("La variable es String: false")
        expect(checarTipo(21, "string")).toBe("La variable es 21: false")
        expect(checarTipo("21", "string")).toBe("La variable es 21: true")
    })
})

describe("falsosoVerdadoso", () => {
    it("Debe identificar correctamente los valores falsy", () => {
        expect(falsosoVerdadoso(0)).toBe("El elemento es falsy: true");
        expect(falsosoVerdadoso("")).toBe("El elemento es falsy: true");
        expect(falsosoVerdadoso(null)).toBe("El elemento es falsy: true");
        expect(falsosoVerdadoso(undefined)).toBe("El elemento es falsy: true");
        expect(falsosoVerdadoso(NaN)).toBe("El elemento es falsy: true");
    });

    it("Debe identificar correctamente el booleano false", () => {
        expect(falsosoVerdadoso(false)).toBe("El elemento es el booleano false");
    });

    it("Debe identificar correctamente el booleano true", () => {
        expect(falsosoVerdadoso(true)).toBe("El elemento es el booleano true");
    });

    it("Debe identificar correctamente los valores truthy", () => {
        expect(falsosoVerdadoso(42)).toBe("El elemento es truthy: true");
        expect(falsosoVerdadoso("Hola")).toBe("El elemento es truthy: true");
        expect(falsosoVerdadoso([])).toBe("El elemento es truthy: true");
        expect(falsosoVerdadoso({})).toBe("El elemento es truthy: true");
    });
});

describe("divisionSegura", () => {
    it("Debe devolver el resultado correcto cuando los valores son números válidos", () => {
        expect(divisionSegura(10, 2)).toBe("El resultado de dividir 10 entre 2 es 5");
        expect(divisionSegura(100, 4)).toBe("El resultado de dividir 100 entre 4 es 25");
    });

    it("Debe manejar errores cuando un valor no es un número", () => {
        expect(divisionSegura("Hola", 2)).toBe("Error: Uno de los valores no es un número");
        expect(divisionSegura(10, "Mundo")).toBe("Error: Uno de los valores no es un número");
        expect(divisionSegura(50, undefined)).toBe("Error: Uno de los valores no es un número");
    });

    it("Debe manejar errores cuando se divide por 0", () => {
        expect(divisionSegura(10, 0)).toBe("Error: No se puede dividir por 0");
    });

    it("Debe manejar NaN correctamente", () => {
        expect(divisionSegura(NaN, 5)).toBe("Error: Uno de los valores es NaN");
        expect(divisionSegura(0 / 0, 5)).toBe("Error: Uno de los valores es NaN");
    });
});

describe("valorSeguro", () => {
    it("Debe detectar null", () => {
        expect(valorSeguro(null)).toBe("El valor es null (ausencia intencional de datos)");
    });

    it("Debe detectar undefined", () => {
        expect(valorSeguro(undefined)).toBe("El valor es undefined (valor no asignado)");
    });

    it("Debe detectar valores falsy pero definidos", () => {
        expect(valorSeguro(0)).toBe("El valor es falsy pero definido: 0");
        expect(valorSeguro("")).toBe("El valor es falsy pero definido: ");
        expect(valorSeguro(false)).toBe("El valor es falsy pero definido: false");
        expect(valorSeguro(NaN)).toBe("El valor es falsy pero definido: NaN");
    });

    it("Debe detectar valores truthy", () => {
        expect(valorSeguro("Hola")).toBe("El valor es válido: Hola");
        expect(valorSeguro(42)).toBe("El valor es válido: 42");
        expect(valorSeguro([])).toBe("El valor es válido: ");
        expect(valorSeguro({})).toBe("El valor es válido: [object Object]");
    });
});
