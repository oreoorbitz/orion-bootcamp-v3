/**
 * MÓDULO 3: MANEJO DE ATRIBUTOS
 *
 * 🧠 Concepto clave:
 * En HTML, las etiquetas pueden tener *atributos* que modifican su comportamiento: `<div class="box" id="main">`.
 * Estos atributos se usan para aplicar estilos, referenciar elementos, o darles comportamiento.
 * En este módulo, vamos a extraer esa información para que luego podamos buscar elementos por `id`, `class`, etc.
 *
 * Objetivo:
 * Detectar y extraer los atributos presentes dentro de las etiquetas de apertura o autocierre.
 *
 * Instrucciones:
 * 1. Modifica la salida del módulo 2 (o crea una nueva función) para detectar atributos.
 * 2. Para cada etiqueta que tenga atributos, crea un campo `atributos` como un objeto:
 *    `{ class: 'box', id: 'main' }`
 * 3. Usa expresiones regulares o divisiones con `.split`, `.matchAll`, etc.
 *
 * Ejemplo de entrada:
 * `<div class="box" id="main">`
 *
 * Resultado esperado:
 * {
 *   tipo: 'apertura',
 *   nombre: 'div',
 *   contenido: null,
 *   atributos: { class: 'box', id: 'main' }
 * }
 *
 * Consejo:
 * - Busca solo dentro del contenido de la etiqueta (no el texto externo)
 * - Este paso te ayudará a construir funciones como `getElementById` o `getElementsByClassName` más adelante.
 */
function clasificarTokens(tokens: string[]): any[] {
  const regexApertura: RegExp = /^<([a-zA-Z0-9]+)(\s[^>]+)?>$/; // Detecta etiquetas de apertura con atributos
  const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/; // Detecta etiquetas de cierre
  const regexAutocierre: RegExp = /^<([a-zA-Z0-9]+)(\s[^>]+)?\s*\/>$/; // Detecta etiquetas de autocierre
  const regexAtributos: RegExp = /([a-zA-Z0-9-]+)="([^"]+)"/g; // Captura los atributos dentro de una etiqueta

    return tokens.map(token => {
        if (regexApertura.test(token)) {
            const match = token.match(regexApertura);
            const atributos: Record<string, string> = {};

            if (match && match[2]) {
                // Extraer atributos de la etiqueta
                [...match[2].matchAll(regexAtributos)].forEach(attr => {
                    atributos[attr[1]] = attr[2]; // Guarda los atributos en un objeto
                });
            }

            return { tipo: 'apertura', nombre: match?.[1] ?? null, contenido: null, atributos };
        }
        if (regexCierre.test(token)) {
            return { tipo: 'cierre', nombre: token.match(regexCierre)?.[1] ?? null, contenido: null, atributos:{} };
        }
        if (regexAutocierre.test(token)) {
            const match = token.match(regexAutocierre);
            const atributos: Record<string, string> = {};

            if (match && match[2]) {
                [...match[2].matchAll(regexAtributos)].forEach(attr => {
                    atributos[attr[1]] = attr[2];
                });
            }

            return { tipo: 'autocierre', nombre: match?.[1] ?? null, contenido: null, atributos };
        }

        return { tipo: 'texto', nombre: null, contenido: token, atributos: {} };
    });
}

// Ejemplo de uso
const entrada: string[] = ["<div class=\"box\" id=\"main\">", "Hello ", "<span>", "World", "</span>", "</div>"];
const resultado = clasificarTokens(entrada);
console.log(resultado);



enum TokenType {
    Apertura = "apertura",
    Cierre = "cierre",
    Autocierre = "autocierre",
    Texto = "texto"
}

// Función para clasificar los tokens con el enum
function clasificarTokensEnm(tokens: string[]): { tipo: TokenType, nombre: string | null, contenido: string | null, atributos: Record<string, string> }[] {
    const regexApertura: RegExp = /^<([a-zA-Z0-9]+)(\s[^>]+)?>$/; // Detecta etiquetas de apertura con atributos
    const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/; // Detecta etiquetas de cierre
    const regexAutocierre: RegExp = /^<([a-zA-Z0-9]+)(\s[^>]+)?\s*\/>$/; // Detecta etiquetas de autocierre
    const regexAtributos: RegExp = /([a-zA-Z0-9-]+)="([^"]+)"/g; // Captura atributos dentro de una etiqueta

    return tokens.map(token => {
        if (regexApertura.test(token)) {
            const match = token.match(regexApertura);
            const atributos: Record<string, string> = {};

            if (match && match[2]) {
                [...match[2].matchAll(regexAtributos)].forEach(attr => {
                    atributos[attr[1]] = attr[2]; // Guarda los atributos en un objeto
                });
            }

            return { tipo: TokenType.Apertura, nombre: match?.[1] ?? null, contenido: null, atributos };
        }
        if (regexCierre.test(token)) {
            return { tipo: TokenType.Cierre, nombre: token.match(regexCierre)?.[1] ?? null, contenido: null, atributos: {} };
        }
        if (regexAutocierre.test(token)) {
            const match = token.match(regexAutocierre);
            const atributos: Record<string, string> = {};

            if (match && match[2]) {
                [...match[2].matchAll(regexAtributos)].forEach(attr => {
                    atributos[attr[1]] = attr[2];
                });
            }

            return { tipo: TokenType.Autocierre, nombre: match?.[1] ?? null, contenido: null, atributos };
        }

        return { tipo: TokenType.Texto, nombre: null, contenido: token, atributos: {} };
    });
}

// Ejemplo de uso
const entrada2: string[] = ["<div class=\"box\" id=\"main\">", "Hello ", "<span>", "World", "</span>", "</div>"];
const resultado2 = clasificarTokensEnm(entrada2);
console.log(resultado2);
