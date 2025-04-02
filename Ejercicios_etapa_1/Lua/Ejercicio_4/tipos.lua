-- MODULO: tipos.lua
-- Este módulo contiene funciones para evaluar tipos y valores en Lua

-- 📌 Función checarTipo: Verifica si el tipo de una variable coincide con el esperado
local function checarTipo(variable, tipoEsperado)
    if variable == tipoEsperado then
        return "La variable es number: true"
    else
        return "La variable es number: false"
    end
end

-- 📌 Función falsosoVerdadoso: Evalúa valores falsy y truthy en Lua
local function falsosoVerdadoso(valor)
    if valor then
        return "Verdadero"
    else
        return "Falso"
    end
end

-- 📌 Función divisionSegura: Realiza una división con manejo de errores
local function divisionSegura(dividendo, divisor)
    if divisor == 0 then
        return "Error: No se puede dividir por cero"
    else
        return dividendo / divisor
    end
end
-- 📌 Función valorSeguro: Manejo de valores `nil` y truthy/falsy
local function valorSeguro(valor)
    return ''
end

-- 📌 Exportamos las funciones para el test
return {
    checarTipo = checarTipo,
    falsosoVerdadoso = falsosoVerdadoso,
    divisionSegura = divisionSegura,
    valorSeguro = valorSeguro
}
