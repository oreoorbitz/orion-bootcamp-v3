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

  // 🔧 CORRECCIÓN: Ambos filtros apuntan a la misma función
  t: (clave: string, contexto: Record<string, any>) => {
  const locale = contexto.Mockify?.locale ?? "en";
  const traducciones = cargarTraducciones(locale);

  const partes = clave.split(".");
  let actual = traducciones;
    console.log("🌍 Locale recibido en filtro t:", contexto?.Mockify?.locale);
  for (const parte of partes) {
    actual = actual?.[parte];
    if (actual === undefined) break;
  }

  return actual ?? clave;
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

// 🔧 FUNCIÓN AUXILIAR CORREGIDA: procesarSnippet - SIN procesamiento prematuro de render
async function procesarSnippet(contenido: string, contexto: Record<string, any>): Promise<string> {
  console.log(`🔄 Procesando snippet/section con contexto:`, Object.keys(contexto));

  // Agregar template_type si no existe
  if (!contexto.template_type) {
    contexto.template_type = 'snippet';
  }

  // Paso 1: Tokenización
  const tokens = detectarTokensPlantilla(contenido);
  console.log("🔧 Tokens detectados en snippet:", tokens);

  // Paso 2: Clasificación de tokens
  const tokensClasificados = clasificarTokensPlantilla(tokens);
  console.log("🔧 Tokens clasificados en snippet:", tokensClasificados);

  // Paso 3: Procesar asignaciones
  const tokensConAsignaciones = procesarAsignaciones(tokensClasificados, contexto);

  // Paso 4: Procesar includes
  const tokensConIncludes = await procesarIncludes(tokensConAsignaciones, contexto);

  // 🔧 CAMBIO CRÍTICO: Procesar bucles ANTES que render
  // Esto permite que el bucle maneje el render con el contexto correcto
  const tokensConBucles = await procesarBucles(tokensConIncludes, contexto);
  console.log("🔧 Después de procesar bucles en snippet:", tokensConBucles);

  // Paso 5: Procesar condicionales
  const tokensConCondicionales = procesarCondicionales(tokensConBucles, contexto);

  // Paso 6: Renderizar variables finales
  const resultado = renderizarVariables(tokensConCondicionales, contexto, filtrosRegistrados);

  console.log("🎯 Resultado final del snippet:", resultado);
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

// 🎯 NUEVA FUNCIÓN: Procesar bloque específicamente dentro de bucles
async function procesarBloqueEnBucle(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  console.log(`🔧 procesarBloqueEnBucle - Contexto disponible:`, Object.keys(contexto));

  // 🔍 DEBUG: Mostrar contenido específico del contexto
  if (contexto.product) {
    console.log(`🔍 Product en contexto:`, contexto.product);
  }

  // Paso 1: Procesar asignaciones
  let tokensConAsignaciones = procesarAsignaciones([...tokens], contexto);

  // Paso 2: Procesar includes
  let tokensConIncludes = await procesarIncludes(tokensConAsignaciones, contexto);

  // 🔧 PASO 3: Procesar render AQUÍ con el contexto correcto del bucle
  let tokensConRender = await procesarRender(tokensConIncludes, contexto);

  // Paso 4: Procesar sections
  let tokensConSections = await procesarSection(tokensConRender, contexto);

  // Paso 5: Procesar bucles anidados (recursión)
  let tokensConBucles = await procesarBucles(tokensConSections, contexto);

  // Paso 6: Procesar condicionales
  let tokensConCondicionales = procesarCondicionales(tokensConBucles, contexto);

  // 🔧 PASO 7: Procesar variables con la función corregida
  let tokensFinales = tokensConCondicionales.map(token => {
    if (token.tipo === "variable") {
      console.log(`🔧 Procesando variable en bucle: ${token.contenido}`);
      console.log(`🔧 Contexto para variable:`, Object.keys(contexto));
      return procesarVariableConFiltros(token, contexto);
    }
    return token;
  });

  return tokensFinales;
}

// 🔧 FUNCIÓN CORREGIDA: procesarBucles - Maneja render dentro del contexto del bucle
async function procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  let resultado: TokenPlantilla[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.tipo === 'directiva' && token.directiva === 'for') {
      let partes = token.contenido.split(/\s+/);
      let nombreItem = partes[1];
      let nombreLista = partes[3];

      console.log(`🔄 Procesando bucle: ${nombreItem} in ${nombreLista}`);

      // 🔹 Resolver la lista desde el contexto
      let segmentos = nombreLista.replace(/\[(["'])(.*?)\1\]/g, '.$2').split('.');
      let valoresLista = segmentos.reduce((obj, key) => {
       return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
      }, contexto);

      console.log(`🔍 Lista encontrada:`, valoresLista);
      console.log(`🔍 Es array:`, Array.isArray(valoresLista));

      // 🔸 Si es Drop, no se puede iterar
      if (valoresLista?.isDrop) {
        console.warn(`Advertencia: no se puede iterar directamente un Drop: '${nombreLista}'`);
        i = saltarBloque(tokens, i);
        continue;
      }

      // 🔸 Si no es array, tampoco se puede iterar
      if (!Array.isArray(valoresLista)) {
        console.warn(`Advertencia: '${nombreLista}' no es un array. Valor:`, valoresLista);
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

      console.log(`🔍 Bloque interno del bucle:`, bloqueInterno);

      // 🔧 CORRECCIÓN CLAVE: Procesar cada elemento con render incluido
      for (let index = 0; index < valoresLista.length; index++) {
        let valor = valoresLista[index];
        let contextoLocal = {
        ...contexto,
        [nombreItem]: valor,
        Mockify: contexto.Mockify // ✅ Asegura que se mantenga el locale
        };

        console.log(`🔄 Iteración ${index + 1}:`, {
          nombreItem,
          valor,
          tieneTitle: valor?.title,
          tienePrecio: valor?.precio
        });

        // ✅ NUEVA FUNCIÓN: Procesar bloque con render en contexto local
        let bloqueProcesado = await procesarBloqueEnBucle(bloqueInterno, contextoLocal);
        resultado.push(...bloqueProcesado);
      }

      i = j - 1;
    } else {
      resultado.push(token);
    }

    i++;
  }

  return resultado;
}
// 🔧 FUNCIÓN CORREGIDA: procesarRender con mejor logging
async function procesarRender(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('render ')) {
      const partes = token.contenido.split(/,\s*/);
      const nombreRaw = partes[0].split(/\s+/)[1];
      const nombre = nombreRaw.replace(/^['"]|['"]$/g, '');

      console.log(`🔧 Procesando render '${nombre}' en contexto:`, Object.keys(contexto));

      const ruta = new URL(`../server/themes/dev/snippets/${nombre}.liquid`, import.meta.url).pathname;

      // 🔹 Extraer variables pasadas
      let variablesLocales: Record<string, any> = {};
      for (let i = 1; i < partes.length; i++) {
        let [clave, valorRaw] = partes[i].split(':').map(s => s.trim());

        // 🔧 CORRECCIÓN: Mejor resolución de variables
        let valor;
        if (/^['"]/.test(valorRaw)) {
          valor = valorRaw.slice(1, -1); // String literal
        } else {
          // Buscar en el contexto
          valor = contexto[valorRaw];
          console.log(`🔍 Resolviendo '${valorRaw}' como:`, valor);
        }

        variablesLocales[clave] = valor;
        console.log(`🔧 Variable local '${clave}':`, valor);
      }

      // 🔹 Clonar contexto base
      // 🔧 Corrección: pasar el contexto completo sin filtrar
      let contextoRender: Record<string, any> = {
       ...contexto,
       ...variablesLocales
};

      console.log(`🔧 Contexto final para render '${nombre}':`, Object.keys(contextoRender));

      try {
        const contenido = await Deno.readTextFile(ruta);
        const htmlRenderizado = await procesarSnippet(contenido, contextoRender);
        resultado.push({ tipo: 'texto', contenido: htmlRenderizado });
      } catch (error) {
        console.error(`❌ Error procesando render '${nombre}':`, error);
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

      // 🔧 CORRECCIÓN: Usar la ruta correcta hacia sections
      const ruta = new URL(`../server/themes/dev/sections/${nombre}.liquid`, import.meta.url).pathname;

      console.log(`🔍 Intentando cargar sección desde: ${ruta}`);

      try {
        const contenido = await Deno.readTextFile(ruta);

        // 🔎 Separar plantilla visual y extraer schema
        const contenidoVisual = contenido.replace(/{% schema %}[\s\S]*?{% endschema %}/, "").trim();

        // 🔧 Construir contexto local de la sección
        const settings =
        contexto.sections?.[nombre]?.settings ??
        contexto.settings?.current?.sections?.[nombre]?.settings ??
        {};


        console.log(`🔍 Settings para sección '${nombre}':`, settings);
        console.log(`🔍 Contexto completo disponible:`, Object.keys(contexto));
        console.log(`🔍 contexto.collections:`, contexto.collections);
        console.log(`🔍 contexto.products:`, contexto.products);

        if (Object.keys(settings).length === 0) {
        console.warn(`⚠️ Advertencia: No se encontraron settings para la sección '${nombre}'.`);
        }

        let contextoSection: Record<string, any> = {
         ...contexto // ✅ Conserva todo: Mockify, Drops, settings, etc.
        };

        // 🔧 CORRECCIÓN: Agregar el objeto section correctamente
        contextoSection.section = {
          settings,
        };

        // 🔧 CORRECCIÓN: Agregar template_type para asset_url
        contextoSection.template_type = 'section';

        const htmlRenderizado = await procesarSnippet(contenidoVisual, contextoSection);
        resultado.push({ tipo: 'texto', contenido: htmlRenderizado });
      } catch (error) {
        console.error(`❌ Error al cargar sección '${nombre}':`, error);
        resultado.push({ tipo: 'texto', contenido: `Liquid error: ${nombre} not found` });
      }
    } else {
      resultado.push(token);
    }
  }

  return resultado;
}

// 🎯 FUNCIÓN AUXILIAR MEJORADA: Procesa variables con filtros y contexto - CORREGIDA
function procesarVariableConFiltros(token: TokenPlantilla, contexto: Record<string, any>): TokenPlantilla {
  if (token.tipo === "variable") {
    let partes = token.contenido.split('|').map(p => p.trim());
    let nombreVariable = partes.shift() ?? '';
    let filtros = partes;

    console.log(`🔍 Procesando variable '${nombreVariable}' con filtros:`, filtros);
    console.log(`🔍 Contexto disponible:`, Object.keys(contexto));

    // Obtener el valor inicial
    let valorFinal: any;

    // Si es una cadena literal (entre comillas), usar el valor literal
    if (nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) {
      valorFinal = nombreVariable.slice(1, -1);
    } else if (nombreVariable.startsWith('"') && nombreVariable.endsWith('"')) {
      valorFinal = nombreVariable.slice(1, -1);
    } else {
      // 🔧 CORRECCIÓN PRINCIPAL: Mejor manejo de acceso a propiedades
      let segmentos = nombreVariable
        .replace(/\[(["'])(.*?)\1\]/g, '.$2')
        .split('.');

      console.log(`🔍 Buscando '${nombreVariable}' en segmentos:`, segmentos);

      valorFinal = segmentos.reduce((obj, key) => {
        console.log(`🔍 Accediendo a '${key}' en:`, obj);

        // 🔧 CORRECCIÓN: Mejor manejo de objetos normales y Drops
        if (obj === null || obj === undefined) {
          console.log(`⚠️ Objeto es null/undefined para clave '${key}'`);
          return undefined;
        }

        // Si es un Drop, usar su método de acceso
        if (obj?.isDrop) {
          const resultado = obj[key];
          console.log(`🔍 Acceso Drop '${key}':`, resultado);
          return resultado;
        }

        // 🔧 CORRECCIÓN CRÍTICA: Para objetos normales, verificar si existe la propiedad
        if (typeof obj === 'object' && obj !== null) {
          // Verificar si tiene la propiedad directamente
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const resultado = obj[key];
            console.log(`🔍 Acceso directo '${key}':`, resultado);
            return resultado;
          }

          // Si no existe, retornar undefined
          console.log(`⚠️ Propiedad '${key}' no encontrada en objeto:`, Object.keys(obj));
          return undefined;
        }

        console.log(`⚠️ No se puede acceder a '${key}' en tipo:`, typeof obj);
        return undefined;
      }, contexto);

      console.log(`🔍 Valor encontrado para '${nombreVariable}':`, valorFinal);

      if (valorFinal === undefined || valorFinal === null) {
        console.warn(`⚠️ Variable '${nombreVariable}' no encontrada. Contexto disponible:`, Object.keys(contexto));

        // 🔧 DEBUG: Mostrar el contenido completo del contexto para debugging
        console.log(`🔍 Contenido completo del contexto:`, contexto);

        valorFinal = "";
      }
    }

    // 🔧 Aplicar filtros secuencialmente, pasando el contexto
    for (let filtro of filtros) {
      let filtroLimpio = filtro.trim();
      if (!filtrosRegistrados[filtroLimpio]) {
        throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
      }

      console.log(`🔧 Aplicando filtro '${filtroLimpio}' a:`, valorFinal);

      if (filtroLimpio === 'asset_url' || filtroLimpio === 't' || filtroLimpio === 'translate') {
        valorFinal = filtrosRegistrados[filtroLimpio](valorFinal, contexto);
      } else {
        valorFinal = filtrosRegistrados[filtroLimpio](valorFinal);
      }
    }

    console.log(`✅ Resultado final para '${token.contenido}':`, valorFinal);
    return { tipo: "texto", contenido: String(valorFinal) };
  }

  return token;
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

        // 🔧 CORRECCIÓN: Filtros que necesitan contexto
        if (filtroLimpio === 'asset_url' || filtroLimpio === 't' || filtroLimpio === 'translate') {
          valorFinal = filtrosRegistrados[filtroLimpio](valorFinal, contexto);
        } else {
          valorFinal = filtrosRegistrados[filtroLimpio](valorFinal);
        }
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

    // 🔧 CAMBIO: Procesar bucles ANTES que render para el template principal
    // Esto maneja bucles que no están dentro de snippets
    const buclesProcesados = await procesarBucles(entradaConIncludes, contexto);
    console.log("Después de procesar bucles:\n", buclesProcesados);

    // Paso 5: Procesar render (después de bucles principales)
    const entradaConRender = await procesarRender(buclesProcesados, contexto);
    console.log("Despues de procesar render:\n", entradaConRender);

    // Paso 6: Procesar sections
    const entradaConSections = await procesarSection(entradaConRender, contexto);
    console.log("Después de procesar Sections:\n", entradaConSections);

    // Paso 7: Procesar bucles adicionales (para bucles que pudieron generarse en sections)
    const buclesFinales = await procesarBucles(entradaConSections, contexto);
    console.log("Después de procesar bucles finales:\n", buclesFinales);

    // Paso 8: Procesar condicionales
    const entradaProcesada = procesarCondicionales(buclesFinales, contexto);
    console.log("Después de procesar condicionales:\n", entradaProcesada);

    // Paso 9: Renderizar variables finales
    const entradaRenderizada = renderizarVariables(entradaProcesada, contexto, filtrosRegistrados);
    console.log("Resultado final de Liquid:\n", entradaRenderizada);

    let resultadoFinal = entradaRenderizada;

    return String(resultadoFinal);
}
