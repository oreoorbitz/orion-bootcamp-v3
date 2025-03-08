-- Aseguramos que la carpeta actual esté en el path de búsqueda de módulos
package.path = "./?.lua;" .. package.path

local nombreModule = require("cualEsTuNombre")
local cualEsTuNombre = nombreModule.cualEsTuNombre

describe("cualEsTuNombre", function()
    it("Debe devolver 'Hola Juan Pérez!'", function()
        assert.are.equal("Hola Juan Pérez!", cualEsTuNombre("Juan", "Pérez"))
    end)

    it("Debe devolver 'Hola Ana Gómez!'", function()
        assert.are.equal("Hola Ana Gómez!", cualEsTuNombre("Ana", "Gómez"))
    end)
end)
