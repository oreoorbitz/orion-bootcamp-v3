--[[
    EJERCICIO DE MÚLTIPLES FUNCIONES EN LUA

    Instrucciones:
    1. Crea una función llamada "doble" que reciba un número y retorne el doble de ese número.
    2. Crea una función llamada "triple" que reciba un número y retorne el triple de ese número.
    3. Crea una función llamada "dobleMasTriple" que reciba un número y:
       - Use las funciones "doble" y "triple"
       - Retorne la suma del doble y el triple de ese número.

    Ejemplos:
    - doble(2) => 4
    - triple(3) => 9
    - dobleMasTriple(2) => 4 + 6 = 10
]]

-- Función que devuelve el doble de un número
local function doble(numero)
    return numero * 2 -- Reemplazar con la implementación correcta
end

-- Función que devuelve el triple de un número
local function triple(numero)
    return numero * 3 -- Reemplazar con la implementación correcta
end

-- Función que devuelve la suma del doble y el triple de un número
local function dobleMasTriple(numero)
    return doble(numero) + triple(numero) -- Reemplazar con la implementación correcta
end

-- Exportamos las funciones para que puedan ser requeridas en la prueba
return {
    doble = doble,
    triple = triple,
    dobleMasTriple = dobleMasTriple
}
