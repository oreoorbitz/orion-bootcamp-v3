-- modules/get_product_handles_and_ids.lua
-- Función que combina IDs y Handles en una nueva tabla

-- TODO: importa las funciones desde utils.lua
-- local utils = require("utils")

local function getProductHandlesAndIds(products)
    local handles = utils.getProductHandles(products)
    local ids = utils.getProductIds(products)

    local resultado = {}
    for i = 1, #products do
        table.insert(resultado, {
            id = ids[i],
            handle = handles[i]
        })
    end

    return resultado
end

-- Aquí debe ir el return de getProductHandlesAndIds
