--[[
EJERCICIO 7: PATRÓN FACTORY Y PUBSUB EN LUA

Instrucciones:
  1. Implementa una función "crearUsuarioConMetatable" que simule el patrón Factory para crear objetos Usuario.
     Cada objeto Usuario debe tener las propiedades "nombre" y "rol", y un método "saludar" que retorne un string
     como "Hola, soy <nombre> y soy <rol>".
     
  2. Implementa una "clase" Usuario usando metatables. Define un método "new" para crear instancias y un método "saludar"
     que se herede en cada instancia.

  3. Implementa una "clase" PublicadorSubscriptor que permita suscribirse a eventos y publicar información a los suscriptores.
     - Define una propiedad estática TEMAS (una tabla) con algunos eventos, por ejemplo:
         MOSTRAR_NOTIFICACION_ERROR, MOSTRAR_NOTIFICACION_EXITO.
     - El método "suscribirse" debe aceptar un evento y un escuchador (función) y almacenar el escuchador en una tabla interna.
       Debe retornar un objeto con un método "remover" para cancelar la suscripción.
     - El método "publicar" debe ejecutar todos los escuchadores asociados al evento, pasando la información proporcionada.

NOTA:
  - En Lua no existen prototipos como en JavaScript, por lo que se usan metatables para simular clases y herencia.
  - Usa la sintaxis de dos puntos (:) para definir métodos que reciben implícitamente "self".
]]--

-- IMPLEMENTACIÓN DEL PATRÓN FACTORY CON METATABLES

-- "Clase" Usuario
local Usuario = {}
Usuario.__index = Usuario

--- Crea una nueva instancia de Usuario.
-- @param nombre string: El nombre del usuario.
-- @param rol string: El rol del usuario (ejemplo: "admin", "cliente", etc.).
-- @return table: Una nueva instancia de Usuario.
function Usuario:new(nombre, rol)
    -- TODO: Crea una nueva tabla para la instancia y asigna las propiedades "nombre" y "rol".
    -- Ejemplo: instancia.nombre = nombre, instancia.rol = rol.
    error("TODO: Implementar Usuario:new")
end

--- Método saludar de Usuario.
-- @return string: Un mensaje de saludo en el formato "Hola, soy <nombre> y soy <rol>".
function Usuario:saludar()
    -- TODO: Retorna el saludo utilizando las propiedades de la instancia.
    error("TODO: Implementar Usuario:saludar")
end

--- Función factory para crear un Usuario usando metatables.
-- @param nombre string: El nombre del usuario.
-- @param rol string: El rol del usuario.
-- @return table: Una instancia de Usuario.
function crearUsuarioConMetatable(nombre, rol)
    -- TODO: Retorna una nueva instancia de Usuario utilizando el método new.
    error("TODO: Implementar crearUsuarioConMetatable")
end

-- Ejemplo de uso de la función factory:
-- local usuarioMetatable = crearUsuarioConMetatable("Luis", "admin")
-- print(usuarioMetatable:saludar())  -- "Hola, soy Luis y soy admin"

-------------------------------------------------------
-- IMPLEMENTACIÓN DEL PATRÓN PUBSUB

local PublicadorSubscriptor = {}
PublicadorSubscriptor.__index = PublicadorSubscriptor

-- Define TEMAS como propiedad estática
PublicadorSubscriptor.TEMAS = {
    MOSTRAR_NOTIFICACION_ERROR = "MOSTRAR_NOTIFICACION_ERROR",
    MOSTRAR_NOTIFICACION_EXITO = "MOSTRAR_NOTIFICACION_EXITO"
}

--- Crea una nueva instancia de PublicadorSubscriptor.
-- @return table: Una nueva instancia de PublicadorSubscriptor.
function PublicadorSubscriptor:new()
    -- TODO: Crea una nueva tabla para la instancia y inicializa la propiedad "temas" para almacenar escuchadores.
    error("TODO: Implementar PublicadorSubscriptor:new")
end

--- Permite suscribirse a un evento.
-- @param evento string: El nombre del evento.
-- @param escuchador function: Función que se ejecutará cuando se publique el evento.
-- @return table: Un objeto con un método "remover" para cancelar la suscripción.
function PublicadorSubscriptor:suscribirse(evento, escuchador)
    -- TODO: Verifica si ya existe una tabla para el evento; si no, crea una nueva.
    -- Agrega el escuchador a la tabla del evento.
    -- Retorna un objeto con un método "remover" que permita cancelar la suscripción.
    error("TODO: Implementar PublicadorSubscriptor:suscribirse")
end

--- Publica un evento, ejecutando todos los escuchadores asociados.
-- @param evento string: El nombre del evento.
-- @param info any: Información opcional a pasar a los escuchadores.
function PublicadorSubscriptor:publicar(evento, info)
    -- TODO: Recupera la tabla de escuchadores para el evento.
    -- Si existen escuchadores, itera sobre ellos y ejecútalos pasando la información.
    error("TODO: Implementar PublicadorSubscriptor:publicar")
end

-- Ejemplo de uso de PublicadorSubscriptor:
-- local pubsub = PublicadorSubscriptor:new()
-- local suscripcion = pubsub:suscribirse(PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, function(info)
--     print("Se recibió el evento con info: " .. info.mensaje)
-- end)
-- pubsub:publicar(PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, { mensaje = "¡Hola mundo!" })
-- suscripcion.remover()  -- Cancela la suscripción

-------------------------------------------------------
-- Retorna los módulos para posibles pruebas.
return {
    crearUsuarioConMetatable = crearUsuarioConMetatable,
    Usuario = Usuario,
    PublicadorSubscriptor = PublicadorSubscriptor
}
