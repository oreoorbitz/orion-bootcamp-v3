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

enum TokenType {
    Apertura = "apertura",
    Cierre = "cierre",
    Texto = "texto"
}

const entrada: string = "<div class=\"box\" id=\"main\">Hello<span> World</span></div>";

function tokenizarHTML(html: string): string[] {
  // Esta expresión regular captura tanto etiquetas (abiertas, cerradas o autocierre)
  // como el contenido de texto entre ellas.
  const regex: RegExp = /<\/?[^>]+>|[^<>]+/g;
  // Se extraen los tokens y se filtran aquellos que sean vacíos (solo espacios, saltos de línea, etc.)
  return (html.match(regex) ?? [])
    .map(token => token.trim())
    .filter(token => token !== "");
}

let htmlTokenizado = tokenizarHTML(entrada);
console.log('1.DOM html tokenizado', htmlTokenizado);

//Clasificando los tokens para construir el árbol

function clasificarTokens(tokens: string[]): Token[] {
  // Estas expresiones distinguen entre etiquetas de apertura, cierre y autocierre.
  const regexApertura: RegExp = /^<([a-zA-Z0-9]+)(\s+[^>]+)?>$/;
  const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/;
  const regexAutocierre: RegExp = /^<([a-zA-Z0-9]+)(\s+[^>]+)?\s*\/>$/;

  // Para capturar atributos se permite que las comillas sean dobles o simples.
  const regexAtributos: RegExp = /([a-zA-Z0-9-]+)=["']([^"']+)["']/g;

  return tokens.map(token => {
    if (regexApertura.test(token)) {
      const match = token.match(regexApertura);
      const atributos: Record<string, string> = {};
      if (match && match[2]) {
        for (const attr of match[2].matchAll(regexAtributos)) {
          atributos[attr[1]] = attr[2];
        }
      }
      return {
        tipo: TokenType.Apertura,
        nombre: match?.[1] ?? null,
        contenido: null,
        atributos: Object.keys(atributos).length ? atributos : null
      };
    }

    if (regexCierre.test(token)) {
      const match = token.match(regexCierre);
      return {
        tipo: TokenType.Cierre,
        nombre: match?.[1] ?? null,
        contenido: null,
        atributos: {}
      };
    }

    if (regexAutocierre.test(token)) {
      const match = token.match(regexAutocierre);
      const atributos: Record<string, string> = {};
      if (match && match[2]) {
        for (const attr of match[2].matchAll(regexAtributos)) {
          atributos[attr[1]] = attr[2];
        }
      }
      return {
        tipo: TokenType.Autocierre,
        nombre: match?.[1] ?? null,
        contenido: null,
        atributos: Object.keys(atributos).length ? atributos : null
      };
    }

    // Si no coincide con ningún patrón de etiqueta, se trata como texto.
    return {
      tipo: TokenType.Texto,
      nombre: null,
      contenido: token,
      atributos: {}
    };
  });
}

let htmlClasificado = clasificarTokens(htmlTokenizado);
console.log('2.DOM html clasificado', htmlClasificado);
