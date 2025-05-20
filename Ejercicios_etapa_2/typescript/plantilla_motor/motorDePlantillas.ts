type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

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
        directiva: clasificarDirectiva(contenido) ?? undefined
      };
    }

    return { tipo: "texto", contenido: token.trim() };
  });
} // La salida de esta es la equivalente a tokens, imprimir si es necesario saber que es cada cosa


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

        let tokensFinales = bloqueInterno.map<TokenPlantilla>(token => {
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

export function liquidEngine(entradaInicial: string, contexto: Record<string, any>): string {
//console.log("Entrada inicial en liquidEngine:\n", entradaInicial);

  const entradaTokenizada = detectarTokensPlantilla(entradaInicial);
//console.log("Tokens de Liquid:\n", entradaTokenizada);

  const entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);
//console.log("Tokens clasificados:\n", entradaClasificada);

  const entradaProcesadaAsignacion = procesarAsignaciones(entradaClasificada, contexto);
//console.log("Después de procesar asignaciones:\n", entradaProcesadaAsignacion);

  const entradaProcesada = procesarCondicionales(entradaProcesadaAsignacion, contexto);
//console.log("Después de procesar condicionales:\n", entradaProcesada);

  const buclesProcesados = procesarBucles(entradaProcesada, contexto);
//console.log("Después de procesar bucles:\n", buclesProcesados);

  const entradaRenderizada = renderizarVariables(buclesProcesados, contexto, filtrosRegistrados);
//console.log("Resultado final de Liquid:\n", entradaRenderizada);

  return entradaRenderizada;
}
