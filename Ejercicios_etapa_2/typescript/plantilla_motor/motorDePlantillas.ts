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

// 🎯 FILTROS CORREGIDOS
let filtrosRegistrados: Record<string, Function> = {
  upcase: (x: string) => x.toUpperCase(),
  reverse: (x: string) => x.split('').reverse().join(''),
  asset_url: (x: string, contexto?: Record<string, any>) => {
    const templateType = contexto?.template_type || 'root';
    if (templateType === 'product' || templateType === 'collection') {
      return `../assets/${x}`;
    } else {
      return `./assets/${x}`;
    }
  },
  stylesheet_tag: (x: string) => `<link rel="stylesheet" href="${x}"></link>`,
  money: (x: number) => (x/100).toFixed(2),
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
  },
  times: (x: number, y: number) => x * y,
};

function preservarScripts(html: string): { html: string, scripts: string[] } {
  const scripts: string[] = [];
  const marcador = '__SCRIPT_BLOCK__';

  const htmlSinScripts = html.replace(/<script[\s\S]*?<\/script>/gi, match => {
    scripts.push(match);
    return marcador + scripts.length;
  });

  return { html: htmlSinScripts, scripts };
}

function restaurarScripts(html: string, scripts: string[]): string {
  return html.replace(/__SCRIPT_BLOCK__(\d+)/g, (_, index) => scripts[Number(index) - 1]);
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
  // 🔧 CORRECCIÓN: También detectar 'section' como directiva
  if (contenido.startsWith("section")) return null; // No es una directiva de control, pero sí es directiva
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

    return { tipo: "texto", contenido: token };
  });
}

function procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];

    console.log(`🔧 procesarAsignaciones - Tokens recibidos:`, tokens.length);

    for (let token of tokens) {
        if (token.tipo === "directiva") {
            // 🔧 CORRECCIÓN: Detectar assign con espacios y guiones
            let contenidoLimpio = token.contenido.trim();

            // Manejar tanto "assign x = 3" como "- assign x = 3 -"
            if (contenidoLimpio.includes('assign ')) {
                console.log(`🎯 Procesando asignación: '${contenidoLimpio}'`);

                // Extraer solo la parte del assign
                let parteAssign = contenidoLimpio;
                if (contenidoLimpio.startsWith('-')) {
                    parteAssign = contenidoLimpio.substring(1).trim();
                }
                if (parteAssign.endsWith('-')) {
                    parteAssign = parteAssign.substring(0, parteAssign.length - 1).trim();
                }

                console.log(`🔧 Parte assign extraída: '${parteAssign}'`);

                // Dividir en nombre = valor
                let partesAssign = parteAssign.split("=");
                if (partesAssign.length >= 2) {
                    let nombreVariable = partesAssign[0].replace("assign", "").trim();
                    let valorRaw = partesAssign.slice(1).join("=").trim(); // Por si hay = en el valor

                    console.log(`📝 Variable: '${nombreVariable}', Valor raw: '${valorRaw}'`);

                    let valorFinal;

                    // Detectar tipo de valor
                    if (/^['"].*['"]$/.test(valorRaw)) {
                        // String literal
                        valorFinal = valorRaw.slice(1, -1);
                        console.log(`📝 String detectado: '${valorFinal}'`);
                    } else if (valorRaw === 'true') {
                        valorFinal = true;
                        console.log(`✅ Boolean true detectado`);
                    } else if (valorRaw === 'false') {
                        valorFinal = false;
                        console.log(`❌ Boolean false detectado`);
                    } else if (/^-?\d+(\.\d+)?$/.test(valorRaw)) {
                        // Número
                        valorFinal = Number(valorRaw);
                        console.log(`🔢 Número detectado: ${valorFinal}`);
                    } else {
                        // Variable del contexto
                        valorFinal = contexto.hasOwnProperty(valorRaw) ? contexto[valorRaw] : valorRaw;
                        console.log(`🔗 Variable del contexto: ${valorRaw} = ${valorFinal}`);
                    }

                    // Asignar al contexto
                    contexto[nombreVariable] = valorFinal;
                    console.log(`✅ Asignado: ${nombreVariable} = ${valorFinal} (tipo: ${typeof valorFinal})`);
                    console.log(`🎯 Contexto actualizado:`, Object.keys(contexto));
                }

                // No agregar el token de assign al resultado (se consume)
                continue;
            }
        }

        // Si no es assign, agregar al resultado
        resultado.push(token);
    }

    console.log(`✅ procesarAsignaciones completado. Variables en contexto:`, Object.keys(contexto));
    return resultado;
}

