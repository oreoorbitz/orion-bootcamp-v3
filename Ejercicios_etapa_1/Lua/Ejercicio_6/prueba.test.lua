-- prueba.test.lua
package.path = "./?.lua;" .. package.path
local metaTablas = require("metaTablas")

describe("accederArray", function()
  it("debe retornar el elemento en la posición indicada", function()
    local arr = {'a', 'b', 'c'}
    -- En Lua, siendo 1-indexado, el índice 2 corresponde al segundo elemento.
    assert.are.equal('b', metaTablas.accederArray(arr, 2))
  end)
end)

describe("manipulaArray", function()
  it("debe retornar el segundo elemento del array creado", function()
    -- Se espera que se inserten tres elementos y se retorne el elemento en la posición 2.
    assert.are.equal(2, metaTablas.manipulaArray({}, 1, 2, 3))
  end)
end)

describe("sumarElementos", function()
  it("debe retornar la suma de todos los elementos cuando son números", function()
    assert.are.equal(420, metaTablas.sumarElementos({200, 200, 20}))
  end)
  it("debe retornar 'Datos inválidos' si algún elemento no es un número", function()
    assert.are.equal("Datos inválidos", metaTablas.sumarElementos({200, "200", 20}))
  end)
end)

describe("generarRango", function()
  it("debe retornar una tabla con números desde 0 hasta n (inclusive)", function()
    local esperado = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    assert.are.same(esperado, metaTablas.generarRango(10))
  end)
  it("debe retornar 'Datos inválidos' si n no es un número", function()
    assert.are.equal("Datos inválidos", metaTablas.generarRango("a"))
  end)
end)

describe("organizarPorTipo", function()
  it("debe devolver una tabla con 'strings' y 'numbers' separados", function()
    local resultado = metaTablas.organizarPorTipo({1, "hola", 3, "mundo"})
    local esperado = {
      numbers = {1, 3},
      strings = {"hola", "mundo"}
    }
    assert.are.same(esperado, resultado)
  end)
end)

describe("miMapa", function()
  it("debe retornar un nuevo array con la función aplicada a cada elemento", function()
    local doble = function(x) return x * 2 end
    local resultado = metaTablas.miMapa({1, 2, 3, 4}, doble)
    local esperado = {2, 4, 6, 8}
    assert.are.same(esperado, resultado)
  end)
end)

describe("miFilter", function()
  it("debe retornar un nuevo array con los elementos que cumplen la condición", function()
    local esPar = function(num) return num % 2 == 0 end
    local resultado = metaTablas.miFilter({1, 2, 3, 4, 5, 6}, esPar)
    local esperado = {2, 4, 6}
    assert.are.same(esperado, resultado)
  end)
end)

describe("miReduce", function()
  it("debe retornar el resultado acumulado tras aplicar la función reductora", function()
    local sumar = function(acumulador, valor) return acumulador + valor end
    assert.are.equal(10, metaTablas.miReduce({1, 2, 3, 4}, sumar, 0))
  end)
end)

describe("usaMap", function()
  it("debe retornar un nuevo array usando el método simulado de map", function()
    local multiplicarPorTres = function(x) return x * 3 end
    local resultado = metaTablas.usaMap({1, 2, 3, 4}, multiplicarPorTres)
    local esperado = {3, 6, 9, 12}
    assert.are.same(esperado, resultado)
  end)
end)

describe("usaFilter", function()
  it("debe retornar un nuevo array usando el método simulado de filter", function()
    local esImparejo = function(num) return num % 2 ~= 0 end
    local resultado = metaTablas.usaFilter({1, 2, 3, 4, 5, 6}, esImparejo)
    local esperado = {1, 3, 5}
    assert.are.same(esperado, resultado)
  end)
end)

describe("usaReduce", function()
  it("debe retornar el resultado acumulado usando el método simulado de reduce", function()
    local multiplicar = function(ac, val) return ac * val end
    assert.are.equal(24, metaTablas.usaReduce({1, 2, 3, 4}, multiplicar, 1))
  end)
end)
