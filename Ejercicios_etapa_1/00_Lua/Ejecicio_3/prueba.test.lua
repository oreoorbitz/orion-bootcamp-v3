-- Aseguramos que la carpeta actual esté en el path de búsqueda de módulos
package.path = "./?.lua;" .. package.path

-- Importamos el módulo de funciones
local mathFunctions = require("dobleMasTriple")

local doble = mathFunctions.doble
local triple = mathFunctions.triple
local dobleMasTriple = mathFunctions.dobleMasTriple

describe("doble", function()
    it("Debe devolver el doble del número", function()
        assert.are.equal(4, doble(2))
        assert.are.equal(10, doble(5))
        assert.are.equal(-6, doble(-3))
        assert.are.equal(0, doble(0))
    end)
end)

describe("triple", function()
    it("Debe devolver el triple del número", function()
        assert.are.equal(9, triple(3))
        assert.are.equal(12, triple(4))
        assert.are.equal(-6, triple(-2))
        assert.are.equal(0, triple(0))
    end)
end)

describe("dobleMasTriple", function()
    it("Debe devolver la suma del doble y el triple del número", function()
        assert.are.equal(10, dobleMasTriple(2)) -- 4 + 6 = 10
        assert.are.equal(25, dobleMasTriple(5)) -- 10 + 15 = 25
        assert.are.equal(-15, dobleMasTriple(-3)) -- -6 + -9 = -15
        assert.are.equal(0, dobleMasTriple(0)) -- 0 + 0 = 0
    end)
end)