async function procesarSnippet(contenido: string, contexto: Record<string, any>): Promise<string> {
  console.log(`🔄 Procesando snippet/section con contexto:`, Object.keys(contexto));

  if (!contexto.template_type) {
    contexto.template_type = 'snippet';
  }

  const tokens = detectarTokensPlantilla(contenido);
  const tokensClasificados = clasificarTokensPlantilla(tokens);
  const tokensConAsignaciones = procesarAsignaciones(tokensClasificados, contexto);
  const tokensConIncludes = await procesarIncludes(tokensConAsignaciones, contexto);
  const tokensConBucles = await procesarBucles(tokensConIncludes, contexto);
  const tokensConCondicionales = procesarCondicionales(tokensConBucles, contexto);
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
        const snippetProcesado = await procesarSnippet(contenido, contexto);
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

async function procesarBloqueEnBucle(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  console.log(`🔧 procesarBloqueEnBucle - Contexto disponible:`, Object.keys(contexto));

  if (contexto.product) {
    console.log(`🔍 Product en contexto:`, contexto.product);
  }

  let tokensConAsignaciones = procesarAsignaciones([...tokens], contexto);
  let tokensConIncludes = await procesarIncludes(tokensConAsignaciones, contexto);
  let tokensConRender = await procesarRender(tokensConIncludes, contexto);
  let tokensConSections = await procesarSection(tokensConRender, contexto);
  let tokensConBucles = await procesarBucles(tokensConSections, contexto);
  let tokensConCondicionales = procesarCondicionales(tokensConBucles, contexto);

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

// 🔧 FUNCIÓN CORREGIDA: procesarBucles - Maneja endfor correctamente
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

      // 🔸 Si es Drop, intentar acceso directo
      if (valoresLista?.isDrop || (valoresLista && typeof valoresLista[segmentos[segmentos.length - 1]] !== 'undefined')) {
        console.log(`🔍 Intentando acceso Drop para '${nombreLista}'`);
        // Para Drops, intentar acceso directo
        const ultimaPropiedad = segmentos[segmentos.length - 1];
        if (valoresLista[ultimaPropiedad]) {
          valoresLista = valoresLista[ultimaPropiedad];
        }
      }

      // 🔸 Si no es array, saltamos el bucle
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
        Mockify: contexto.Mockify
        };

        console.log(`🔄 Iteración ${index + 1}:`, {
          nombreItem,
          valor,
          tieneTitle: valor?.title,
          tienePrecio: valor?.precio
        });

        let bloqueProcesado = await procesarBloqueEnBucle(bloqueInterno, contextoLocal);
        resultado.push(...bloqueProcesado);
      }

      i = j - 1; // j ya apunta después del endfor
    } else if (token.tipo === 'directiva' && token.directiva === 'endfor') {
      // 🔧 CORRECCIÓN: No añadir endfor sueltos al resultado
      console.log(`🔧 Eliminando endfor suelto`);
      // No hacer nada, simplemente saltarlo
    } else {
      resultado.push(token);
    }

    i++;
  }

  return resultado;
}

