/**
 * crearReactivo
 *
 * Esta función implementa el patrón Factory usando clases para crear objetos Reactivo.
 * Cada objeto Reactivo debe tener las propiedades "nombre", "cantidad" y "unidad", y un método "describir"
 * que retorne un mensaje como "El reactivo <nombre> tiene <cantidad><unidad>".
 *
 * @param {string} nombre - El nombre del reactivo.
 * @param {number} cantidad - La cantidad del reactivo.
 * @param {string} unidad - El código de la unidad (por ejemplo, "MG", "G", "KG").
 * @returns {{ nombre: string, cantidad: number, unidad: string, describir: () => string }} Un nuevo objeto Reactivo.
 */
export function crearReactivo(nombre, cantidad, unidad) {
    // TODO: Crea una clase constructora llamada Reactivo.
    // function Reactivo(nombre, cantidad, unidad) { ... }

    // TODO: Agrega un método "describir" al prototipo de Reactivo.
    // Reactivo.prototype.describir = function() { ... }

    // TODO: Retorna una nueva instancia de Reactivo.
    return {}; // Reemplazar por la implementación correcta.
}

// Ejemplo de uso
const reactivoProto = crearReactivo("Acetona", 1234, "MG");
console.log(reactivoProto.describir()); // "El reactivo Acetona tiene 1.23mg"


/**
 * Clase Reactivo
 *
 * Esta clase representa un reactivo químico con nombre, cantidad y unidad.
 * Incluye un método "describir" que devuelve un mensaje con su información.
 */
export class Reactivo {
    /**
     * Crea una nueva instancia de Reactivo.
     * @param {string} nombre - El nombre del reactivo.
     * @param {number} cantidad - La cantidad del reactivo.
     * @param {string} unidad - El código de la unidad.
     */
    constructor(nombre, cantidad, unidad) {
        // TODO: Asigna las propiedades nombre, cantidad y unidad.
    }

    /**
     * Método para describir el reactivo.
     * @returns {string} Un mensaje en el formato "El reactivo <nombre> tiene <cantidad><unidad>".
     */
    describir() {
        // TODO: Retorna un string con la descripción del reactivo.
        return "";
    }
}

// Ejemplo de uso
const reactivoClase = new Reactivo("Etanol", 500, "G");
console.log(reactivoClase.describir()); // "El reactivo Etanol tiene 0.50g"


/**
 * Clase Notificador
 *
 * Esta clase implementa el patrón PubSub para notificar eventos en un laboratorio.
 * Se utiliza para comunicar, por ejemplo, cuando un reactivo es agregado.
 */
export class Notificador {
    // TODO: Define una propiedad estática TOPICS que contenga eventos como:
    // REACTIVO_AGREGADO, REACTIVO_ELIMINADO

    constructor() {
        // TODO: Crea un objeto llamado "temas" para almacenar los escuchadores por cada evento.
        // TODO: (Opcional) Guarda una referencia para validar temas si es necesario.
    }

    /**
     * suscribirse
     *
     * Este método permite suscribirse a un evento específico. Guarda un callback asociado al evento.
     * @param {string} evento - El nombre del evento.
     * @param {(info?: any) => void} escuchador - Función que se ejecutará cuando se publique el evento.
     * @returns {{ remover: () => void }} Un objeto con un método para remover la suscripción.
     */
    suscribirse(evento, escuchador) {
        // TODO: Si el evento no existe en this.temas, inicialízalo con un array vacío.
        // TODO: Agrega el escuchador al array y guarda su posición.
        // TODO: Retorna un objeto con una función "remover" para cancelar la suscripción.
        return {
            remover: () => {},
        };
    }

    /**
     * publicar
     *
     * Este método permite emitir un evento y pasar información opcional a los suscriptores.
     * @param {string} evento - El nombre del evento a emitir.
     * @param {any} info - Información opcional que se pasará al callback del escuchador.
     */
    publicar(evento, info) {
        // TODO: Si no hay escuchadores para este evento, salir de la función.
        // TODO: Ejecuta todos los escuchadores del evento, pasando la info como argumento.
    }
}

// Ejemplo de uso:
// const notificador = new Notificador();
// const cancel = notificador.suscribirse("REACTIVO_AGREGADO", (info) => {
//     console.log("Se agregó el reactivo:", info.reactivo);
// });
// notificador.publicar("REACTIVO_AGREGADO", { reactivo: "Acetona" });
// cancel.remover();
