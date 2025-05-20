/**
 * MÓDULO 12: CONECTAR MOTOR DE PLANTILLAS CON MOTOR DOM
 *
 * 🧠 Concepto clave:
 * Hasta ahora, has construido dos sistemas importantes por separado:
 * - Un **motor de plantillas Liquid** que transforma texto con variables, condiciones, bucles y filtros.
 * - Un **motor DOM** que convierte HTML plano en un árbol de nodos que puedes recorrer y manipular.

 * En este módulo los vas a combinar:
 * - Primero se procesa la plantilla con Liquid.
 * - Luego se pasa el resultado como HTML a tu parser para construir un árbol DOM.
 *
 * ✅ Ejemplo de plantilla combinada:
 * ```liquid
 * <ul>
 *   {% for fruta in frutas %}
 *     {% if fruta %}
 *       <li>{{ fruta | upcase }}</li>
 *     {% endif %}
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Ejemplo de contexto:
 * ```ts
 * {
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 * ```
 *
 * ✅ Resultado después del render:
 * ```html
 * <ul>
 *   <li>MANZANA</li>
 *   <li>PLÁTANO</li>
 *   <li>UVA</li>
 * </ul>
 * ```
 *
 * ✅ Resultado como árbol DOM (formato abreviado):
 * ```ts
 * {
 *   tipo: 'elemento',
 *   nombre: 'ul',
 *   atributos: {},
 *   hijos: [
 *     { tipo: 'elemento', nombre: 'li', hijos: [{ tipo: 'texto', contenido: 'MANZANA' }] },
 *     ...
 *   ]
 * }
 * ```
 *
 * 🎯 Objetivo:
 * Procesar una plantilla Liquid completa, y luego convertir el resultado en un árbol de nodos usando tu parser DOM.

 * 🛠️ Instrucciones:
 * 1. Usa la función `renderizarPlantilla(...)` para transformar la plantilla con el contexto.
 * 2. Pasa el resultado HTML a tu función `construirArbol(...)` del módulo DOM.
 * 3. Imprime el árbol resultante con `console.log(...)`.

 * ✅ Puedes usar el siguiente HTML + Liquid como punto de partida:
 * ```ts
 * const plantilla = `
 * <section>
 *   <h2>Frutas favoritas</h2>
 *   <ul>
 *     {% for fruta in frutas %}
 *       {% if fruta %}
 *         <li>{{ fruta | upcase }}</li>
 *       {% endif %}
 *     {% endfor %}
 *   </ul>
 * </section>
 * `
 * ```
 *
 * ✅ Contexto de ejemplo:
 * ```ts
 * const contexto = {
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 * ```
 *
 * ✅ Recordatorio: asegúrate de procesar en orden:
 * 1. Asignaciones (`assign`)
 * 2. Bucles (`for`)
 * 3. Condicionales (`if`)
 * 4. Reemplazo de variables (`{{ nombre }}`)
 * 5. Filtros (`| upcase`, etc.)
 *
 * Consejo:
 * - Revisa si necesitas normalizar el string (por ejemplo, `.trim()` o `.replace(/\n/g, '')`)
 * - No necesitas mostrar nada visual todavía — solo asegúrate de que el árbol de nodos se construye correctamente
 * - Este módulo prepara el camino para el renderizado real en pantalla en los siguientes pasos
 */

type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

//Aqui colocar los datos que necesito para que las funciones encadenadas trabajen adecuadamente:
let entradaInicial = `
  <section>
    <h2>Frutas favoritas</h2>
    <ul>
      {% for fruta in frutas %}
        {% if fruta %}
          <li>{{ fruta | upcase }}</li>
        {% endif %}
      {% endfor %}
    </ul>
  </section>
  `;
let contexto = {
   frutas: ["manzana", "plátano", "uva"]
};

let filtrosRegistrados: {} = {
  upcase: (x) => x.toUpperCase(),
  reverse: (x) => x.split('').reverse().join('')
}

function detectarTokensPlantilla(entrada: string): string[] {
    const regex = /({{.*?}}|{%.*?%})/g;
    let resultado: string[] = [];
    let ultimoIndice = 0;

    // Usamos `matchAll()` para obtener todas las coincidencias y sus posiciones en la cadena
    for (const match of entrada.matchAll(regex)) {
        const token = match[0]; // Token detectado
        const inicioToken = match.index!; // Posición en la cadena

        // Agregar el texto entre el último índice y la posición actual del token
        if (inicioToken > ultimoIndice) {
            resultado.push(entrada.substring(ultimoIndice, inicioToken));
        }

        // Agregar el token
        resultado.push(token);
        ultimoIndice = inicioToken + token.length; // Actualizar el índice de seguimiento
    }

    // Agregar el resto del texto después del último token
    if (ultimoIndice < entrada.length) {
        resultado.push(entrada.substring(ultimoIndice));
    }

    return resultado;
}

let entradaTokenizada = (detectarTokensPlantilla(entradaInicial));
console.log('1.Resultado de detectarTokens:',entradaTokenizada);


