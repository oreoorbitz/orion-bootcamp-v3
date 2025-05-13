/**
 * MÓDULO 1: TOKENIZACIÓN DE HTML
 *
 * 🧠 Concepto clave:
 * HTML es el lenguaje que usan los navegadores para construir páginas web. Antes de que un navegador (o nuestro programa)
 * pueda procesar un HTML, primero necesita separar el texto en "piezas significativas". A este proceso se le llama *tokenización*.
 *
 * Por ejemplo, el navegador necesita saber qué parte de un HTML es una etiqueta, y qué parte es solo texto.
 * Este es el primer paso para poder interpretar o transformar contenido HTML en JavaScript.
 *
 * Objetivo:
 * Convertir una cadena HTML simple en un arreglo de "tokens", que pueden ser etiquetas (tags) o texto plano.
 *
 * Instrucciones:
 * 1. Crea una función llamada `tokenizarHTML(html: string): string[]`.
 * 2. Separa todas las etiquetas (`<div>`, `</span>`, `<img />`) del contenido de texto.
 * 3. Devuelve un arreglo en el que cada token es un string individual.
 *
 * Ejemplo:
 * Entrada: "<div>Hello <span>World</span></div>"
 * Salida esperada:
 * [
 *   "<div>",
 *   "Hello ",
 *   "<span>",
 *   "World",
 *   "</span>",
 *   "</div>"
 * ]
 *
 * Consejo:
 * - Usa expresiones regulares (`.match`, `.split`) para separar texto y etiquetas.
 * - Este módulo es el primer paso para que tu programa entienda HTML como si fuera un navegador.
 */
function tokenizarHTML (html: string): string[] {
  const regex: RegExp = /<\/?[^>]+>|[^<>]+/g
  return html.match(regex) ?? []
}

const entrada: string = "<div>Hello <span>World</span></div>";
const resultado: string[] = tokenizarHTML(entrada);
console.log(resultado);
