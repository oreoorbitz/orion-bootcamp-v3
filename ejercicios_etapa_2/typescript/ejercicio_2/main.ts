/**
 * MÓDULO 2: CLASIFICACIÓN DE ETIQUETAS
 *
 * Objetivo: Analizar los tokens generados anteriormente y clasificarlos como:
 * - apertura (`<div>`),
 * - cierre (`</div>`),
 * - autocierre (`<img />`),
 * - o contenido de texto.
 *
 * Instrucciones:
 * 1. Crea una función `clasificarTokens(tokens: string[]): any[]`
 * 2. Devuelve un array de objetos con esta estructura:
 *    {
 *      tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto',
 *      nombre: 'div' | null,
 *      contenido: string | null
 *    }
 * 3. Si es una etiqueta, extrae el nombre del tag (por ejemplo: `div`, `span`, etc.)
 *
 * Ejemplo (entrada del módulo anterior):
 * [
 *   "<div>",
 *   "Hello ",
 *   "<span>",
 *   "World",
 *   "</span>",
 *   "</div>"
 * ]
 *
 * Resultado esperado:
 * [
 *   { tipo: 'apertura', nombre: 'div', contenido: null },
 *   { tipo: 'texto', nombre: null, contenido: 'Hello ' },
 *   { tipo: 'apertura', nombre: 'span', contenido: null },
 *   { tipo: 'texto', nombre: null, contenido: 'World' },
 *   { tipo: 'cierre', nombre: 'span', contenido: null },
 *   { tipo: 'cierre', nombre: 'div', contenido: null }
 * ]
 */
