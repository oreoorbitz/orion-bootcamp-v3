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

enum TipoToken {
  Apertura = 'apertura',
  Cierre = 'cierre',
  Autocierre = 'autocierre',
  Texto = 'texto'
}

interface Token {
  nombre: string | null;
  tipo: TipoToken;
  contenido: string | null;
}

const objetizarToken = (nombre: string | null, tipo: TipoToken, contenido: string | null): Token => ({ nombre, tipo, contenido})

const esText = (string: string) => /^[a-zA-Z]+$/.test(string.trim());

const esTag = (string: string) => string.startsWith("<") && string.endsWith(">");

const esAppertura = (string: string) => string.startsWith("<") && !string.startsWith("</") && !string.endsWith("/>");

const esCierre = (string: string) => string.startsWith("</") && string.endsWith(">");

const esAutocierre = (string: string) => string.startsWith("<") && string.endsWith("/>");

const quitarTag = (string: string) =>  string.replace(/<\/?([^>]+)>/, "$1");

const HTML = `<div>Hello <span>World</span></div>`;

const tokenizarHTML = (html: string): string[] => {
  const tokens = html.match(/<[^>]+>|[^<]+/g);
  const tokenArray = tokens ? tokens : [];
  return tokenArray
}


export const clasificarTokens = (tokens: string[]): object[] => {
  const tokensClassificados = tokens.map(token => {
    if (esTag(token)) {
      const nombreTag = quitarTag(token);
      if(esAppertura(token)) {
        return objetizarToken(nombreTag, TipoToken.Apertura, null)
      }
      if(esCierre(token)) {
        return objetizarToken(nombreTag, TipoToken.Cierre, null)
      }
      if(esAutocierre(token)) {
        return objetizarToken(nombreTag, TipoToken.Autocierre,  null)
      }
      return null
    }

    if (esText(token)) {
      console.log('token is:', token);
      return objetizarToken(null, TipoToken.Texto, token)
    }

    return null
  })
    .filter(token => token !== null)

  return tokensClassificados
}

const tokens = tokenizarHTML(HTML);
const tokensClasificados = clasificarTokens(tokens);
console.log(tokensClasificados);