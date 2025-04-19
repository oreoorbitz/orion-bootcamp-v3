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
  Texto = 'texto'
}

export interface Token {
  nombre: string | null;
  tipo: TipoToken;
  contenido: string | null;
  atributos: Record<string, string>
  hijos: Token[]
}

export const objetizaratributo = (tag: string): Record<string, string> => {
  const regex = /(\w+)="([^"]*)"/g;
  const matches = [...tag.matchAll(regex)];
  const result: Record<string, string> = {};
  for (const match of matches) {
    const key = match[1];
    const value = match[2];
    result[key] = value;
  }
  return result;
}

export const objetizarToken = (nombre: string | null, tipo: TipoToken, contenido: string | null, atributos: Record<string, string> ): Token => ({ nombre, tipo, contenido, atributos });

const esText = (string: string) => /^[a-zA-Z]+$/.test(string.trim());

const esTag = (string: string) => string.startsWith("<") && string.endsWith(">");

const esAppertura = (string: string) => string.startsWith("<") && !string.startsWith("</") && !string.endsWith("/>");

const esTokenDeApertura = (token: Token) => token.tipo === TipoToken.Apertura;

const esTokenDeCierre = (token: Token) => token.tipo === TipoToken.Cierre;

const esTokenDeAutocierre = (token: Token) => token.tipo === TipoToken.Autocierre;

const esTokenDeTexto = (token: Token) => token.tipo === TipoToken.Texto;

const esCierre = (string: string) => string.startsWith("</") && string.endsWith(">");

const esAutocierre = (string: string) => string.startsWith("<") && string.endsWith("/>");

const encontrarNombreDeTag = (string: string) => {
  const regex = /<(\w+)/;
  const match = string.match(regex);
  return match ? match[1] : null;
}

const HTML = `<div class="greeting" >Hello <span>World</span></div>`;

const tokenizarHTML = (html: string): string[] => {
  const tokens = html.match(/<[^>]+>|[^<]+/g);
  const tokenArray = tokens ? tokens : [];
  return tokenArray
}


export const clasificarTokens = (tokens: string[]): Token[] => {
  const tokensClassificados = tokens.map(token => {
    if (esTag(token)) {
      const nombreTag = encontrarNombreDeTag(token);
      if(esAppertura(token)) {
        const atributos = objetizaratributo(token);
        return objetizarToken(nombreTag, TipoToken.Apertura, null, atributos)
      }
      if(esCierre(token)) {
        return objetizarToken(nombreTag, TipoToken.Cierre, null, {})
      }
      if(esAutocierre(token)) {
        return objetizarToken(nombreTag, TipoToken.Autocierre,  null, {})
      }
      return null
    }

    if (esText(token)) {
      return objetizarToken(null, TipoToken.Texto, token, {})
    }

    return null
  })
    .filter(token => token !== null)

  return tokensClassificados
}

const construirArbol = (tokens: Token[]): Token | null => {
  const stack: Token[] = [];
  let currentNode: Token | null = null;

  for ( const token of tokens) {
    if(esTokenDeApertura(token)) {
      console.log('token de apertura', token)
    } else if(esTokenDeCierre(token)) {
      console.log('token de cierre', token)
    } else if(esTokenDeTexto(token)) {
      console.log('token de texto', token)
    } else if(esTokenDeAutocierre(token)) {
      console.log('token de autocierre', token)
    }
  }


  return null
}

const tokens = tokenizarHTML(HTML);
const tokensClasificados = clasificarTokens(tokens);
construirArbol(tokensClasificados);