//Actualización de Clasificar Tokens para que funcione adecuadamente
//Primero la clasificación de directivas que se usa en la actualización de clasificar tokens <3
function clasificarDirectiva(contenido: string): TipoDirectiva | null {
  if (contenido.startsWith("if")) return "if";
  if (contenido === "endif") return "endif";
  if (contenido.startsWith("elsif")) return "elsif";
  if (contenido === "else") return "else";
  if (contenido.startsWith("for")) return "for";
  if (contenido === "endfor") return "endfor";
  return null;
}

function clasificarTokensPlantilla(tokens: string[]): TokenPlantilla[] {
  return tokens.map(token => {
    if (token.startsWith("{{") && token.endsWith("}}")) {
      return { tipo: "variable", contenido: token.slice(2, -2).trim() };
    }
    if (token.startsWith("{%") && token.endsWith("%}")) {
      let contenido = token.slice(2, -2).trim();
      return {
        tipo: "directiva",
        contenido,
        directiva: clasificarDirectiva(contenido)
      };
    }

    return { tipo: "texto", contenido: token.trim() };
  });
}

// esta es la equivalente a tokens, imprimir si es necesario saber que es cada cosa
let entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
console.log('2.Resultado de clasificar:',entradaClasificada)

function procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];

    for (let token of tokens) {
        if (token.tipo === "directiva" && token.contenido.startsWith("assign ")) {
            let partes = token.contenido.split("=").map(p => p.trim());
            let nombreVariable = partes[0].replace("assign ", "").trim();
            let valorRaw = partes[1];

            // Si el valor está entre comillas, lo guardamos como texto literal
            if (/^['"].*['"]$/.test(valorRaw)) {
                contexto[nombreVariable] = valorRaw.slice(1, -1); // Quitamos comillas
            } else if (!isNaN(Number(valorRaw))) {
                contexto[nombreVariable] = Number(valorRaw); // Convertimos a número si es válido
            } else {
                //  Nueva corrección: Si el valor es otra variable, pero no existe en el contexto, lo mantenemos intacto.
                contexto[nombreVariable] = contexto.hasOwnProperty(valorRaw) ? contexto[valorRaw] : valorRaw;
            }

            // No agregamos este token al resultado porque no debe producir contenido visible
        } else {
            resultado.push(token);
        }
    }

    return resultado;
}



let entradaProcesadaAsignacion = procesarAsignaciones(entradaClasificada,contexto);
console.log('3.Resultados de procesar asginaciones',entradaProcesadaAsignacion);

//Según las instrucciones procesar condicionales es una etapa intermedia y debe realizarse antes de renderizar las variables
//Se han realizado múltiples cambios usar siempre la versión del archivo anterior, no de los archivos de los primeros ejercicios
function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];
    let i = 0;

    while (i < tokens.length) {
        let token = tokens[i];

        if (token.tipo === 'directiva' && token.directiva === 'if') {
            let partes = token.contenido.split(/\s+/);
            let nombreVariable = partes[1] || "";

            let j = i + 1;
            let bloqueActual: TokenPlantilla[] = [];
            let mostrarBloque = contexto[nombreVariable] ?? false;
            let procesandoElse = false;
            let dentroDeBucles = false;

            // Detectar si estamos dentro de un bucle
            for (let k = i; k >= 0; k--) {
                if (tokens[k].tipo === 'directiva' && tokens[k].directiva === 'for') {
                    dentroDeBucles = true;
                    break;
                }
            }

            while (j < tokens.length) {
                let siguienteToken = tokens[j];

                if (siguienteToken.tipo === 'directiva' && siguienteToken.directiva === 'endif') {
                    break;
                }

                if (siguienteToken.tipo === 'directiva' && siguienteToken.directiva === 'elsif') {
                    if (!mostrarBloque) {
                        let partesElsif = siguienteToken.contenido.split(/\s+/);
                        let nombreVariableElsif = partesElsif[1] || "";
                        mostrarBloque = contexto[nombreVariableElsif] ?? false;
                    }
                    bloqueActual = [];
                }

                if (siguienteToken.tipo === 'directiva' && siguienteToken.directiva === 'else') {
                    if (!mostrarBloque) {
                        procesandoElse = true;
                    }
                    bloqueActual = [];
                }

                // **Ahora dejamos los tokens dentro del `for` aunque el `if` no se cumpla**
                if (!siguienteToken.directiva || dentroDeBucles) {
                    bloqueActual.push({ ...siguienteToken });
                }

                j++;
            }

            if (mostrarBloque || procesandoElse || dentroDeBucles) {
                resultado.push(...bloqueActual);
            }

            i = j;
        } else {
            resultado.push(token);
        }

        i++;
    }

    return resultado;
}

let entradaProcesada = procesarCondicionales(entradaProcesadaAsignacion,contexto);
console.log('4.Resultado de procesar condicionales:',entradaProcesada);

