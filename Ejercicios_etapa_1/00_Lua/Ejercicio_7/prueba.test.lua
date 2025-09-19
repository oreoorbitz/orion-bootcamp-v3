-- oop.test.lua
package.path = "./?.lua;" .. package.path
local oop = require("oop")

describe("Patrón Factory - Usuario", function()
    it("debe crear un usuario y retornar el saludo correcto", function()
        local usuario = oop.crearUsuarioConMetatable("Luis", "admin")
        local saludo = usuario:saludar()
        assert.are.equal("Hola, soy Luis y soy admin", saludo)
    end)
end)

describe("Patrón PubSub", function()
    it("debe notificar a los suscriptores cuando se publica un evento", function()
        local pubsub = oop.PublicadorSubscriptor:new()
        local mensajeRecibido = nil
        local suscripcion = pubsub:suscribirse(oop.PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, function(info)
            mensajeRecibido = info.mensaje
        end)
        pubsub:publicar(oop.PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, { mensaje = "¡Hola mundo!" })
        assert.are.equal("¡Hola mundo!", mensajeRecibido)
    end)

    it("debe cancelar la suscripción correctamente", function()
        local pubsub = oop.PublicadorSubscriptor:new()
        local contador = 0
        local suscripcion = pubsub:suscribirse(oop.PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, function(info)
            contador = contador + 1
        end)
        pubsub:publicar(oop.PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, { mensaje = "Evento 1" })
        suscripcion.remover()
        pubsub:publicar(oop.PublicadorSubscriptor.TEMAS.MOSTRAR_NOTIFICACION_EXITO, { mensaje = "Evento 2" })
        assert.are.equal(1, contador)
    end)
end)
