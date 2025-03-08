package.path = "./?.lua;" .. package.path

local edadModule = require("edadEnDias")
local edadEnDias = edadModule.edadEnDias

describe("edadEnDias", function()
    it("debe calcular 365 para 1 año", function()
        assert.are.equal(365, edadEnDias(1))
    end)

    it("debe calcular 0 para 0 años", function()
        assert.are.equal(0, edadEnDias(0))
    end)

    it("debe calcular 3650 para 10 años", function()
        assert.are.equal(3650, edadEnDias(10))
    end)

    it("debe calcular 9490 para 26 años", function()
        assert.are.equal(9490, edadEnDias(26))
    end)
end)
