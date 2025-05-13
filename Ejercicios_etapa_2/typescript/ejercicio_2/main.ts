/**
 * MÓDULO 2: CLASIFICACIÓN DE ETIQUETAS
 *
 * 🧠 Concepto clave:
 * Los navegadores no solo leen las etiquetas HTML — también interpretan si están *abriendo* algo (`<div>`),
 * *cerrando* algo (`</div>`), o si son *autocontenidas* (`<img />`).
 * Antes de poder construir una estructura similar al DOM (el árbol que representa una página),
 * necesitamos clasificar los tokens generados en el módulo anterior.
 *
 * Objetivo:
 * Clasificar cada token en uno de estos tipos:
 * - etiqueta de apertura
 * - etiqueta de cierre
 * - etiqueta autocontenida
 * - contenido de texto
 *
 * Instrucciones:
 * 1. Crea una función llamada `clasificarTokens(tokens: string[]): any[]`
 * 2. Para cada token, determina su tipo.
 * 3. Devuelve un objeto con:
 *    - tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto'
 *    - nombre: el nombre de la etiqueta (por ejemplo `div`, `img`, etc.)
 *    - contenido: solo en caso de tipo 'texto'
 *
 * Ejemplo:
 * Entrada:
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
 *
 * Consejo:
 * - Este paso es equivalente a que el navegador reconozca qué etiquetas están empezando, terminando o actuando solas.
 */
function clasificarTokens(tokens: string[]): any[] {
  const regexApertura: RegExp = /^<([a-zA-Z0-9]+)>$/;
  const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/;

   return tokens.map(token => {
        if (regexApertura.test(token)) {
            return { tipo: 'apertura', nombre: token.match(regexApertura)?.[1] ?? null, contenido: null };
        }
        if (regexCierre.test(token)) {
            return { tipo: 'cierre', nombre: token.match(regexCierre)?.[1] ?? null, contenido: null };
        }

        return { tipo: 'texto', nombre: null, contenido: token };
    });
}

const entrada: string[] = ["<div>", "Hello ", "<span>", "World", "</span>", "</div>"];
const resultado = clasificarTokens(entrada);
console.log(resultado);
