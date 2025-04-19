/**
 * MÓDULO 1: TOKENIZACIÓN DE HTML
 *
 * Objetivo: Convertir una cadena HTML simple en un arreglo de "tokens", que pueden ser etiquetas (tags) o texto.
 * 
 * ¿Qué es tokenizar?
 * - Tokenizar significa dividir una cadena en unidades significativas. En este caso: etiquetas y texto.
 *
 * Instrucciones:
 * 1. Define una función llamada `tokenizarHTML(html: string): string[]`.
 * 2. Esta función debe separar las etiquetas (`<div>`, `</p>`, etc.) del contenido de texto plano.
 * 3. Usa expresiones regulares o métodos de cadena como `.split`, `.match`, o `.replace`.
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
 * Enfócate en: bucles, condicionales, métodos de string, y lógica de separación.
 */
