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


const entrada = [
    '<div class="box" id="main">',
    'Hello',
    '<span>',
    'World',
    '</span>',
    '</div>'
]

function clasificarTokens(tokens: string[]): any[] {
    return tokens.map(token => {
        
        if (/^<\/[^>]+>$/.test(token)) {
            return {
                tipo: 'cierre',
                nombre: token.match(/^<\/(\w+)/)?.[1] || null,
                contenido: null,
                atributos: null
            };
        }

        
        else if (/^<[^\/>]+>$/.test(token)) {
            const nombre = token.match(/^<(\w+)/)?.[1] || null;

            const attrRegex = /(\w+)=["']([^"']+)["']/g;
            const atributos: Record<string, string> = {};

            for (const match of token.matchAll(attrRegex)) {
                atributos[match[1]] = match[2];
            }

            return {
                tipo: 'apertura',
                nombre,
                contenido: null,
                atributos: Object.keys(atributos).length > 0 ? atributos : null
            };
        }

        else {
            return {
                tipo: 'texto',
                nombre: null,
                contenido: token,
                atributos: null
            };
        }
    });
}

console.log(clasificarTokens(entrada));