-- utils.lua
-- Funciones auxiliares para trabajar con productos

-- TODO: exporta las funciones getProductHandles y getProductIds

local function getProductHandles(products)
    local handles = {}
    for i = 1, #products do
        table.insert(handles, products[i].handle)
    end
    return handles
end

local function getProductIds(products)
    local ids = {}
    for i = 1, #products do
        table.insert(ids, products[i].id)
    end
    return ids
end

-- Aquí debe ir el return de la tabla de funciones
return {
  getProductHandles = getProductHandles,
  getProductIds = getProductIds
}
