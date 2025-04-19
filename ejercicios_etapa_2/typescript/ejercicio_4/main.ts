/**
 * MÓDULO 4: CONSTRUCCIÓN DEL ÁRBOL
 *
 * Objetivo: Convertir la lista de tokens clasificados en una estructura de árbol que represente el DOM.
 *
 * Instrucciones:
 * 1. Crea una función llamada `construirArbol(tokens: any[]): any`
 * 2. Usa una pila (stack) para mantener el seguimiento del nodo padre actual.
 * 3. Crea objetos con esta estructura:
 *    {
 *      tipo: 'elemento' | 'texto',
 *      nombre: 'div',
 *      atributos: {...},
 *      hijos: []
 *    }
 *
 * Ejemplo:
 * Entrada simplificada de tokens:
 * [
 *   apertura <div>,
 *   texto "Hola",
 *   apertura <span>,
 *   texto "mundo",
 *   cierre </span>,
 *   cierre </div>
 * ]
 *
 * Resultado esperado:
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
 * Conceptos clave: pila, estructuras anidadas, recorrido incremental
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


export const clasificarTokens = (tokens: string[]): object[] => {
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
  const obj = tokens.map(token => {
    console.log(token.tipo === TipoToken.Apertura)
    if(token.tipo === TipoToken.Apertura) {
      return {
        ...token,
        hijos: []
      }
    }
  })

  return null
}

const tokens = tokenizarHTML(HTML);
const tokensClasificados = clasificarTokens(tokens);
construirArbol(tokensClasificados);

