--[[
Calcula la edad en días dada una cantidad de años.
No se permite usar objetos Date.
Fórmula: años * 365 (ignoramos años bisiestos)

@param años: number - La edad en años
@return number - La edad en días

@example
-- Para 1 año, se espera 365
-- edadEnDias(1) --> 365

-- Para 0 años, se espera 0
-- edadEnDias(0) --> 0

-- Para 10 años, se espera 3650
-- edadEnDias(10) --> 3650
]]
local function edadEnDias(anios)
    return anios*365 -- Reemplazar por la implementación correcta
end

-- Ejemplo de uso
local resultado = edadEnDias(26)
print(resultado)

-- Para que la función pueda ser importada en el test, la devolvemos
return {
    edadEnDias = edadEnDias
}
