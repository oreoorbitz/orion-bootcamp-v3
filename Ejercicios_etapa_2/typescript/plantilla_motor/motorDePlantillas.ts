type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva;
}

const cacheTraducciones: Record<string, Record<string, string>> = {};

function cargarTraducciones(locale: string): Record<string, string> {
  if (cacheTraducciones[locale]) return cacheTraducciones[locale];

  try {
    const ruta = new URL(`../server/themes/dev/locales/${locale}.json`, import.meta.url).pathname;
    const contenido = Deno.readTextFileSync(ruta);
    const traducciones = JSON.parse(contenido);
    cacheTraducciones[locale] = traducciones;
    return traducciones;
  } catch {
    console.warn(`No se pudo cargar el archivo de traducciones para el locale: ${locale}`);
    return {};
  }
}

// 🎯 FILTROS CORREGIDOS: asset_url ahora maneja rutas según el contexto
let filtrosRegistrados: Record<string, Function> = {
  upcase: (x: string) => x.toUpperCase(),
  reverse: (x: string) => x.split('').reverse().join(''),
  // 🔧 asset_url corregido para manejar diferentes niveles de carpeta
  asset_url: (x: string, contexto?: Record<string, any>) => {
    // Determinar el nivel de carpeta actual basado en el contexto
    const templateType = contexto?.template_type || 'root';

    if (templateType === 'product' || templateType === 'collection') {
      // Para productos y colecciones, necesitamos subir un nivel
      return `../assets/${x}`;
    } else {
      // Para templates en la raíz (content_for_index, 404, etc.)
      return `./assets/${x}`;
    }
  },
  stylesheet_tag: (x: string) => `<link rel="stylesheet" href="${x}"></link>`,
  money: (x: number) => (x/100).toFixed(2),
  t: (clave: string, contexto: Record<string, any>) => {
    const locale = contexto.Mockify?.locale ?? "en";
    const traducciones = cargarTraducciones(locale);
    return traducciones[clave] ?? clave;
  },

  translate: (clave: string, contexto: Record<string, any>) => {
    const locale = contexto.Mockify?.locale ?? "en";
    const traducciones = cargarTraducciones(locale);
    return traducciones[clave] ?? clave;
  }
}

function detectarTokensPlantilla(entrada: string): string[] {
    const regex = /({{.*?}}|{%.*?%})/g;
    let resultado: string[] = [];
    let ultimoIndice = 0;

    for (const match of entrada.matchAll(regex)) {
        const token = match[0];
        const inicioToken = match.index!;

        if (inicioToken > ultimoIndice) {
            resultado.push(entrada.substring(ultimoIndice, inicioToken));
        }

        resultado.push(token);
        ultimoIndice = inicioToken + token.length;
    }

    if (ultimoIndice < entrada.length) {
        resultado.push(entrada.substring(ultimoIndice));
    }

    return resultado;
}

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
        directiva: clasificarDirectiva(contenido) ?? undefined
      };
    }

    return { tipo: "texto", contenido: token.trim() };
  });
}

function procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];

    for (let token of tokens) {
        if (token.tipo === "directiva" && token.contenido.startsWith("assign ")) {
            let partes = token.contenido.split("=").map(p => p.trim());
            let nombreVariable = partes[0].replace("assign ", "").trim();
            let valorRaw = partes[1];

            if (/^['"].*['"]$/.test(valorRaw)) {
                contexto[nombreVariable] = valorRaw.slice(1, -1);
            } else if (!isNaN(Number(valorRaw))) {
                contexto[nombreVariable] = Number(valorRaw);
            } else {
                contexto[nombreVariable] = contexto.hasOwnProperty(valorRaw) ? contexto[valorRaw] : valorRaw;
            }
        } else {
            resultado.push(token);
        }
    }

    return resultado;
}

