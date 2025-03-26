-- PRUEBAS: prueba.test.lua
package.path = "./?.lua;" .. package.path

local tipos = require("tipos")
local checarTipo = tipos.checarTipo
local falsosoVerdadoso = tipos.falsosoVerdadoso
local divisionSegura = tipos.divisionSegura
local valorSeguro = tipos.valorSeguro

describe("checarTipo", function()
    it("Debe devolver si la variable es el tipo esperado", function()
        assert.are.equal("La variable es number: true", checarTipo(21, "number"))
        assert.are.equal("La variable es number: false", checarTipo("Hola", "number"))
        assert.are.equal("La variable es string: true", checarTipo("Hola", "string"))
    end)
end)

describe("falsosoVerdadoso", function()
    it("Debe identificar correctamente los valores falsy", function()
        assert.are.equal("El elemento es nil (equivalente a null en JavaScript)", falsosoVerdadoso(nil))
        assert.are.equal("El elemento es falsy: false", falsosoVerdadoso(false))
    end)

    it("Debe identificar correctamente los valores truthy", function()
        assert.are.equal("El elemento es truthy: 0", falsosoVerdadoso(0))
        assert.are.equal("El elemento es truthy: ", falsosoVerdadoso(""))
        assert.are.equal("El elemento es truthy: Hola", falsosoVerdadoso("Hola"))
    end)
end)

describe("divisionSegura", function()
    it("Debe devolver el resultado correcto cuando los valores son números válidos", function()
        assert.are.equal("El resultado de dividir 10 entre 2 es 5", divisionSegura(10, 2))
    end)

    it("Debe manejar errores cuando un valor no es un número", function()
        assert.are.equal("Error: Uno de los valores no es un número", divisionSegura("Hola", 2))
    end)

    it("Debe manejar errores cuando se divide por 0", function()
        assert.are.equal("Error: No se puede dividir por 0", divisionSegura(10, 0))
    end)
end)

describe("valorSeguro", function()
    it("Debe detectar nil", function()
        assert.are.equal("El valor es nil (ausencia intencional de datos)", valorSeguro(nil))
    end)

    it("Debe detectar valores falsy pero definidos", function()
        assert.are.equal("El valor es falsy pero definido: false", valorSeguro(false))
    end)

    it("Debe detectar valores truthy", function()
        assert.are.equal("El valor es válido: Hola", valorSeguro("Hola"))
    end)
end)
