/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL DOM A PARTIR DE TOKENS
 *
 * Objetivo: Convertir una lista de tokens clasificados en una estructura de árbol
 * que represente el contenido y jerarquía de un documento HTML simple.
 *
 * Entrada esperada:
 * Un arreglo de objetos (tokens) generado en módulos anteriores. Cada token debe
 * tener esta estructura (al menos):
 *
 * {
 *   tipo: 'apertura' | 'cierre' | 'autocierre' | 'texto',
 *   nombre: string | null,
 *   contenido: string | null,
 *   atributos?: Record<string, string>  // solo si aplica
 * }
 *
 * Ejemplo de entrada:
 * [
 *   { tipo: 'apertura', nombre: 'div', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'Hola' },
 *   { tipo: 'apertura', nombre: 'span', contenido: null, atributos: {} },
 *   { tipo: 'texto', nombre: null, contenido: 'mundo' },
 *   { tipo: 'cierre', nombre: 'span', contenido: null },
 *   { tipo: 'cierre', nombre: 'div', contenido: null }
 * ]
 *
 * Salida esperada:
 * Un objeto raíz que representa el árbol DOM en forma de estructura anidada:
 *
 * {
 *   tipo: 'elemento',
 *   nombre: 'div',
 *   atributos: {},
 *   hijos: [
 *     { tipo: 'texto', contenido: 'Hola' },
 *     {
 *       tipo: 'elemento',
 *       nombre: 'span',
 *       atributos: {},
 *       hijos: [
 *         { tipo: 'texto', contenido: 'mundo' }
 *       ]
 *     }
 *   ]
 * }
 *
 * Instrucciones:
 * 1. Crea una función `construirArbol(tokens: any[]): any`
 * 2. Usa una pila (stack) para construir la jerarquía:
 *    - Cuando encuentres una etiqueta de apertura, crea un nodo y agrégalo como hijo del nodo actual.
 *      Luego haz "push" a ese nodo como el nuevo contexto actual.
 *    - Cuando encuentres una etiqueta de cierre, haz "pop" de la pila.
 *    - Cuando encuentres un texto o una etiqueta de autocierre, agrégalo directamente al nodo actual.
 *
 * Reglas clave:
 * - El nodo raíz es el primer elemento del stack.
 * - Todos los elementos deben ir en `hijos` del nodo padre actual.
 * - Los nodos tipo 'texto' tienen solo las propiedades: `tipo: 'texto'` y `contenido`
 * - Los nodos tipo 'elemento' tienen: `tipo`, `nombre`, `atributos`, y `hijos`
 *
 * Conceptos clave: estructuras anidadas, árboles, pila (stack), control de contexto
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
  
  const HTML = `<div class="box" id="main">`;
  
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

export const construirArbol = (tokens: Token[]): Nodo => {
    const stack: Nodo[] = [];
    let nodoActual: Nodo | null = null;
    for (const token of tokens) {
        console.log(token);
    }
    return construirNodo(tokens[0]);
}

const tagsTokenizados = tokenizarTag(HTML);
const arbol = construirArbol([tagsTokenizados]);
