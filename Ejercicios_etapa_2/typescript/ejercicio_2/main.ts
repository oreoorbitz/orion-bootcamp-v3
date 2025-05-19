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
enum TokenType {
    Apertura = "apertura",
    Cierre = "cierre",
    Texto = "texto"
}

const entrada: string = "<div>Hello <span>World</span></div>";

function tokenizarHTML (html: string): string[] {
  const regex: RegExp = /<\/?[^>]+>|[^<>]+/g
  return html.match(regex) ?? []
}
let htmlTokenizado: string[] = tokenizarHTML(entrada);
console.log('1.Resultado de Tokenizar el HTML', htmlTokenizado);

// Función para clasificar los tokens con el enum
function clasificarTokens(tokens: string[]): { tipo: TokenType, nombre: string | null, contenido: string | null }[] {
    const regexApertura: RegExp = /^<([a-zA-Z0-9]+)>$/; // Detecta etiquetas de apertura
    const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/; // Detecta etiquetas de cierre

    return tokens.map(token => {
        if (regexApertura.test(token)) {
            return { tipo: TokenType.Apertura, nombre: token.match(regexApertura)?.[1] ?? null, contenido: null };
        }
        if (regexCierre.test(token)) {
            return { tipo: TokenType.Cierre, nombre: token.match(regexCierre)?.[1] ?? null, contenido: null };
        }

        return { tipo: TokenType.Texto, nombre: null, contenido: token };
    });
}

let htmlClasificado = clasificarTokens(htmlTokenizado);
console.log('2.Resultado de clasificar Tokens',htmlClasificado);
