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


let entrada = `html
  <div id="principal">
    <span class="rojo">uno</span>
    <span>dos</span>
  </div>
  `;

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

let arbolConstruido = construirArbol(htmlClasificado);
console.log('3.DOM arbol construido', arbolConstruido)

//Implementación del queryselector para buscar cosas en el árbol construido c: (OPCIONAL)
function querySelector(nodo: NodoElemento, selector: string): NodoElemento | null {
    if (selector.startsWith("#") && nodo.atributos.id === selector.slice(1)) {
        return nodo;
    }
    if (selector.startsWith(".") && nodo.atributos.class === selector.slice(1)) {
        return nodo;
    }
    if (selector === nodo.nombre) {
        return nodo;
    }

    for (const hijo of nodo.hijos) {
        if (hijo.tipo === "elemento") {
            const resultado = querySelector(hijo, selector);
            if (resultado) return resultado;
        }
    }

    return null;
}


console.log(JSON.stringify(arbolConstruido, null, 2)); // Para ver la estructura en la consola

// Pruebas con `querySelector`
console.log("Buscando #contenedor:", querySelector(arbolConstruido, "#contenedor"));
console.log("Buscando .principal:", querySelector(arbolConstruido, ".principal"));
console.log("Buscando .destacado:", querySelector(arbolConstruido, ".destacado"));
console.log("Buscando section:", querySelector(arbolConstruido, "section"));
console.log("Buscando article:", querySelector(arbolConstruido, "article"));