// 🔧 Función auxiliar para procesar snippets sin recursión
async function procesarSnippet(contenido: string, contexto: Record<string, any>): Promise<string> {
  console.log(`🔄 Procesando snippet/section con contexto:`, Object.keys(contexto));

  // Agregar template_type si no existe
  if (!contexto.template_type) {
    contexto.template_type = 'snippet';
  }

  // Paso 1: Tokenización
  const tokens = detectarTokensPlantilla(contenido);

  // Paso 2: Clasificación de tokens
  const tokensClasificados = clasificarTokensPlantilla(tokens);

  // Paso 3: Procesar asignaciones
  const tokensConAsignaciones = procesarAsignaciones(tokensClasificados, contexto);

  // Paso 4: Procesar bucles
  const tokensConBucles = procesarBucles(tokensConAsignaciones, contexto);

  // Paso 5: Procesar condicionales
  const tokensConCondicionales = procesarCondicionales(tokensConBucles, contexto);

  // Paso 6: Renderizar variables finales
  const resultado = renderizarVariables(tokensConCondicionales, contexto, filtrosRegistrados);

  return resultado;
}

async function procesarIncludes(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('include ')) {
      const partes = token.contenido.split(/\s+/);
      const nombre = partes[1]?.replace(/^['"]|['"]$/g, '');

      const ruta = new URL(`../server/themes/dev/snippets/${nombre}.liquid`, import.meta.url).pathname;
      console.log('ruta resuelta:', ruta);

      try {
        const contenido = await Deno.readTextFile(ruta);

        // 🔧 CORRECCIÓN: Procesar el snippet con la función auxiliar
        const snippetProcesado = await procesarSnippet(contenido, contexto);

        // Convertir el resultado procesado de vuelta a tokens de texto
        resultado.push({ tipo: 'texto', contenido: snippetProcesado });

      } catch (error) {
        console.error('Error al procesar include:', error);
        resultado.push({ tipo: 'texto', contenido: `Liquid error: ${nombre} not found` });
      }
    } else {
      resultado.push(token);
    }
  }

  return resultado;
}

