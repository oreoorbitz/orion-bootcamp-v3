/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL DOM A PARTIR DE TOKENS
 *
 * 🧠 Concepto clave:
 * Un documento HTML es una estructura jerárquica de elementos y textos.
 * Cada apertura de etiqueta crea un nuevo nodo, cada cierre cierra un contexto, y los textos son hijos normales.
 *
 * En este módulo vas a construir:
 * - Un árbol anidado que representa tu HTML
 * - Usando un **stack** para seguir la jerarquía de elementos
 * - Usando **tipos explícitos** en TypeScript
 *
 * 🎯 Objetivo:
 * 1. Crear una función `construirArbol(tokens: Token[]): Nodo`
 * 2. Recorrer los tokens y construir un árbol de nodos
 *
 * ✅ Ejemplo de HTML de partida:
 * ```html
 * <div>
 *   Hola
 *   <span>mundo</span>
 * </div>
 * ```
 *
 * ✅ Ejemplo de entrada esperada (los tokens que ya generaste en módulos anteriores):
 * ```ts
 * [
 *   { tipo: TipoToken.Apertura, nombre: "div", contenido: null, atributos: {} },
 *   { tipo: TipoToken.Texto, nombre: null, contenido: "Hola", atributos: null },
 *   { tipo: TipoToken.Apertura, nombre: "span", contenido: null, atributos: {} },
 *   { tipo: TipoToken.Texto, nombre: null, contenido: "mundo", atributos: null },
 *   { tipo: TipoToken.Cierre, nombre: "span", contenido: null, atributos: null },
 *   { tipo: TipoToken.Cierre, nombre: "div", contenido: null, atributos: null }
 * ]
 * ```
 *
 * ✅ Salida esperada (el árbol):
 * ```ts
 * {
 *   tipo: "elemento",
 *   nombre: "div",
 *   atributos: {},
 *   hijos: [
 *     { tipo: "texto", contenido: "Hola" },
 *     {
 *       tipo: "elemento",
 *       nombre: "span",
 *       atributos: {},
 *       hijos: [
 *         { tipo: "texto", contenido: "mundo" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 *
 * ✅ Tipos recomendados para este ejercicio:
 * ```ts
 * export enum TipoToken {
 *   Apertura = "apertura",
 *   Cierre = "cierre",
 *   Autocierre = "autocierre",
 *   Texto = "texto"
 * }

 * export interface Token {
 *   tipo: TipoToken | null;
 *   nombre: string | null;
 *   contenido: string | null;
 *   atributos: Record<string, string> | null;
 * }

 * interface NodoElemento {
 *   tipo: "elemento";
 *   nombre: string;
 *   atributos: Record<string, string>;
 *   hijos: Nodo[];
 * }

 * interface NodoTexto {
 *   tipo: "texto";
 *   contenido: string;
 * }

 * export type Nodo = NodoElemento | NodoTexto;
 * ```
 *
 * ✅ Instrucciones:
 * 1. Crea una función `construirArbol(tokens: Token[]): Nodo`
 * 2. Usa una pila (stack) para mantener la jerarquía:
 *    - Cuando encuentres una etiqueta de apertura:
 *      - Crea un `NodoElemento`
 *      - Agrégalo como hijo del nodo actual
 *      - Haz `push` al stack
 *    - Cuando encuentres una etiqueta de cierre:
 *      - Haz `pop` para volver al padre
 *    - Cuando encuentres un texto:
 *      - Crea un `NodoTexto`
 *      - Agrégalo como hijo del nodo actual
 *    - Cuando encuentres una etiqueta de autocierre:
 *      - Crea un `NodoElemento` sin hijos
 *      - Agrégalo directamente como hijo del nodo actual
 *
 * ✅ Reglas clave:
 * - El primer nodo abierto será el **nodo raíz**
 * - Los textos son nodos sin hijos
 * - Todos los hijos se almacenan en el array `hijos` de su padre
 *
 * Consejo:
 * - No tienes que volver a tokenizar el HTML aquí. ¡El arreglo de tokens ya viene preparado del módulo anterior!
 * - Usa pseudocódigo si sientes que te pierdes:  
 *   "Si apertura → crear hijo → moverse abajo... Si cierre → volver arriba..."
 *
 * Este ejercicio simula **cómo un navegador construye el DOM real**: un proceso de lectura y anidación basado en apertura y cierre de etiquetas.
 */

/**
 * 🧩 Tarea opcional: Implementar `querySelector`
 *
 * En los navegadores reales, cualquier elemento puede usar `.querySelector()` para buscar elementos descendientes por su `id`, `class`, o nombre de etiqueta.
 *
 * En esta tarea opcional, puedes implementar un método `querySelector` en tus nodos de tipo `elemento`.

 * ✅ Ejemplo de HTML de entrada:
 * ```html
 * <div id="principal">
 *   <span class="rojo">uno</span>
 *   <span>dos</span>
 * </div>
 * ```

 * ✅ Ejemplo de llamada esperada:
 * ```ts
 * const nodo = construirArbol(tokens);
 * const resultado = nodo.querySelector('.rojo');
 * console.log(resultado); // el nodo <span class="rojo">
 * ```

 * 🎯 Requisitos mínimos del método:
 * - Soportar `#id` para buscar por atributo `id`
 * - Soportar `.class` para buscar por atributo `class`
 * - Opcional: soportar nombres de etiqueta directamente (ej. `'span'`)

 * 🔁 Recomendaciones de implementación:
 * - Esta función **necesita usar recursividad** para buscar en todo el subárbol.
 * - Puedes implementarla como método o como función externa.
 * - Dentro del recorrido, si encuentras un nodo que coincide, devuélvelo de inmediato.

 * 🧠 Si no conoces recursividad, busca estos términos:
 * - "recorrer árbol con recursividad"
 * - "recursive tree traversal"
 * - En español: *recorrer estructura de árbol con funciones recursivas*

 * Esta funcionalidad **no es obligatoria** y no se usará en los siguientes módulos.  
 * Sin embargo, te ayuda a familiarizarte con cómo funciona internamente el DOM real.
 */


