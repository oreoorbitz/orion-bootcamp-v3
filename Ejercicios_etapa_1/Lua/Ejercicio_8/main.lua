-- main.lua
-- Punto de entrada para ejecutar la funcionalidad

-- TODO: importa products
local products = require('data/products')
-- TODO: importa getProductHandlesAndIds
local productUtils = require('modules.get_product_handles_and_ids')

local resultado = productUtils.getProductHandlesAndIds(products)

-- Imprime el resultado
for i, producto in ipairs(resultado) do
    print(string.format("Producto %d: id=%d, handle=%s", i, producto.id, producto.handle))
end
