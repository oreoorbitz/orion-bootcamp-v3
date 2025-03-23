// @ts-check

/**
 * crearUsuarioConPrototipo
 *
 * Esta función implementa el patrón Factory usando una función constructora y prototipos.
 * Crea objetos de tipo Usuario con nombre y rol, y un método saludar en su prototipo.
 *
 * @param {string} nombre - El nombre del usuario.
 * @param {string} rol - El rol del usuario (por ejemplo: "admin", "cliente", etc.).
 * @returns {{ nombre: string, rol: string, saludar: () => string }} Un nuevo objeto Usuario.
 */
export function crearUsuarioConPrototipo(nombre, rol) {
    // TODO: Crea una función constructora llamada Usuario.
    // function Usuario(nombre, rol) { ... }

    // TODO: Agrega un método "saludar" al prototipo de Usuario.
    // Usuario.prototype.saludar = function () { ... }

    // TODO: Retorna una nueva instancia de Usuario.
    return {}; // Reemplazar por la implementación correcta.
}

// Ejemplo de uso
const usuarioProto = crearUsuarioConPrototipo("Luis", "admin");
console.log(usuarioProto.saludar()); // "Hola, soy Luis y soy admin."


/**
 * Clase Usuario
 *
 * Esta clase representa a un usuario con nombre y rol.
 * Incluye un método llamado saludar que devuelve un mensaje con su información.
 */
export class Usuario {
    /**
     * Crea una nueva instancia de Usuario.
     * @param {string} nombre - El nombre del usuario.
     * @param {string} rol - El rol del usuario.
     */
    constructor(nombre, rol) {
        // TODO: Asigna las propiedades nombre y rol
    }

    /**
     * Método para saludar mencionando el nombre y el rol del usuario.
     * @returns {string}
     */
    saludar() {
        // TODO: Retorna un string como "Hola, soy Ana y soy cliente."
        return "";
    }
}

// Ejemplo de uso
const usuarioClase = new Usuario("Ana", "cliente");
console.log(usuarioClase.saludar()); // "Hola, soy Ana y soy cliente."


/**
 * Clase PubSub
 *
 * En esta sección vas a implementar el patrón PubSub (Publisher-Subscriber) usando clases.
 * Este patrón se usa para comunicar diferentes partes de una aplicación sin acoplarlas directamente.
 *
 * Lee primero este artículo para entender cómo funciona:
 * https://www.codigonuevo.com/tecnologia/como-implementar-el-patron-pubsub-en-javascript
 *
 * NOTA: Algunas ideas clave que encontrarás en el artículo:
 * - El patrón PubSub se basa en tres conceptos: publisher, suscriber y un event bus.
 * - Tendrás una lista de eventos disponibles en `TOPICS`.
 * - Los métodos principales son `suscribirse` y `publicar`.
 */

export class PubSub {
    // TODO: Define una propiedad estática TOPICS que contenga eventos como:
    // SHOW_ERROR_NOTIFICATION, SHOW_SUCCESS_NOTIFICATION

    constructor() {
        // TODO: Crea un objeto llamado topics para almacenar los listeners por cada evento.

        // TODO: Guarda una referencia a Object.prototype.hasOwnProperty para validar topics.
    }

    /**
     * suscribirse
     *
     * Este método permite suscribirse a un evento específico. Guarda un callback asociado al evento.
     * @param {string} evento - El nombre del evento (topic).
     * @param {(info?: any) => void} listener - Función que se ejecutará cuando se publique ese evento.
     * @returns {{ remover: () => void }} Un objeto con método para remover la suscripción.
     */
    suscribirse(evento, listener) {
        // TODO: Si el evento no existe aún en this.topics, inicialízalo con un array vacío.

        // TODO: Agrega el listener al array y guarda su posición.

        // TODO: Retorna un objeto con una función `remover` para cancelar la suscripción.
        return {
            remover: () => {},
        };
    }

    /**
     * publicar
     *
     * Este método permite emitir un evento y pasar información opcional a los suscriptores.
     * @param {string} evento - El nombre del evento a emitir.
     * @param {any} info - Información opcional que se pasará al callback del listener.
     */
    publicar(evento, info) {
        // TODO: Si no hay listeners para este evento, salir de la función.

        // TODO: Ejecutar todos los listeners del evento, pasando la info como argumento.
    }
}

// Ejemplo de uso
// const pubsub = new PubSub();
// const cancel = pubsub.suscribirse("MI_EVENTO", (info) => {
//     console.log("Se recibió el evento con info:", info);
// });
// pubsub.publicar("MI_EVENTO", { mensaje: "¡Hola mundo!" });
// cancel.remover();