type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva;
}

let filtrosRegistrados: Record<string, Function> = {
  upcase: (x: string) => x.toUpperCase(),
  reverse: (x: string) => x.split('').reverse().join(''),
  asset_url: (x: string) => `./assets/${x}`,
  stylesheet_tag: (x: string) => `<link rel="stylesheet" href="${x}"></link>`,
  money: (x: number) => (x/100).toFixed(2)
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


// ✅ FUNCIÓN AUXILIAR: Procesa variables con filtros
function procesarVariableConFiltros(token: TokenPlantilla, contexto: Record<string, any>): TokenPlantilla {
    if (token.tipo === "variable") {
        let partes = token.contenido.split('|').map(p => p.trim());
        let nombreVariable = partes.shift() ?? '';
        let filtros = partes;

        // Obtener el valor inicial
        let valorFinal: any;

        // Si es una cadena literal (entre comillas), usar el valor literal
        if (nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) {
            valorFinal = nombreVariable.slice(1, -1); // Quitar las comillas
        } else if (nombreVariable.startsWith('"') && nombreVariable.endsWith('"')) {
            valorFinal = nombreVariable.slice(1, -1); // Quitar las comillas
        } else {
            // Obtener el valor de la variable del contexto
            valorFinal = nombreVariable.split('.').reduce((obj, key) => {
                return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
            }, contexto);

            // Si no está en el contexto, usar el nombre tal como está
            if (valorFinal === undefined) {
                valorFinal = nombreVariable;
            }
        }

        // Aplicar filtros secuencialmente
        for (let filtro of filtros) {
            let filtroLimpio = filtro.trim();
            if (!filtrosRegistrados[filtroLimpio]) {
                throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
            }
            valorFinal = filtrosRegistrados[filtroLimpio](valorFinal);
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

            // Resolver la lista desde el contexto (puede ser anidada como collection.products)
            let valoresLista = nombreLista.split('.').reduce((obj, key) => {
                return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
            }, contexto);

            if (!Array.isArray(valoresLista)) {
                console.warn(`Advertencia: '${nombreLista}' no es un array o no existe.`);
                // Buscar el endfor correspondiente y saltar el bloque
                let nivel = 1;
                let j = i + 1;
                while (j < tokens.length && nivel > 0) {
                    if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'for') {
                        nivel++;
                    } else if (tokens[j].tipo === 'directiva' && tokens[j].directiva === 'endfor') {
                        nivel--;
                    }
                    j++;
                }
                i = j - 1;
                i++;
                continue;
            }

            // Encontrar el bloque interno del bucle, respetando la anidación
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

            // Procesar cada elemento de la lista
            for (let valor of valoresLista) {
                let contextoLocal = { ...contexto, [nombreItem]: valor };

                // ✅ RECURSIÓN: Procesar bucles anidados primero
                let bloqueProcesadoBucles = procesarBucles(bloqueInterno, contextoLocal);

                // Luego procesar condicionales
                let bloqueProcesadoCondicionales = procesarCondicionales(bloqueProcesadoBucles, contextoLocal);

                // Finalmente procesar variables
                let tokensFinales = bloqueProcesadoCondicionales.map(token =>
                    procesarVariableConFiltros(token, contextoLocal)
                );

                resultado.push(...tokensFinales);
            }

            i = j - 1; // j ya apunta después del endfor
        } else {
            resultado.push(token);
        }

        i++;
    }

    return resultado;
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


// ✅ FUNCIÓN CORREGIDA: renderizarVariables
function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string {
    return tokens.map(token => {
        if (token.tipo === "variable") {
            // Separar variable y filtros
            let partes = token.contenido.split('|').map(p => p.trim());
            let nombreVariable = partes.shift() ?? '';
            let filtros = partes;

            // Obtener el valor inicial
            let valorFinal: any;

            // Si es una cadena literal (entre comillas), usar el valor literal
            if (nombreVariable.startsWith("'") && nombreVariable.endsWith("'")) {
                valorFinal = nombreVariable.slice(1, -1); // Quitar las comillas
            } else if (nombreVariable.startsWith('"') && nombreVariable.endsWith('"')) {
                valorFinal = nombreVariable.slice(1, -1); // Quitar las comillas
            } else {
                // Obtener el valor de la variable del contexto
                valorFinal = nombreVariable.split('.').reduce((obj, key) => {
                    return obj && Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
                }, contexto);

                // Si no está en el contexto, usar el nombre tal como está
                if (valorFinal === undefined) {
                    valorFinal = nombreVariable;
                }
            }

            // Aplicar filtros secuencialmente
            for (let filtro of filtros) {
                let filtroLimpio = filtro.trim();
                if (!filtrosRegistrados[filtroLimpio]) {
                    throw new Error(`Error: El filtro '${filtroLimpio}' no está definido.`);
                }
                valorFinal = filtrosRegistrados[filtroLimpio](valorFinal);
            }

            return String(valorFinal);
        }

        // Para tokens de texto, devolver el contenido tal como está
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

    // Paso 4: Procesar bucles PRIMERO (antes que condicionales)
    const buclesProcesados = procesarBucles(entradaProcesadaAsignacion, contexto);
    console.log("Después de procesar bucles:\n", buclesProcesados);

    // Paso 5: Procesar condicionales (después de bucles)
    const entradaProcesada = procesarCondicionales(buclesProcesados, contexto);
    console.log("Después de procesar condicionales:\n", entradaProcesada);

    // Paso 6: Renderizar variables finales
    const entradaRenderizada = renderizarVariables(entradaProcesada, contexto, filtrosRegistrados);
    console.log("Resultado final de Liquid:\n", entradaRenderizada);

    let resultadoFinal = entradaRenderizada;

    return String(resultadoFinal);
}
