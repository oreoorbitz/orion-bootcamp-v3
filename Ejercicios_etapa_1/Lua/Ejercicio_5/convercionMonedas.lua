--[[
EJERCICIO 5: CONVERSIÓN DE CENTAVOS A FORMATO MONETARIO

Instrucciones:
  1. Implementa una función llamada "convertirCentsAMoneda" que reciba dos parámetros:
       - centavos: número entero que representa la cantidad en centavos.
       - codigoMoneda: string con el código de la moneda (por ejemplo, "USD", "EUR", "GBP").

  2. Utiliza el siguiente objeto (tabla) "monedas" que mapea códigos de moneda a sus respectivos símbolos:

       local monedas = {
         USD = "$",
         EUR = "€",
         GBP = "£"
       }

  3. La función debe:
       a. Retornar "Valor invalido" si centavos es negativo.
       b. Retornar "Codigo de moneda invalido" si codigoMoneda no se encuentra en la tabla "monedas".
          Estas validaciones deben hacerse de forma temprana (early return).
       c. Convertir centavos a la unidad monetaria dividiendo por 100.
       d. Formatear el resultado a dos decimales utilizando string.format("%.2f", value).
       e. Retornar un string que combine el símbolo (obtenido de la tabla "monedas") con el valor formateado.

Ejemplos:
  convertirCentsAMoneda(1234, "USD") => "$12.34"
  convertirCentsAMoneda(50, "EUR")  => "€0.50"
  convertirCentsAMoneda(-100, "GBP") => "Valor invalido"
  convertirCentsAMoneda(200, "ABC")  => "Codigo de moneda invalido"
]]--

-- Tabla que mapea códigos de moneda a sus respectivos símbolos.
local monedas = {
  USD = "$",
  EUR = "€",
  GBP = "£"
}

--- Convierte una cantidad en centavos a un formato monetario.
-- @param centavos (number): Número entero que representa la cantidad en centavos.
-- @param codigoMoneda (string): Código de la moneda (por ejemplo, "USD", "EUR", "GBP").
-- @return (string): Valor formateado en la moneda correspondiente o un mensaje de error si los parámetros no son válidos.
local function convertirCentsAMoneda(centavos, codigoMoneda)


 if (centavos < 0) then
  return "Valor invalido"
 end

if (monedas[codigoMoneda] == nil ) then
  return "Codigo de moneda invalido"
end

local valorEntero = tonumber(string.format("%.2f", centavos/100))

local simboloMoneda = monedas[codigoMoneda]

return string.format("%s%.2f",simboloMoneda, valorEntero)
end

-- Ejemplos de uso:
local conversion = convertirCentsAMoneda(-4000, "GBP")
local conversionDos = convertirCentsAMoneda(1000, "EURR")
local conversionTres = convertirCentsAMoneda(2000, "USD")

print(conversion)       -- "Valor invalido"
print(conversionDos)    -- "Codigo de moneda invalido"
print(conversionTres)   -- "$20.00"

-- Para que funcione la prueba:
return { convertirCentsAMoneda = convertirCentsAMoneda }
