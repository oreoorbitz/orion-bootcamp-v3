enum TokenType {
  Apertura = "apertura",
  Cierre = "cierre",
  Autocierre = "autocierre",
  Texto = "texto",
  ContenidoRaw = "contenidoRaw" // Nuevo tipo para contenido raw
}

interface Token {
  tipo: TokenType;
  nombre: string | null;
  contenido: string | null;
  atributos: Record<string, string> | null;
}

interface NodoElemento {
  tipo: "elemento";
  nombre: string;
  atributos: Record<string, string>;
  hijos: Nodo[];
}

interface NodoTexto {
  tipo: "texto";
  contenido: string;
}

type Nodo = NodoElemento | NodoTexto;

// Elementos HTML que no requieren etiqueta de cierre (void elements)
const ELEMENTOS_VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

// Elementos que contienen contenido raw (no HTML)
const ELEMENTOS_RAW = new Set(['script', 'style']);

function tokenizarHTML(html: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < html.length) {
    const char = html[i];

    if (char === '<') {
      // Buscar el final de la etiqueta
      let j = i + 1;
      while (j < html.length && html[j] !== '>') {
        j++;
      }

      if (j < html.length) {
        const etiqueta = html.substring(i, j + 1);
        tokens.push(etiqueta);

        // Verificar si es una etiqueta de apertura de script o style
        const matchApertura = etiqueta.match(/^<(script|style)(\s+[^>]+)?>$/i);
        if (matchApertura) {
          const nombreElemento = matchApertura[1].toLowerCase();
          // Buscar la etiqueta de cierre correspondiente
          const etiquetaCierre = `</${nombreElemento}>`;
          const indiceCierre = html.toLowerCase().indexOf(etiquetaCierre, j + 1);

          if (indiceCierre !== -1) {
            // Extraer todo el contenido raw entre las etiquetas
            const contenidoRaw = html.substring(j + 1, indiceCierre);
            if (contenidoRaw.trim()) {
              tokens.push(contenidoRaw);
            }
            // Agregar la etiqueta de cierre
            tokens.push(html.substring(indiceCierre, indiceCierre + etiquetaCierre.length));
            i = indiceCierre + etiquetaCierre.length;
            continue;
          }
        }

        i = j + 1;
      } else {
        // Etiqueta mal formada, tratarla como texto
        tokens.push(char);
        i++;
      }
    } else {
      // Buscar el siguiente '<' o el final de la cadena
      let j = i;
      while (j < html.length && html[j] !== '<') {
        j++;
      }

      const textoContenido = html.substring(i, j).trim();
      if (textoContenido) {
        tokens.push(textoContenido);
      }
      i = j;
    }
  }

  return tokens.filter(token => token.trim() !== "");
}

function clasificarTokens(tokens: string[]): Token[] {
  const regexApertura: RegExp = /^<([a-zA-Z0-9]+)(\s+[^>]+)?>$/;
  const regexCierre: RegExp = /^<\/([a-zA-Z0-9]+)>$/;
  const regexAutocierre: RegExp = /^<([a-zA-Z0-9]+)(\s+[^>]+)?\s*\/>$/;
  const regexAtributos: RegExp = /([a-zA-Z0-9-]+)=["']([^"']+)["']/g;

  const tokensClasificados: Token[] = [];
  let esperandoContenidoRaw = false;
  let elementoRawActual = '';

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Si estamos esperando contenido raw y no es la etiqueta de cierre esperada
    if (esperandoContenidoRaw) {
      const regexCierreEsperado = new RegExp(`^</${elementoRawActual}>$`, 'i');

      if (regexCierreEsperado.test(token)) {
        // Es la etiqueta de cierre esperada
        esperandoContenidoRaw = false;
        elementoRawActual = '';

        const match = token.match(regexCierre);
        tokensClasificados.push({
          tipo: TokenType.Cierre,
          nombre: match?.[1] ?? null,
          contenido: null,
          atributos: null
        });
      } else {
        // Es contenido raw, agregarlo como texto sin procesar
        tokensClasificados.push({
          tipo: TokenType.ContenidoRaw,
          nombre: null,
          contenido: token,
          atributos: null
        });
      }
      continue;
    }

    // Procesamiento normal de tokens
    if (regexAutocierre.test(token)) {
      const match = token.match(regexAutocierre);
      const atributos: Record<string, string> = {};
      if (match && match[2]) {
        for (const attr of match[2].matchAll(regexAtributos)) {
          atributos[attr[1]] = attr[2];
        }
      }
      tokensClasificados.push({
        tipo: TokenType.Autocierre,
        nombre: match?.[1] ?? null,
        contenido: null,
        atributos: Object.keys(atributos).length ? atributos : null
      });
    } else if (regexApertura.test(token)) {
      const match = token.match(regexApertura);
      const nombreElemento = match?.[1]?.toLowerCase();
      const atributos: Record<string, string> = {};

      if (match && match[2]) {
        for (const attr of match[2].matchAll(regexAtributos)) {
          atributos[attr[1]] = attr[2];
        }
      }

      // Si es un elemento void, lo tratamos como autocierre
      if (nombreElemento && ELEMENTOS_VOID.has(nombreElemento)) {
        tokensClasificados.push({
          tipo: TokenType.Autocierre,
          nombre: match?.[1] ?? null,
          contenido: null,
          atributos: Object.keys(atributos).length ? atributos : null
        });
      } else {
        // Si es un elemento raw (script/style), marcar para procesar contenido raw
        if (nombreElemento && ELEMENTOS_RAW.has(nombreElemento)) {
          esperandoContenidoRaw = true;
          elementoRawActual = nombreElemento;
        }

        tokensClasificados.push({
          tipo: TokenType.Apertura,
          nombre: match?.[1] ?? null,
          contenido: null,
          atributos: Object.keys(atributos).length ? atributos : null
        });
      }
    } else if (regexCierre.test(token)) {
      const match = token.match(regexCierre);
      const nombreElemento = match?.[1]?.toLowerCase();

      // Si intentan cerrar un elemento void, lo ignoramos
      if (nombreElemento && ELEMENTOS_VOID.has(nombreElemento)) {
        console.warn(`Advertencia: Se encontró etiqueta de cierre </${nombreElemento}> para un elemento void. Se ignorará.`);
        tokensClasificados.push({
          tipo: TokenType.Texto,
          nombre: null,
          contenido: "",
          atributos: {}
        });
      } else {
        tokensClasificados.push({
          tipo: TokenType.Cierre,
          nombre: match?.[1] ?? null,
          contenido: null,
          atributos: null
        });
      }
    } else {
      // Si no coincide con ningún patrón de etiqueta, se trata como texto
      tokensClasificados.push({
        tipo: TokenType.Texto,
        nombre: null,
        contenido: token,
        atributos: null
      });
    }
  }

  return tokensClasificados;
}