function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
  let resultado: TokenPlantilla[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.tipo === 'directiva' && token.directiva === 'for') {
      let partes = token.contenido.split(/\s+/);
      let nombreItem = partes[1]; // Por ejemplo, "fruta"
      let nombreLista = partes[3]; // Por ejemplo, "frutas"

      if (!Array.isArray(contexto[nombreLista])) {
        throw new Error(`Error: '${nombreLista}' no es un array.`);
      }

      let valoresLista = contexto[nombreLista];

      let j = i + 1;
      let bloqueInterno: TokenPlantilla[] = [];

      while (j < tokens.length) {
        if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'endfor') {
          break;
        }
        bloqueInterno.push(tokens[j]);
        j++;
      }

      if (j >= tokens.length) {
        throw new Error("Error de sintaxis: {% for %} sin {% endfor %}");
      }

      // Aquí recorremos cada valor de la lista usando contextoLocal para la iteración
      for (let valor of valoresLista) {
        // Se crea un contexto local que sobrescribe el nombre del item con el valor actual
        let contextoLocal = { ...contexto, [nombreItem]: valor };

        let tokensFinales = bloqueInterno.map(token => {
          if (token.tipo === "variable") {
            let partes = token.contenido.split('|').map(p => p.trim());
            let nombreVariable = partes.shift() ?? '';

            // Usamos el contextoLocal en lugar del contexto global
            let valorVariable = contextoLocal[nombreVariable] ?? nombreVariable;

            // Aplicamos cada filtro registrado, si existen
            for (let filtroCrudo of partes) {
              if (filtrosRegistrados[filtroCrudo]) {
                valorVariable = filtrosRegistrados[filtroCrudo](valorVariable);
              } else {
                throw new Error(`Error: El filtro '${filtroCrudo}' no está definido.`);
              }
            }

            return { tipo: "texto", contenido: valorVariable.toString() };
          }
          return token;
        });

        resultado.push(...tokensFinales);
      }

      i = j; // Saltamos al token {% endfor %}
    } else {
      resultado.push(token);
    }

    i++;
  }

  return resultado;
}


let buclesProcesados = procesarBucles(entradaProcesada,contexto);
console.log('5.Resultado de procesar bucles',buclesProcesados)

function aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string | string[] {

  let valor = contexto[nombreVariable] ?? nombreVariable; // Si no está en el contexto, usar el valor como texto

    if (valor === undefined) {
        throw new Error(`Error: La variable '${nombreVariable}' no está definida en el contexto.`);
    }

    // **Nueva condición**: Si es un array, aplica los filtros a cada elemento; si es un string, aplícalo directamente.
    if (Array.isArray(valor)) {
        return valor.map(elemento => {
            let resultado = elemento;
            for (let filtro of filtros) {
                let filtroLimpio = filtro.trim();
                if (!filtrosRegistrados[filtroLimpio]) {
                    throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
                }
                resultado = filtrosRegistrados[filtroLimpio](resultado);
            }
            return resultado;
        });
    } else {
        for (let filtro of filtros) {
            let filtroLimpio = filtro.trim();
            if (!filtrosRegistrados[filtroLimpio]) {
                throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
            }
            valor = filtrosRegistrados[filtroLimpio](valor);
        }
        return valor;
    }
}

function parseFiltro(crudo: string): [nombre: string, argumentos: any[]] {
    let [nombre, ...args] = crudo.split(':').map(p => p.trim());
    let argumentos = args.join(':').split(',').map(arg => arg.trim().replace(/^['"](.*)['"]$/, '$1')); // Elimina comillas
    return [nombre, argumentos];
}


function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string {
    return tokens.map(token => {
        if (token.tipo === "variable") {
            let partes = token.contenido.split('|').map(p => p.trim());
            let nombreVariable = partes.shift() ?? '';

            // **Corrección importante:** Revisamos si la variable está dentro del contexto del bucle
            let valor = contexto[nombreVariable] ?? nombreVariable;

            if (Array.isArray(valor)) {
                throw new Error(`Error: No se puede renderizar un array directamente. Debe ser iterado en un bucle.`);
            }

            // **Aplicamos los filtros en orden** si hay alguno registrado
            for (let filtroCrudo of partes) {
                let [nombreFiltro, args] = parseFiltro(filtroCrudo);
                if (!filtrosRegistrados[nombreFiltro]) {
                    throw new Error(`Error: El filtro '${nombreFiltro}' no está definido.`);
                }
                valor = filtrosRegistrados[nombreFiltro](valor, ...args);
            }

            return valor.toString(); // Finalmente, reemplazamos correctamente el valor de la variable
        }
        return token.contenido; // Conservamos la estructura original
    }).join('');
}

let entradaRenderizada = renderizarVariables(buclesProcesados, contexto, filtrosRegistrados);
console.log('6. Resultado de Renderizar variables',entradaRenderizada)

//Motor DOM verificando que todo funciona en conjunto:
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

let htmlTokenizado = tokenizarHTML(entradaRenderizada);
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

console.log(JSON.stringify(arbolConstruido, null, 2));
