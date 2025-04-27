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

interface NodoElemento {
    tipo: 'elemento';
    nombre: string | null;
    atributos: Record<string, string> | null;
    hijos: Nodo[];
}

interface NodoTexto {
    tipo: 'texto';
    contenido: string | null;
}

export type Nodo = NodoElemento | NodoTexto;


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

const esText = (string: string) => /^[a-zA-Z]+$/.test(string.trim());

const esAppertura = (string: string) => string.startsWith("<") && !string.startsWith("</") && !string.endsWith("/>");

const esCierre = (string: string) => string.startsWith("</") && string.endsWith(">");

const esAutocierre = (string: string) => string.startsWith("<") && string.endsWith("/>");

const encontrarTipo = (string: string): TipoToken | null => {
    if (esAppertura(string)) return TipoToken.Apertura;
    if (esCierre(string)) return TipoToken.Cierre;
    if (esAutocierre(string)) return TipoToken.Autocierre;
    if (esText(string)) return TipoToken.Texto;
    return null;
}

const encontrarNombreDeTag = (string: string) => {
    const regex = /<(\w+)/;
    const match = string.match(regex);
    return match ? match[1] : null;
}

const HTML = `<div>Hola<span>mundo</span></div>`

const tokenizarTag = (tag: string): Token => {
    const tipo = encontrarTipo(tag);
    const nombre = encontrarNombreDeTag(tag);
    const atributos = objetizaratributo(tag);
    console.log(atributos)

    return {
        nombre,
        tipo,
        contenido: null,
        atributos
    }
}

export const construirNodo = (token: Token): Nodo => {
    if (token.tipo === TipoToken.Texto) {
        return {
            tipo: 'texto',
            contenido: token.contenido
        };
    } else {
        return {
            tipo: 'elemento',
            nombre: token.nombre ?? '',
            atributos: token.atributos ?? {},
            hijos: []
        };
    }

}

export const construirArbol = (tokens: Token[]): Nodo | null => {
    const stack: Nodo[] = [];
    let nodoActual: Nodo | null = null;
    for (const token of tokens) {
        const nuevoNodo = construirNodo(token);

        if (token.tipo === TipoToken.Apertura) {
            if(stack.length === 0) {
                nodoActual = nuevoNodo;
                stack.push(nodoActual);
            }
        } else if(token.tipo === TipoToken.Texto) {
            console.log("Texto")
            console.log(token)
        }
    }
    console.log(nodoActual)
    return nodoActual
}

const tagsTokenizados = tokenizarTag(HTML);
const arbol = construirArbol([tagsTokenizados]);
