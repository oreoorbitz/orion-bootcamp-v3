-- main.lua
-- Punto de entrada para ejecutar la funcionalidad

-- TODO: importa products 
-- TODO: importa getProductHandlesAndIds 

local resultado = getProductHandlesAndIds(products)

-- Imprime el resultado
for i, producto in ipairs(resultado) do
    print(string.format("Producto %d: id=%d, handle=%s", i, producto.id, producto.handle))
end
