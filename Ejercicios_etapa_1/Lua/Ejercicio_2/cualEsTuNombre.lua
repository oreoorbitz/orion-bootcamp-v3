--[[
Genera un saludo utilizando el nombre de una persona.
Debe devolver "Hola, <primerNombre> <apellido>!" (incluyendo la exclamación al final)

@param primerNombre: string - El primer nombre de la persona
@param apellido: string - El apellido de la persona
@return string - El mensaje de saludo

@example
-- Para "Juan" y "Pérez", se espera "Hola Juan Pérez!"
-- cualEsTuNombre("Juan", "Pérez")

-- Para "Ana" y "Gómez", se espera "Hola Ana Gómez!"
-- cualEsTuNombre("Ana", "Gómez")
]]

local function cualEsTuNombre(primerNombre, apellido)
    return string.format("Hola %s %s!", primerNombre, apellido) -- Reemplazar con la implementación correcta
end

-- Ejemplo de uso
local resultado = cualEsTuNombre("Paola", "Nava")
print(resultado)

-- Para permitir la importación en la prueba
return {
    cualEsTuNombre = cualEsTuNombre
}