async function procesarRender(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('render ')) {
      const partes = token.contenido.split(/,\s*/);
      const nombreRaw = partes[0].split(/\s+/)[1]; // 'mensaje'
      const nombre = nombreRaw.replace(/^['"]|['"]$/g, '');

      const ruta = new URL(`../server/themes/dev/snippets/${nombre}.liquid`, import.meta.url).pathname;

      // 🔹 Extraer variables pasadas
      let variablesLocales: Record<string, any> = {};
      for (let i = 1; i < partes.length; i++) {
        let [clave, valorRaw] = partes[i].split(':').map(s => s.trim());
        let valor = /^['"]/.test(valorRaw) ? valorRaw.slice(1, -1) : contexto[valorRaw];
        variablesLocales[clave] = valor;
      }

      // 🔹 Clonar drops del contexto global
      let contextoRender: Record<string, any> = {};
      for (let clave in contexto) {
        if (contexto[clave]?.isDrop) {
          contextoRender[clave] = contexto[clave];
        }
      }

      // 🔹 Mezclar variables locales
      contextoRender = { ...contextoRender, ...variablesLocales };

      try {
        const contenido = await Deno.readTextFile(ruta);
        const htmlRenderizado = await procesarSnippet(contenido, contextoRender);
        resultado.push({ tipo: 'texto', contenido: htmlRenderizado });
      } catch {
        resultado.push({ tipo: 'texto', contenido: `Liquid error: ${nombre} not found` });
      }
    } else {
      resultado.push(token);
    }
  }

  return resultado;
}


//Procesar Secciones para la carpeta sections
async function procesarSection(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('section ')) {
      const nombreRaw = token.contenido.split(/\s+/)[1];
      const nombre = nombreRaw?.replace(/^['"]|['"]$/g, '');
      const ruta = new URL(`../server/themes/dev/sections/${nombre}.liquid`, import.meta.url).pathname;

      try {
        const contenido = await Deno.readTextFile(ruta);

        // 🔎 Separar plantilla visual y extraer schema

        const contenidoVisual = contenido.replace(/{% schema %}[\s\S]*?{% endschema %}/, "").trim();

        // 🔧 Construir contexto local de la sección
        const settings =
        contexto.sections?.[nombre]?.settings ??
        contexto.settings?.current?.sections?.[nombre]?.settings ??
        {};

        if (Object.keys(settings).length === 0) {
        console.warn(`⚠️ Advertencia: No se encontraron settings para la sección '${nombre}'.`);
        }


        let contextoSection: Record<string, any> = {};
        for (let clave in contexto) {
          if (contexto[clave]?.isDrop) {
            contextoSection[clave] = contexto[clave];
          }
        }

        contextoSection.section = {
          settings,
        };

        const htmlRenderizado = await procesarSnippet(contenidoVisual, contextoSection);
        resultado.push({ tipo: 'texto', contenido: htmlRenderizado });
      } catch {
        resultado.push({ tipo: 'texto', contenido: `Liquid error: ${nombre} not found` });
      }
    } else {
      resultado.push(token);
    }
  }

  return resultado;
}


// 🎯 FUNCIÓN AUXILIAR CORREGIDA: Procesa variables con filtros y contexto
function procesarVariableConFiltros(token: TokenPlantilla, contexto: Record<string, any>): TokenPlantilla {
  if (token.tipo === "variable") {
    let partes = token.contenido.split('|').map(p => p.trim());
    let nombreVariable = partes.shift() ?? '';
    let filtros = partes;

    // Obtener el valor inicial
    let valorFinal: any;

    // Si es una cadena literal (entre comillas), usar el valor literal
    if (nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) {
      valorFinal = nombreVariable.slice(1, -1);
    } else if (nombreVariable.startsWith('"') && nombreVariable.endsWith('"')) {
      valorFinal = nombreVariable.slice(1, -1);
    } else {
      // Obtener el valor de la variable del contexto
      valorFinal = nombreVariable.split('.').reduce((obj, key) => {
        return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
      }, contexto);

      if (valorFinal === undefined) {
        valorFinal = nombreVariable;
      }
    }

    // 🔧 Aplicar filtros secuencialmente, pasando el contexto
    for (let filtro of filtros) {
      let filtroLimpio = filtro.trim();
      if (!filtrosRegistrados[filtroLimpio]) {
        throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
      }

      valorFinal = filtrosRegistrados[filtroLimpio](valorFinal, contexto);
    }

    return { tipo: "texto", contenido: String(valorFinal) };
  }

  return token;
}

function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
  let resultado: TokenPlantilla[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.tipo === 'directiva' && token.directiva === 'for') {
      let partes = token.contenido.split(/\s+/);
      let nombreItem = partes[1];
      let nombreLista = partes[3];

      // 🔹 Resolver la lista desde el contexto (soporta notación anidada)
      let segmentos = nombreLista.replace(/\[(["'])(.*?)\1\]/g, '.$2').split('.');
      let valoresLista = segmentos.reduce((obj, key) => {
       return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
      }, contexto);

      // 🔸 Si es Drop, no se puede iterar
      if (valoresLista?.isDrop) {
        console.warn(`Advertencia: no se puede iterar directamente un Drop: '${nombreLista}'`);
        i = saltarBloque(tokens, i);
        continue;
      }

      // 🔸 Si no es array, tampoco se puede iterar
      if (!Array.isArray(valoresLista)) {
        console.warn(`Advertencia: '${nombreLista}' no es un array.`);
        i = saltarBloque(tokens, i);
        continue;
      }

      // 🔹 Encontrar el bloque interno del bucle
      let j = i + 1;
      let bloqueInterno: TokenPlantilla[] = [];
      let nivel = 1;

      while (j < tokens.length && nivel > 0) {
        if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'for') {
          nivel++;
        } else if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'endfor') {
          nivel--;
        }

        if (nivel > 0) {
          bloqueInterno.push(tokens[j]);
        }
        j++;
      }

      if (nivel > 0) {
        throw new Error("Error de sintaxis: {% for %} sin {% endfor %}");
      }

      // 🔹 Procesar cada elemento del array
      for (let valor of valoresLista) {
        let contextoLocal = { ...contexto, [nombreItem]: valor };

        let bloqueProcesadoBucles = procesarBucles(bloqueInterno, contextoLocal);
        let bloqueProcesadoCondicionales = procesarCondicionales(bloqueProcesadoBucles, contextoLocal);
        let tokensFinales = bloqueProcesadoCondicionales.map(token =>
          procesarVariableConFiltros(token, contextoLocal)
        );

        resultado.push(...tokensFinales);
      }

      i = j - 1;
    } else {
      resultado.push(token);
    }

    i++;
  }

  return resultado;
}

// 🔧 Función auxiliar para saltar bloques {% for %} ... {% endfor %}
function saltarBloque(tokens: TokenPlantilla[], inicio: number): number {
  let nivel = 1;
  let j = inicio + 1;
  while (j < tokens.length && nivel > 0) {
    if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'for') {
      nivel++;
    } else if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'endfor') {
      nivel--;
    }
    j++;
  }
  return j - 1;
}

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