async function procesarRender(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('render ')) {
      const partes = token.contenido.split(/,\s*/);
      const nombreRaw = partes[0].split(/\s+/)[1];
      const nombre = nombreRaw.replace(/^['"]|['"]$/g, '');

      console.log(`🔧 Procesando render '${nombre}' en contexto:`, Object.keys(contexto));

      const ruta = new URL(`../server/themes/dev/snippets/${nombre}.liquid`, import.meta.url).pathname;

      let variablesLocales: Record<string, any> = {};
      for (let i = 1; i < partes.length; i++) {
        let [clave, valorRaw] = partes[i].split(':').map(s => s.trim());

        let valor;
        if (/^['"]/.test(valorRaw)) {
          valor = valorRaw.slice(1, -1);
        } else {
          valor = contexto[valorRaw];
          console.log(`🔍 Resolviendo '${valorRaw}' como:`, valor);
        }

        variablesLocales[clave] = valor;
        console.log(`🔧 Variable local '${clave}':`, valor);
      }

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

async function procesarSection(tokens: TokenPlantilla[], contexto: Record<string, any>): Promise<TokenPlantilla[]> {
  const resultado: TokenPlantilla[] = [];

  for (const token of tokens) {
    if (token.tipo === 'directiva' && token.contenido.startsWith('section ')) {
      const nombreRaw = token.contenido.split(/\s+/)[1];
      const nombre = nombreRaw?.replace(/^['"]|['"]$/g, '');

      const ruta = new URL(`../server/themes/dev/sections/${nombre}.liquid`, import.meta.url).pathname;

      console.log(`🔍 Intentando cargar sección desde: ${ruta}`);

      try {
        const contenido = await Deno.readTextFile(ruta);
        const contenidoVisual = contenido.replace(/{% schema %}[\s\S]*?{% endschema %}/, "").trim();

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
         ...contexto
        };

        contextoSection.section = {
          settings,
        };

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

// 🔧 FUNCIÓN PRINCIPAL CORREGIDA: procesarVariableConFiltros
function procesarVariableConFiltros(token: TokenPlantilla, contexto: Record<string, any>): TokenPlantilla {
  if (token.tipo === "variable") {
    let partes = token.contenido.split('|').map(p => p.trim());
    let nombreVariable = partes.shift() ?? '';
    let filtros = partes;

    console.log(`🔍 Procesando variable '${nombreVariable}' con filtros:`, filtros);
    console.log(`🔍 Contexto disponible:`, Object.keys(contexto));

    let valorFinal: any;

    // Detectar si es literal
    if ((nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) ||
        (nombreVariable.startsWith('"') && nombreVariable.endsWith('"'))) {
      valorFinal = nombreVariable.slice(1, -1);
    } else {
      valorFinal = resolverVariable(nombreVariable, contexto);
    }

    // Aplicar filtros secuencialmente
    for (let filtro of filtros) {
      let [nombreFiltro, argumentoRaw] = filtro.split(':').map(s => s.trim());

      if (!filtrosRegistrados[nombreFiltro]) {
        throw new Error(`Error: El filtro '${nombreFiltro}' no está definido.`);
      }

      console.log(`🔧 Aplicando filtro '${nombreFiltro}' a:`, valorFinal, argumentoRaw ? `con argumento '${argumentoRaw}'` : '');

      if (argumentoRaw !== undefined) {
        let argumento = resolverVariable(argumentoRaw, contexto);
        valorFinal = filtrosRegistrados[nombreFiltro](valorFinal, argumento);
      } else if (nombreFiltro === 'asset_url' || nombreFiltro === 't' || nombreFiltro === 'translate') {
        valorFinal = filtrosRegistrados[nombreFiltro](valorFinal, contexto);
      } else {
        valorFinal = filtrosRegistrados[nombreFiltro](valorFinal);
      }
    }

    console.log(`✅ Resultado final para '${token.contenido}':`, valorFinal);
    return { tipo: "texto", contenido: String(valorFinal) };
  }

  return token;
}

// 🔧 FUNCIÓN MEJORADA: resolverVariable con mejor logging
function resolverVariable(nombreVariable: string, contexto: Record<string, any>): any {
  console.log(`🔍 Resolviendo variable '${nombreVariable}'`);
  console.log(`🔍 Contexto disponible:`, Object.keys(contexto));

  // Verificar si la variable existe directamente
  if (Object.prototype.hasOwnProperty.call(contexto, nombreVariable)) {
    const valor = contexto[nombreVariable];
    console.log(`✅ Variable '${nombreVariable}' encontrada directamente: ${valor} (tipo: ${typeof valor})`);
    return valor;
  }

  // Manejar acceso con corchetes como collections["soft-shirts"]
  let segmentos = nombreVariable
    .replace(/\[(["'])(.*?)\1\]/g, '.$2') // convierte ['x'] o ["x"] a .x
    .split('.');

  console.log(`🔍 Segmentos de '${nombreVariable}':`, segmentos);

  let valorFinal = segmentos.reduce((obj, key, index) => {
    console.log(`🔍 Paso ${index + 1}: Accediendo a '${key}' en:`, typeof obj);
    console.log(`🔍 Valor actual del objeto:`, obj);

    if (obj === null || obj === undefined) {
      console.log(`⚠️ Objeto es null/undefined para clave '${key}'`);
      return undefined;
    }

    // 🔧 CORRECCIÓN ESPECÍFICA PARA DROPS
    if (obj?.isDrop || (obj instanceof Map)) {
      console.log(`🔍 Objeto es Drop/Map, intentando acceso a '${key}'`);

      // Intentar acceso vía get() si es Map
      if (obj instanceof Map && obj.has(key)) {
        const resultado = obj.get(key);
        console.log(`✅ Map.get('${key}'):`, resultado);
        return resultado;
      }

      // Intentar acceso directo (para Proxy)
      const resultado = obj[key];
      console.log(`🔍 Acceso directo Drop['${key}']:`, resultado);

      if (resultado !== undefined) {
        return resultado;
      }

      // 🔧 ÚLTIMO RECURSO: Si el drop no tiene la clave, retornar undefined
      console.log(`⚠️ Drop no tiene la clave '${key}'`);
      return undefined;
    }

    // Para objetos normales
    if (typeof obj === 'object' && obj !== null) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const resultado = obj[key];
        console.log(`✅ Acceso Object['${key}']:`, resultado, `(tipo: ${typeof resultado})`);
        return resultado;
      }

      // Acceso directo como fallback
      const resultado = obj[key];
      if (resultado !== undefined) {
        console.log(`✅ Acceso directo fallback ['${key}']:`, resultado);
        return resultado;
      }

      console.log(`⚠️ Propiedad '${key}' no encontrada. Disponibles:`, Object.keys(obj));
      return undefined;
    }

    console.log(`⚠️ No se puede acceder a '${key}' en tipo:`, typeof obj);
    return undefined;
  }, contexto);

  if (valorFinal === undefined || valorFinal === null) {
    console.warn(`⚠️ Variable '${nombreVariable}' no encontrada, retornando string vacío`);
    valorFinal = "";
  } else {
    console.log(`✅ Variable '${nombreVariable}' resuelta como:`, valorFinal, `(tipo: ${typeof valorFinal})`);
  }

  return valorFinal;
}

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

// 🎯 FUNCIÓN NUEVA: Evaluar expresión condicional
function evaluarExpresionCondicional(expresion: string, contexto: Record<string, any>): boolean {
  console.log(`🔍 Evaluando expresión: '${expresion}'`);

  // Limpiar espacios extra
  expresion = expresion.trim();

  // Detectar operadores de comparación (en orden de precedencia para evitar confusión)
  const operadores = ['==', '!=', '>=', '<=', '>', '<'];
  let operadorEncontrado: string | null = null;
  let left: string = '';
  let right: string = '';

  // Buscar el operador
  for (const op of operadores) {
    const index = expresion.indexOf(op);
    if (index !== -1) {
      operadorEncontrado = op;
      left = expresion.substring(0, index).trim();
      right = expresion.substring(index + op.length).trim();
      break;
    }
  }

  // Si no hay operador, evaluar truthiness
  if (!operadorEncontrado) {
    console.log(`📋 Sin operador, evaluando truthiness de: '${expresion}'`);
    const valor = resolverOperando(expresion, contexto);
    const resultado = evaluarTruthiness(valor);
    console.log(`✅ Truthiness de '${expresion}' = ${valor} → ${resultado}`);
    return resultado;
  }

  console.log(`🔧 Operador encontrado: '${operadorEncontrado}', left: '${left}', right: '${right}'`);

  // Resolver operandos
  const valorLeft = resolverOperando(left, contexto);
  const valorRight = resolverOperando(right, contexto);

  console.log(`📊 Valores resueltos: left=${valorLeft} (${typeof valorLeft}), right=${valorRight} (${typeof valorRight})`);

  // Aplicar comparación
  const resultado = ejecutarComparacion(valorLeft, valorRight, operadorEncontrado);
  console.log(`✅ Resultado de comparación: ${valorLeft} ${operadorEncontrado} ${valorRight} → ${resultado}`);

  return resultado;
}

// 🎯 FUNCIÓN NUEVA: Resolver operando (variable o literal)
function resolverOperando(operando: string, contexto: Record<string, any>): any {
  operando = operando.trim();

  // Literal string
  if ((operando.startsWith('"') && operando.endsWith('"')) ||
      (operando.startsWith("'") && operando.endsWith("'"))) {
    return operando.slice(1, -1);
  }

  // Literal boolean
  if (operando === 'true') return true;
  if (operando === 'false') return false;

  // Literal numérico
  if (/^-?\d+(\.\d+)?$/.test(operando)) {
    return parseFloat(operando);
  }

  // Variable del contexto
  return resolverVariable(operando, contexto);
}

// 🎯 FUNCIÓN NUEVA: Ejecutar comparación con coerción de tipos
function ejecutarComparacion(left: any, right: any, operador: string): boolean {
  // Convertir a números si ambos son numéricos
  const leftEsNumerico = esNumerico(left);
  const rightEsNumerico = esNumerico(right);

  if (leftEsNumerico && rightEsNumerico) {
    const numLeft = Number(left);
    const numRight = Number(right);

    console.log(`🔢 Comparación numérica: ${numLeft} ${operador} ${numRight}`);

    switch (operador) {
      case '==': return numLeft === numRight;
      case '!=': return numLeft !== numRight;
      case '>': return numLeft > numRight;
      case '>=': return numLeft >= numRight;
      case '<': return numLeft < numRight;
      case '<=': return numLeft <= numRight;
      default: return false;
    }
  }

  // Para == y != también comparar como strings si no son ambos numéricos
  if (operador === '==' || operador === '!=') {
    const strLeft = String(left);
    const strRight = String(right);
    console.log(`📝 Comparación de igualdad como strings: '${strLeft}' ${operador} '${strRight}'`);

    if (operador === '==') return strLeft === strRight;
    if (operador === '!=') return strLeft !== strRight;
  }

  // Para otros operadores, comparar como strings
  const strLeft = String(left);
  const strRight = String(right);

  console.log(`🔤 Comparación alfabética: '${strLeft}' ${operador} '${strRight}'`);

  switch (operador) {
    case '>': return strLeft > strRight;
    case '>=': return strLeft >= strRight;
    case '<': return strLeft < strRight;
    case '<=': return strLeft <= strRight;
    default: return false;
  }
}

// 🎯 FUNCIÓN NUEVA: Verificar si un valor es numérico
function esNumerico(valor: any): boolean {
  if (typeof valor === 'number') return true;
  if (typeof valor === 'string') {
    return /^-?\d+(\.\d+)?$/.test(valor.trim());
  }
  return false;
}

// 🎯 FUNCIÓN NUEVA: Evaluar truthiness según las reglas de Liquid
function evaluarTruthiness(valor: any): boolean {
  // false, null, undefined → falsy
  if (valor === false || valor === null || valor === undefined) return false;

  // String vacío → falsy
  if (typeof valor === 'string' && valor === '') return false;

  // Número 0 → falsy
  if (typeof valor === 'number' && valor === 0) return false;

  // Todo lo demás → truthy
  return true;
}

// 🔧 FUNCIÓN MODIFICADA: procesarCondicionales con soporte completo
function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
  let resultado: TokenPlantilla[] = [];
  let i = 0;

  while (i < tokens.length) {
    let token = tokens[i];

    if (token.tipo === 'directiva' && token.directiva === 'if') {
      console.log(`🔄 Procesando condicional: ${token.contenido}`);

      // Extraer la expresión después de 'if'
      const expresion = token.contenido.replace(/^if\s+/, '').trim();
      console.log(`📝 Expresión extraída: '${expresion}'`);

      // Evaluar la condición inicial
      let condicionActual = evaluarExpresionCondicional(expresion, contexto);
      console.log(`🎯 Condición inicial evaluada: ${condicionActual}`);

      let j = i + 1;
      let bloquesCondicionales: Array<{ tipo: 'if' | 'elsif' | 'else', tokens: TokenPlantilla[], condicion?: boolean }> = [];
      let bloqueActual: TokenPlantilla[] = [];
      let nivel = 1;

      // Recopilar todos los bloques del condicional
      while (j < tokens.length && nivel > 0) {
        let siguienteToken = tokens[j];

        if (siguienteToken.tipo === 'directiva') {
          if (siguienteToken.directiva === 'if') {
            nivel++;
            bloqueActual.push(siguienteToken);
          } else if (siguienteToken.directiva === 'endif') {
            nivel--;
            if (nivel === 0) {
              // Guardar el bloque actual antes de terminar
              if (bloquesCondicionales.length === 0) {
                bloquesCondicionales.push({ tipo: 'if', tokens: bloqueActual, condicion: condicionActual });
              } else {
                const ultimoBloque = bloquesCondicionales[bloquesCondicionales.length - 1];
                ultimoBloque.tokens = bloqueActual;
              }
              break;
            } else {
              bloqueActual.push(siguienteToken);
            }
          } else if (nivel === 1 && siguienteToken.directiva === 'elsif') {
            // Guardar bloque anterior
            if (bloquesCondicionales.length === 0) {
              bloquesCondicionales.push({ tipo: 'if', tokens: bloqueActual, condicion: condicionActual });
            } else {
              const ultimoBloque = bloquesCondicionales[bloquesCondicionales.length - 1];
              ultimoBloque.tokens = bloqueActual;
            }

            // Evaluar nueva condición elsif
            const expresionElsif = siguienteToken.contenido.replace(/^elsif\s+/, '').trim();
            const condicionElsif = evaluarExpresionCondicional(expresionElsif, contexto);
            console.log(`🔄 Evaluando elsif '${expresionElsif}': ${condicionElsif}`);

            bloquesCondicionales.push({ tipo: 'elsif', tokens: [], condicion: condicionElsif });
            bloqueActual = [];
          } else if (nivel === 1 && siguienteToken.directiva === 'else') {
            // Guardar bloque anterior
            if (bloquesCondicionales.length === 0) {
              bloquesCondicionales.push({ tipo: 'if', tokens: bloqueActual, condicion: condicionActual });
            } else {
              const ultimoBloque = bloquesCondicionales[bloquesCondicionales.length - 1];
              ultimoBloque.tokens = bloqueActual;
            }

            bloquesCondicionales.push({ tipo: 'else', tokens: [], condicion: true }); // else siempre es true
            bloqueActual = [];
          } else {
            bloqueActual.push(siguienteToken);
          }
        } else {
          bloqueActual.push(siguienteToken);
        }

        j++;
      }

      console.log(`📋 Bloques condicionales encontrados:`, bloquesCondicionales.map(b => ({ tipo: b.tipo, condicion: b.condicion, tokens: b.tokens.length })));

      // Seleccionar qué bloque ejecutar
      let bloqueAEjecutar: TokenPlantilla[] = [];
      for (const bloque of bloquesCondicionales) {
        if (bloque.condicion) {
          bloqueAEjecutar = bloque.tokens;
          console.log(`✅ Ejecutando bloque ${bloque.tipo}`);
          break;
        }
      }

      // Añadir tokens del bloque seleccionado
      resultado.push(...bloqueAEjecutar);

      i = j; // Saltar hasta después del endif
    } else {
      resultado.push(token);
    }

    i++;
  }

  return resultado;
}

// 🔧 FUNCIÓN MEJORADA: renderizarVariables con mejor logging
function renderizarVariables(
  tokens: TokenPlantilla[],
  contexto: Record<string, any>,
  filtrosRegistrados: Record<string, Function>
): string {
  console.log(`🎨 renderizarVariables - Contexto disponible:`, Object.keys(contexto));

  return tokens.map((token, index) => {
    if (token.tipo === "variable") {
      console.log(`🎨 Renderizando variable ${index}: '${token.contenido}'`);

      let partes = token.contenido.split('|').map(p => p.trim());
      let nombreVariable = partes.shift() ?? '';
      let filtros = partes;

      console.log(`🔍 Variable: '${nombreVariable}', Filtros: [${filtros.join(', ')}]`);

      let valorFinal: any;

      // Si es cadena literal
      if ((nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) ||
          (nombreVariable.startsWith('"') && nombreVariable.endsWith('"'))) {
        valorFinal = nombreVariable.slice(1, -1);
        console.log(`📝 Literal string detectado: '${valorFinal}'`);
      } else {
        // 🔧 USAR LA FUNCIÓN resolverVariable
        valorFinal = resolverVariable(nombreVariable, contexto);
        console.log(`🔍 Variable '${nombreVariable}' resuelta como:`, valorFinal, `(tipo: ${typeof valorFinal})`);
      }

      // Aplicar filtros
      for (let filtro of filtros) {
        let filtroLimpio = filtro.trim();
        if (!filtrosRegistrados[filtroLimpio]) {
          console.error(`❌ Filtro '${filtroLimpio}' no encontrado`);
          throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
        }

        console.log(`🔧 Aplicando filtro '${filtroLimpio}' a:`, valorFinal);

        if (filtroLimpio === 'asset_url' || filtroLimpio === 't' || filtroLimpio === 'translate') {
          valorFinal = filtrosRegistrados[filtroLimpio](valorFinal, contexto);
        } else {
          valorFinal = filtrosRegistrados[filtroLimpio](valorFinal);
        }

        console.log(`✅ Resultado después de filtro '${filtroLimpio}':`, valorFinal);
      }

      const resultado = String(valorFinal);
      console.log(`✅ Variable '${token.contenido}' renderizada como: '${resultado}'`);
      return resultado;
    }

    return token.contenido;
  }).join('');
}


export async function liquidEngine(entradaInicial: string, contexto: Record<string, any>): Promise<string> {
  //Contenido recibido
    console.log("Entrada inicial en liquidEngine:\n", entradaInicial);
    console.log("contexto pasado:", contexto);

  // Paso 1️⃣ Tokenizar y clasificar
    const entradaTokenizada = detectarTokensPlantilla(entradaInicial);
    console.log("Entrada Tokenizada:",entradaTokenizada);

    const entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
    console.log("Entrada Clasificada:",entradaClasificada);

    // 2️⃣ Procesar asignaciones, includes, bucles, sections, condicionales
    const entradaProcesadaAsignacion = procesarAsignaciones(entradaClasificada, contexto);
    console.log("Entrada Asignaciones Procesadas:", entradaProcesadaAsignacion);

    const entradaConIncludes = await procesarIncludes(entradaProcesadaAsignacion, contexto);
    console.log("Entrada con Includes:", entradaConIncludes);

    const buclesProcesados = await procesarBucles(entradaConIncludes, contexto);
    console.log("Bucles Procesados:",buclesProcesados);

    const entradaConRender = await procesarRender(buclesProcesados, contexto);
    console.log("Entrada con Render:", entradaConRender);

    const entradaConSections = await procesarSection(entradaConRender, contexto);
    console.log("Entrada con Sections:", entradaConSections);

    const buclesFinales = await procesarBucles(entradaConSections, contexto);
    console.log("Bucles Finales:", buclesFinales);

    const entradaProcesada = procesarCondicionales(buclesFinales, contexto);
    console.log("Entrada Procesada:", entradaProcesada);

    // 3️⃣ Renderizar variables (¡aquí se sustituyen los {{ product.id }}!)
    const entradaRenderizadaParcial = renderizarVariables(entradaProcesada, contexto, filtrosRegistrados);
    console.log("Entrada Renderizada Parcial:", entradaRenderizadaParcial)

    // 4️⃣ Preservar bloques <script> para proteger el =>
    const { html: entradaSinScripts, scripts } = preservarScripts(entradaRenderizadaParcial);
    console.log("Entrada sin scripts:",entradaSinScripts, "scripts:")

    // 5️⃣ Restaurar los scripts al final
    const resultadoFinal = restaurarScripts(entradaSinScripts, scripts);
    console.log("Resultado Final",resultadoFinal )


    return String(resultadoFinal);
}


/* export async function liquidEngine(entradaInicial: string, contexto: Record<string, any>): Promise<string> {
    console.log("Entrada inicial en liquidEngine:\n", entradaInicial);
    console.log("contexto pasado", contexto);

    const { html: entradaSinScripts, scripts } = preservarScripts(entradaInicial);

    const entradaTokenizada = detectarTokensPlantilla(entradaSinScripts);
    console.log("Tokens de Liquid:\n", entradaTokenizada);

    const entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
    console.log("Tokens clasificados:\n", entradaClasificada);

    const entradaProcesadaAsignacion = procesarAsignaciones(entradaClasificada, contexto);
    console.log("Después de procesar asignaciones:\n", entradaProcesadaAsignacion);

    const entradaConIncludes = await procesarIncludes(entradaProcesadaAsignacion, contexto);
    console.log("Después de procesar includes:\n", entradaConIncludes);

    const buclesProcesados = await procesarBucles(entradaConIncludes, contexto);
    console.log("Después de procesar bucles:\n", buclesProcesados);

    const entradaConRender = await procesarRender(buclesProcesados, contexto);
    console.log("Despues de procesar render:\n", entradaConRender);

    const entradaConSections = await procesarSection(entradaConRender, contexto);
    console.log("Después de procesar Sections:\n", entradaConSections);

    const buclesFinales = await procesarBucles(entradaConSections, contexto);
    console.log("Después de procesar bucles finales:\n", buclesFinales);

    const entradaProcesada = procesarCondicionales(buclesFinales, contexto);
    console.log("Después de procesar condicionales:\n", entradaProcesada);

    const entradaRenderizada = renderizarVariables(entradaProcesada, contexto, filtrosRegistrados);
    console.log("Resultado final de Liquid:\n", entradaRenderizada);

    let resultadoFinal = restaurarScripts(entradaRenderizada, scripts);
    return String(resultadoFinal);

}
*/
