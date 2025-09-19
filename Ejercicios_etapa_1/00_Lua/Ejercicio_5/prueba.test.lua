
---@class BustedAssert
---@field are table
---@field is table
---@field same fun(actual: any, expected: any)
---@field equal fun(actual: any, expected: any)
---@field truthy fun(value: any)
---@diagnostic disable-next-line: assign-type-mismatch
---@type BustedAssert
assert = assert

package.path = "./?.lua;" .. package.path

local convercionMonedas = require("convercionMonedas")
local convertirCentsAMoneda = convercionMonedas.convertirCentsAMoneda

describe("convertirCentsAMoneda", function()
  it("deberia retornar 'Valor invalido' cuando centavos es negativo", function()
    local resultado = convertirCentsAMoneda(-100, "USD")
    assert.are.equal("Valor invalido", resultado)
  end)

  it("deberia retornar 'Codigo de moneda invalido' cuando el codigo de moneda no existe", function()
    local resultado = convertirCentsAMoneda(200, "ABC")
    assert.are.equal("Codigo de moneda invalido", resultado)
  end)

  it("deberia convertir centavos a formato monetario para USD", function()
    local resultado = convertirCentsAMoneda(1234, "USD")
    assert.are.equal("$12.34", resultado)
  end)

  it("deberia convertir centavos a formato monetario para EUR", function()
    local resultado = convertirCentsAMoneda(50, "EUR")
    assert.are.equal("€0.50", resultado)
  end)

  it("deberia convertir centavos a formato monetario para USD (otro ejemplo)", function()
    local resultado = convertirCentsAMoneda(2000, "USD")
    assert.are.equal("$20.00", resultado)
  end)
end)
