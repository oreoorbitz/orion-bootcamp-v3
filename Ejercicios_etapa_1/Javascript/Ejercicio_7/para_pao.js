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
  function Reactivo (nombre, cantidad, unidad) {
    this.nombre = nombre,
    this.cantidad = cantidad,
    this.unidad = unidad
  }
    // TODO: Agrega un método "describir" al prototipo de Reactivo.
    // Reactivo.prototype.describir = function() { ... }
  Reactivo.prototype.describir = function() {
    return `El reactivo ${this.nombre} tiene ${this.cantidad}${this.unidad}`
  }
    // TODO: Retorna una nueva instancia de Reactivo.
    return new Reactivo(nombre, cantidad,unidad); // Reemplazar por la implementación correcta.
}

// Ejemplo de uso
const reactivoProto = crearReactivo("Acetona", 1234, "MG");
console.log(reactivoProto.describir()); // "El reactivo Acetona tiene 1234mg"


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
        this.nombre = nombre,
        this.cantidad = cantidad,
        this.unidad = unidad
    }

    /**
     * Método para describir el reactivo.
     * @returns {string} Un mensaje en el formato "El reactivo <nombre> tiene <cantidad><unidad>".
     */
    describir() {
        // TODO: Retorna un string con la descripción del reactivo.
        return `El reactivo ${this.nombre} tiene ${this.cantidad}${this.unidad}`;
    }
}

// Ejemplo de uso
const reactivoClase = new Reactivo("Etanol", 500, "G");
console.log(reactivoClase.describir()); // "El reactivo Etanol tiene 500g"


/**
 * Clase Notificador
 *
 * Esta clase implementa el patrón PubSub para notificar eventos en un laboratorio.
 * Se utiliza para comunicar, por ejemplo, cuando un reactivo es agregado.
 */
  const REACTIVO_AGREGADO = 'AGREGADO';
  const REACTIVO_ELIMINADO = 'ELIMINADO';
export class Notificador {
    // TODO: Define una propiedad estática TOPICS que contenga eventos como:
    // REACTIVO_AGREGADO, REACTIVO_ELIMINADO
  static TEMAS = {
    REACTIVO_AGREGADO: 'AGREGADO',
    REACTIVO_ELIMINADO: 'ELIMINADO',
  }
    constructor() {
        // TODO: Crea un objeto llamado "temas" para almacenar los escuchadores por cada evento.
        this.eventos = { }
        // TODO: (Opcional) Guarda una referencia para validar temas si es necesario.
        this.hOP = Object.prototype.hasOwnProperty;
    }

    /**
     * suscribirse
     *
     * Este método permite suscribirse a un evento específico. Guarda un callback asociado al evento.
     * @param {string} evento - El nombre del evento.
     * @param {(info?: any) => void} escuchador - Función que se ejecutará cuando se publique el evento.
     * @returns {{ removedor: () => void }} Un objeto con un método para removedor la suscripción.
     */
    suscribirse(evento, escuchador) {
        // TODO: Si el evento no existe en this.temas, inicialízalo con un array vacío.
        let eventoActual = this.eventos[evento]
        if (!this.hOP.call(this.eventos, evento)) eventoActual = [ ];

        // TODO: Agrega el escuchador al array y guarda su posición.
        const longitud = eventoActual.push(escuchador)
        const index = longitud - 1;
        // TODO: Retorna un objeto con una función "removedor" para cancelar la suscripción.
        console.log(eventoActual[index])
        return {
            removedor: () => {
              delete eventoActual[index];
            },
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
      if (info === undefined) {
        console.error('No puede pasar undefined como argumento');
        return
      }
        // TODO: Si no hay escuchadores para este evento, salir de la función.
        if (!this.hOP.call (this.eventos, evento)) return;
        // TODO: Ejecuta todos los escuchadores del evento, pasando la info como argumento.
        this.eventos[evento].forEach ( fn => {
          fn(info);
        });
    }
}


// Ejemplo de uso:
const notificador = new Notificador();
const cancel = notificador.suscribirse("REACTIVO_AGREGADO", (info) => {
console.log("Se agregó el reactivo:", info.reactivo);
});
notificador.publicar("REACTIVO_AGREGADO", { reactivo: "Acetona" });
cancel.removedor();