export const HTML = `<div id="greeting" >Hello <span>World</span></div>`;

export enum TipoToken {
    Apertura = 'apertura',
    Cierre = 'cierre',
    Autocierre = 'autocierre',
    Texto = 'texto',
}

export interface Token {
    nombre: string | null;
    tipo: TipoToken | null;
    contenido: string | null;
    atributos: Record<string, string> | null;
}

export interface NodoElemento {
    tipo: 'elemento';
    nombre: string;
    atributos: Record<string, string>;
    hijos: Nodo[];
}

export interface NodoTexto {
    tipo: 'texto';
    contenido: string;
}

export type Nodo = NodoElemento | NodoTexto;

const crearNodoElemento = (nombre: string, atributos: Record<string, string>, hijos: Nodo[]): NodoElemento => ({
    tipo: 'elemento',
    nombre,
    atributos,
    hijos,
})

const crearNodoTexto = (contenido: string): NodoTexto => ({
    tipo: 'texto',
    contenido,
})

const objetizaratributo = (atributo: string): Record<string, string> | null => {
    const regex = /(\w+)="([^"]*)"/g;
    const matches = [...atributo.matchAll(regex)];
    const result: Record<string, string> = {};
    for (const match of matches) {
        const key = match[1];
        const value = match[2];
        result[key] = value;
    }
    return result;
}

const objetizarToken = (nombre: string | null, tipo: TipoToken, contenido: string | null, atributos: Record<string, string> | null): Token => ({ nombre, tipo, contenido, atributos })

const esText = (string: string) => /^[a-zA-Z]+$/.test(string.trim());

const esTag = (string: string) => string.startsWith("<") && string.endsWith(">");

const esAppertura = (string: string) => string.startsWith("<") && !string.startsWith("</") && !string.endsWith("/>");

const esCierre = (string: string) => string.startsWith("</") && string.endsWith(">");

const esAutocierre = (string: string) => string.startsWith("<") && string.endsWith("/>");

const ArrEmpty = <T>(arr: T[]) => arr.length === 0;

const encontrarNombreDeTag = (string: string) => {
    const regex = /<(\w+)/;
    const match = string.match(regex);
    return match ? match[1] : null;
}

const tokenizarHTML = (html: string): string[] => {
    const tokens = html.match(/<[^>]+>|[^<]+/g);
    const tokenArray = tokens ? tokens : [];
    return tokenArray
}

export const clasificarTokens = (tokens: string[]): Token[] => {
    const tokensClassificados = tokens.map(token => {
        if (esTag(token)) {
            const nombreTag = encontrarNombreDeTag(token);
            if (esAppertura(token)) {
                return objetizarToken(nombreTag, TipoToken.Apertura, null, objetizaratributo(token))
            }
            if (esCierre(token)) {
                return objetizarToken(nombreTag, TipoToken.Cierre, null, null)
            }
            if (esAutocierre(token)) {
                return objetizarToken(nombreTag, TipoToken.Autocierre, null, objetizaratributo(token))
            }
            return null
        }

        if (esText(token)) {
            return objetizarToken(null, TipoToken.Texto, token, null)
        }

        return null
    })
    .filter((token): token is Token => token !== null)


    return tokensClassificados
}

const construirArbol = (tokens: Token[]): Nodo | null => {
    const stack: NodoElemento[] = []
    let arbol: NodoElemento | null = null

    for (const token of tokens) {
        const tokenNombre = token.nombre ?? ''
        const tokenAttributos = token.atributos ?? {}
        const tokenContenido = token.contenido ?? ''

        if (token.tipo === TipoToken.Apertura) {

            const nuevoNodo = crearNodoElemento(tokenNombre, tokenAttributos, [])
            const lastIndex = stack.length - 1

            ArrEmpty(stack) ? arbol = nuevoNodo : stack[lastIndex].hijos.push(nuevoNodo)
            stack.push(nuevoNodo)
        } else if (token.tipo === TipoToken.Cierre) {
            stack.pop()
        } else if (token.tipo === TipoToken.Texto) {
            const nuevoNodo = crearNodoTexto(tokenContenido)
            const lastIndex = stack.length - 1

            if (!ArrEmpty(stack))  stack[lastIndex].hijos.push(nuevoNodo)
        } else if (token.tipo === TipoToken.Autocierre) {
            const nuevoNodo = crearNodoElemento(tokenNombre, tokenAttributos, [])
            const lastIndex = stack.length - 1

            if (!ArrEmpty(stack)) stack[lastIndex].hijos.push(nuevoNodo)
         }
    }

    return arbol as Nodo
}

const tokens = tokenizarHTML(HTML);
const tokensClasificados = clasificarTokens(tokens);
const arbol = construirArbol(tokensClasificados);

console.log(arbol)