function construirArbol(tokens: Token[]): Nodo {
  const stack: NodoElemento[] = [];
  let root: NodoElemento | null = null;

  // Filtrar tokens de texto vacíos, pero mantener contenido raw
  const tokensValidos = tokens.filter(token =>
    token.tipo === TokenType.ContenidoRaw ||
    token.tipo !== TokenType.Texto ||
    (token.contenido !== null && token.contenido.trim() !== "")
  );

  tokensValidos.forEach(token => {
    if (token.tipo === TokenType.Apertura) {
      const nodo: NodoElemento = {
        tipo: "elemento",
        nombre: token.nombre!,
        atributos: token.atributos ?? {},
        hijos: []
      };

      if (stack.length > 0) {
        stack[stack.length - 1].hijos.push(nodo);
      } else {
        root = nodo;
      }

      stack.push(nodo);

    } else if (token.tipo === TokenType.Autocierre) {
      const nodo: NodoElemento = {
        tipo: "elemento",
        nombre: token.nombre!,
        atributos: token.atributos ?? {},
        hijos: []
      };

      if (stack.length > 0) {
        stack[stack.length - 1].hijos.push(nodo);
      } else {
        root = nodo;
      }

    } else if (token.tipo === TokenType.Cierre) {
      if (stack.length === 0) {
        throw new Error(`Se encontró una etiqueta de cierre </${token.nombre}> sin su correspondiente apertura.`);
      }
      const nodoCerrado = stack.pop();
      if (nodoCerrado && nodoCerrado.nombre !== token.nombre) {
        throw new Error(`Error de sintaxis: etiqueta de cierre </${token.nombre}> no coincide con la etiqueta abierta <${nodoCerrado.nombre}>.`);
      }

    } else if (token.tipo === TokenType.Texto || token.tipo === TokenType.ContenidoRaw) {
      const nodoTexto: NodoTexto = {
        tipo: "texto",
        contenido: token.contenido!
      };

      if (stack.length > 0) {
        stack[stack.length - 1].hijos.push(nodoTexto);
      } else {
        if (!root) {
          root = {
            tipo: "elemento",
            nombre: "body",
            atributos: {},
            hijos: [nodoTexto]
          };
        } else {
          root.hijos.push(nodoTexto);
        }
      }
    }
  });

  if (stack.length > 0) {
    const nombresAbiertos = stack.map(nodo => nodo.nombre).join(", ");
    throw new Error(`Error: No se cerraron las siguientes etiquetas: ${nombresAbiertos}`);
  }

  if (!root) {
    throw new Error("Error: No se pudo construir el árbol DOM.");
  }
  return root;
}

export function htmlParser(entradaRenderizada: string): Nodo {
  const htmlTokenizado = tokenizarHTML(entradaRenderizada);
  const htmlClasificado = clasificarTokens(htmlTokenizado);
  const arbolConstruido = construirArbol(htmlClasificado);
  return arbolConstruido;
}