// 🎯 FUNCIÓN CORREGIDA: renderizarVariables con contexto para filtros
function renderizarVariables(
  tokens: TokenPlantilla[],
  contexto: Record<string, any>,
  filtrosRegistrados: Record<string, Function>
): string {
  return tokens.map(token => {
    if (token.tipo === "variable") {
      let partes = token.contenido.split('|').map(p => p.trim());
      let nombreVariable = partes.shift() ?? '';
      let filtros = partes;

      let valorFinal: any;

      // 🔹 Si es cadena literal
      if ((nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) ||
          (nombreVariable.startsWith('"') && nombreVariable.endsWith('"'))) {
        valorFinal = nombreVariable.slice(1, -1);
      } else {
        // 🔹 Separar por puntos y corchetes
        let segmentos = nombreVariable
          .replace(/\[(["'])(.*?)\1\]/g, '.$2') // convierte ['x'] o ["x"] a .x
          .split('.');

        valorFinal = segmentos.reduce((obj, key) => {
          if (obj?.isDrop) {
            // 🔸 Si es Drop, acceder por clave segura
            return obj[key] ?? "";
          } else if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
          } else {
            return undefined;
          }
        }, contexto);

        if (valorFinal === undefined) {
          valorFinal = "";
        }
      }

      // 🔹 Aplicar filtros
      for (let filtro of filtros) {
        let filtroLimpio = filtro.trim();
        if (!filtrosRegistrados[filtroLimpio]) {
          throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
        }

        valorFinal = filtroLimpio === 'asset_url'
          ? filtrosRegistrados[filtroLimpio](valorFinal, contexto)
          : filtrosRegistrados[filtroLimpio](valorFinal);
      }

      return String(valorFinal);
    }

    return token.contenido;
  }).join('');
}

export async function liquidEngine(entradaInicial: string, contexto: Record<string, any>): Promise<string> {
    console.log("Entrada inicial en liquidEngine:\n", entradaInicial);
    console.log("contexto pasado", contexto);

    // Paso 1: Tokenización
    const entradaTokenizada = detectarTokensPlantilla(entradaInicial);
    console.log("Tokens de Liquid:\n", entradaTokenizada);

    // Paso 2: Clasificación de tokens
    const entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
    console.log("Tokens clasificados:\n", entradaClasificada);

    // Paso 3: Procesar asignaciones
    const entradaProcesadaAsignacion = procesarAsignaciones(entradaClasificada, contexto);
    console.log("Después de procesar asignaciones:\n", entradaProcesadaAsignacion);

    // Paso 4: Procesar includes
    const entradaConIncludes = await procesarIncludes(entradaProcesadaAsignacion, contexto);
    console.log("Después de procesar includes:\n", entradaConIncludes);

    // Paso 5: Procesar render
    const entradaConRender = await procesarRender(entradaConIncludes, contexto);
    console.log("Despues de procesar render:\n",entradaConRender);

    //Paso 6: Procesar sections
    const entradaConSections = await procesarSection(entradaConRender, contexto);
    console.log("Después de procesar Sections:\n", entradaConSections);

    // Paso 5: Procesar bucles PRIMERO (antes que condicionales)
    const buclesProcesados = procesarBucles(entradaConSections, contexto);
    console.log("Después de procesar bucles:\n", buclesProcesados);

    // Paso 6: Procesar condicionales (después de bucles)
    const entradaProcesada = procesarCondicionales(buclesProcesados, contexto);
    console.log("Después de procesar condicionales:\n", entradaProcesada);

    // Paso 7: Renderizar variables finales
    const entradaRenderizada = renderizarVariables(entradaProcesada, contexto, filtrosRegistrados);
    console.log("Resultado final de Liquid:\n", entradaRenderizada);

    let resultadoFinal = entradaRenderizada;

    return String(resultadoFinal);
}
