enum TokenType {
  Apertura = "apertura",
  Cierre = "cierre",
  Autocierre = "autocierre",
  Texto = "texto"
}

interface Token {
  tipo: TokenType;
  nombre: string | null;
  contenido: string | null;
  atributos: Record<string, string> | null;
};

interface NodoElemento {
  tipo: "elemento";
  nombre: string;
  atributos: Record<string, string>;
  hijos: Nodo[];
};

interface NodoTexto {
  tipo: "texto";
  contenido: string;
};

type Nodo = NodoElemento | NodoTexto;

function tokenizarHTML(html: string): string[] {
  // Esta expresión regular captura tanto etiquetas (abiertas, cerradas o autocierre)
  // como el contenido de texto entre ellas.
  const regex: RegExp = /<\/?[^>]+>|[^<>]+/g;
  // Se extraen los tokens y se filtran aquellos que sean vacíos (solo espacios, saltos de línea, etc.)
  return (html.match(regex) ?? [])
    .map(token => token.trim())
    .filter(token => token !== "");
}


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


//Ahora construyendo el árbol
function construirArbol(tokens: Token[]): Nodo {
  const stack: NodoElemento[] = []; // Pila para mantener la jerarquía
  let root: NodoElemento | null = null;

  tokens.forEach(token => {
    if (token.tipo === TokenType.Apertura) {
      // Crear un nodo de elemento con sus atributos y una lista vacía de hijos
      const nodo: NodoElemento = {
        tipo: "elemento",
        nombre: token.nombre!,
        atributos: token.atributos ?? {},
        hijos: []
      };

      if (stack.length > 0) {
        // Se agrega como hijo al nodo que está en la cima de la pila
        stack[stack.length - 1].hijos.push(nodo);
      } else {
        // Si la pila está vacía, este es el nodo raíz
        root = nodo;
      }

      stack.push(nodo);

    } else if (token.tipo === TokenType.Autocierre) {
      // Los nodos de autocierre se agregan sin necesidad de empujar en la pila
      const nodo: NodoElemento = {
        tipo: "elemento",
        nombre: token.nombre!,
        atributos: token.atributos ?? {},
        hijos: []
      };

      if (stack.length > 0) {
        stack[stack.length - 1].hijos.push(nodo);
      } else {
        // Si se encuentra un autocierre sin que haya un padre, se establece como raíz
        root = nodo;
      }

    } else if (token.tipo === TokenType.Cierre) {
      if (stack.length === 0) {
        throw new Error(`Se encontró una etiqueta de cierre </${token.nombre}> sin su correspondiente apertura.`);
      }
      const nodoCerrado = stack.pop();
      // Opcional: Verifica que la etiqueta de cierre coincida con la de apertura.
      if (nodoCerrado && nodoCerrado.nombre !== token.nombre) {
        throw new Error(`Error de sintaxis: etiqueta de cierre </${token.nombre}> no coincide con la etiqueta abierta <${nodoCerrado.nombre}>.`);
      }

    } else if (token.tipo === TokenType.Texto) {
      // Crear un nodo de texto
      const nodoTexto: NodoTexto = {
        tipo: "texto",
        contenido: token.contenido!
      };

      if (stack.length > 0) {
        stack[stack.length - 1].hijos.push(nodoTexto);
      } else {
        // Si no hay ningún contenedor, envolvemos el texto en un nodo raíz por defecto.
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

  // Si aún hay elementos en la pila, significa que faltó cerrar algunas etiquetas.
  if (stack.length > 0) {
    const nombresAbiertos = stack.map(nodo => nodo.nombre).join(", ");
    throw new Error(`Error: No se cerraron las siguientes etiquetas: ${nombresAbiertos}`);
  }

  if (!root) {
    throw new Error("Error: No se pudo construir el árbol DOM.");
  }
  return root;
}

//console.log(JSON.stringify(arbolConstruido, null, 2)); USAR ESTO PARA VER EL CONTENIDO COMPLETO


export function htmlParser(entradaRenderizada: string): Nodo {
  console.log("HTML a procesar en htmlParser:\n", entradaRenderizada); // ← Aquí ya tendrá un valor válido

  const htmlTokenizado = tokenizarHTML(entradaRenderizada);
  console.log("Tokens generados:\n", htmlTokenizado); // ← Verifica los tokens antes de seguir

  const htmlClasificado = clasificarTokens(htmlTokenizado);
  console.log("Tokens clasificados:\n", htmlClasificado); // ← Revisa si la clasificación funciona

  const arbolConstruido = construirArbol(htmlClasificado);
  console.log("Árbol DOM generado:\n", arbolConstruido); // ← Revisa si el árbol se construye correctamente

  return arbolConstruido;
}


export function renderDOM(nodo: Nodo): string {
  if (nodo.tipo === "texto") {
    return nodo.contenido;
  }
  if (nodo.tipo === "elemento") {
    const atributos = Object.entries(nodo.atributos)
      .map(([clave, valor]) => ` ${clave}="${valor}"`)
      .join("");
    const hijos = nodo.hijos.map(renderDOM).join("");
    return `<${nodo.nombre}${atributos}>${hijos}</${nodo.nombre}>`;
  }
  return "";
}
