/**
 * MÓDULO 3: MANEJO DE ATRIBUTOS
 *
 * Objetivo: Extraer y almacenar los atributos dentro de las etiquetas HTML.
 *
 * Instrucciones:
 * 1. Modifica la función del módulo anterior (o crea una nueva) para procesar los atributos de cada etiqueta de apertura/autocierre.
 * 2. Usa expresiones regulares o división con `.split` para detectar atributos como `class="btn"` o `id="main"`.
 * 3. Devuelve los tokens con un campo adicional: `atributos: Record<string, string>`
 *
 * Ejemplo:
 * Entrada: `<div class="box" id="main">`
 *
 * Resultado esperado:
 * {
 *   tipo: 'apertura',
 *   nombre: 'div',
 *   contenido: null,
 *   atributos: { class: 'box', id: 'main' }
 * }
 *
 * Sugerencia:
 * - Busca las comillas para separar los valores.
 * - Usa el método `.matchAll()` o una expresión regular tipo `(\w+)="([^"]*)"`
 */


enum TipoToken {
  Apertura = 'apertura',
  Cierre = 'cierre',
  Autocierre = 'autocierre',
  Texto = 'texto',
}



interface Token {
  nombre: string | null;
  tipo: TipoToken | null;
  contenido: string | null;
  atributos: Record<string, string> | null;
}

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

console.log(tokenizarTag(HTML));

