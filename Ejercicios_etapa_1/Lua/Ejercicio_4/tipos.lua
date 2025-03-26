-- MODULO: tipos.lua
-- Este módulo contiene funciones para evaluar tipos y valores en Lua

-- 📌 Función checarTipo: Verifica si el tipo de una variable coincide con el esperado
local function checarTipo(variable, tipoEsperado)
  local tipo = type(variable)
  local resultado = (tipo == tipoEsperado)
  return string.format("La variable es %s: %s", tipoEsperado, tostring(resultado))
end


-- 📌 Función falsosoVerdadoso: Evalúa valores falsy y truthy en Lua
--  si valor es ni, devuelve "El elemento es nil (equivalente a null en JavaScript)"
--  si valor es false, devuelve "El elemento es falsy: ${valor}"
--  si el valor es truthy, devuelve "El elemento es truthy ${valor}"
local function falsosoVerdadoso(valor)
  local tipoo = type(valor)
  local mensaje = "El elemento es "

  if tipoo == "nil" then
    mensaje = mensaje .. "nil (equivalente a null en JavaScript)"

  elseif tostring(valor) == "false" then
    mensaje = mensaje .. "falsy: " .. tostring(valor)

  else
    mensaje = mensaje .. "truthy: " .. tostring(valor)
  end

  return mensaje

end


-- 📌 Función divisionSegura: Realiza una división con manejo de errores
local function divisionSegura(dividendo, divisor)
  local tipoDividendo = type(dividendo)
  local tipoDivisor = type(divisor)


  if tipoDividendo == "nil" then

    return "Error: Uno de los valores es nil"

  elseif tipoDivisor == "nil" then

    return "Error: Uno de los valores es nil"


  elseif tipoDividendo ~= "number" then

    return "Error: Uno de los valores no es un número"

  elseif tipoDivisor ~= "number" then

    return "Error: Uno de los valores no es un número"

  elseif divisor == 0 then

    return "Error: No se puede dividir por 0"

  else
    local resultadodiv = dividendo/divisor
    return string.format("El resultado de dividir %s entre %s es %s", dividendo, divisor, resultadodiv)
  end

end

-- 📌 Función valorSeguro: Manejo de valores `nil` y truthy/falsy
-- 📌 Exportamos las funciones para el test
--    si el valor es nil, devuelve "El valor es nil (ausencia intencional de dato"
--    Si el valor es false, devuelve "El valor es falsy pero definido: ${valor}"
--    si el valor es truthy, devuelve El valor es válido: ${valor}
local function valorSeguro(valor)
  local tipoValor = type(valor)

 if tipoValor == "nil" then
  return "El valor es nil (ausencia intencional de datos)"

 elseif tostring(valor) == "false" then
  return string.format("El valor es falsy pero definido: %s", tostring(valor))

 else
  return string.format("El valor es válido: %s", tostring(valor))
 end

end


return {
    checarTipo = checarTipo,
    falsosoVerdadoso = falsosoVerdadoso,
    divisionSegura = divisionSegura,
    valorSeguro = valorSeguro
}
