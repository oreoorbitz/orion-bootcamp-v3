-- MODULO: tipos.lua
-- Este módulo contiene funciones para evaluar tipos y valores en Lua

-- 📌 Función checarTipo: Verifica si el tipo de una variable coincide con el esperado
local function checarTipo(variable, tipoEsperado)
    return string.format("La variable es %s: %s", tipoEsperado, tostring(type(variable) == tipoEsperado))
end


-- 📌 Función falsosoVerdadoso: Evalúa valores falsy y truthy en Lua
local function falsosoVerdadoso(valor)
    if valor == false then
        return "El elemento es falsy: false" 
    elseif valor == nil then
        return "El elemento es nil (equivalente a null en JavaScript)"
    elseif not valor then
        return string.format("El elemento es falsy: %s", tostring(valor))
    else
        return string.format("El elemento es truthy: %s", tostring(valor))
    end
end

-- 📌 Función divisionSegura: Realiza una división con manejo de errores
local function divisionSegura(dividendo, divisor)
    if type(dividendo) ~= "number" or type(divisor) ~= "number" then
        return "Error: Uno de los valores no es un número"
    end
    if dividendo ~= dividendo or divisor ~= divisor then
        return "Error: Uno de los valores es NaN"
    end

    if divisor == 0 then
        return "Error: No se puede dividir por 0"
    end

    local resultado = dividendo / divisor
    return string.format("El resultado de dividir %d entre %d es %f", dividendo, divisor, resultado)
end
-- 📌 Función valorSeguro: Manejo de valores `nil` y truthy/falsy
local function valorSeguro(valor)
    if valor == nil then
        return "El valor es nil (ausencia intencional de datos)"
    elseif not valor then
        return string.format("El valor es falsy pero definido: %s", tostring(valor))
    else
        return string.format("El valor es válido: %s", tostring(valor))
    end
end
    
-- 📌 Exportamos las funciones para el test
return {
    checarTipo = checarTipo,
    falsosoVerdadoso = falsosoVerdadoso,
    divisionSegura = divisionSegura,
    valorSeguro = valorSeguro
}
