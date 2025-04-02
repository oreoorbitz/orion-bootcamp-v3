// @ts-check

/**
 * EJERCICIO: Analizando HTML como cadena de texto
 *
 * Objetivo:
 * - Comprender la estructura básica de HTML.
 * - Usar `String.split()` y `String.match()` para dividir una cadena HTML.
 * - Extraer el tag de apertura, el contenido y el tag de cierre.
 *
 * 🎯 Instrucciones:
 * 1. Crear una función llamada `analizarHTML` que:
 *    - Reciba una cadena HTML.
 *    - Divida el contenido en tag de apertura, contenido y tag de cierre.
 *    - Retorne un objeto con esta estructura:
 *      {
 *        apertura: string,
 *        contenido: string,
 *        cierre: string
 *      }
 * 2. Crear una función llamada `identificarTags` que:
 *    - Reciba una cadena HTML.
 *    - Use regex para identificar los nombres de los tags (sin contenido).
 *    - Retorne un array de tags encontrados.
 *
 * 📚 Ejemplos:
 * analizarHTML("<div>Hello</div>")
 * // { apertura: "<div>", contenido: "Hello", cierre: "</div>" }
 *
 * identificarTags("<div><p>Hola</p></div>")
 * // ["div", "p", "/p", "/div"]
 */

/**
 * Interface para el resultado de `analizarHTML`.
 */
export interface ResultadoHTML {
  apertura: string;
  contenido: string;
  cierre: string;
}

/**
 * Enum para tipos de tags comunes en HTML (opcional).
 */
export enum TagHTML {
  DIV = "div",
  P = "p",
  H1 = "h1",
  SECTION = "section",
  SPAN = "span"
}

/**
 * Función `analizarHTML`
 * ----------------------
 * Recibe una cadena HTML y retorna un objeto con el tag de apertura,
 * el contenido y el tag de cierre.
 *
 * @param {string} cadena - La cadena HTML que será analizada.
 * @returns {ResultadoHTML} Objeto con apertura, contenido y cierre.
 */


/**
 * Función `identificarTags`
 * -------------------------
 * Recibe una cadena HTML y retorna un array de tags encontrados.
 *
 * @param {string} cadena - La cadena HTML que será analizada.
 * @returns {string[]} Array de tags encontrados.
 */
