//import { takeCoverageInsideWorker } from "vitest/browser.js";

/**
 * MÓDULO 11: ASIGNACIÓN DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), se pueden definir nuevas variables directamente desde la plantilla usando `{% assign %}`.
 * Esto permite guardar temporalmente un valor para usarlo más adelante en condiciones, bucles o filtros.
 *
 * Imagina que tienes una lista de frutas, y quieres mostrar cada una precedida por un mensaje común definido con `assign`.
 * Además, transformas el contenido usando filtros como `upcase` y `reverse`.
 *
 * ✅ Ejemplo de plantilla:
 * ```liquid
 * {% assign mensaje = 'Fruta disponible:' %}
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ mensaje | upcase }} {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados esperados:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "assign mensaje = \"Fruta disponible:\"" },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
 *   { tipo: "variable", contenido: "mensaje | upcase" },
 *   { tipo: "variable", contenido: "fruta | upcase | reverse" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Contexto de entrada:
 * ```ts
 * { frutas: ["manzana", "plátano"] }
 * ```
 *
 * ✅ Resultado esperado:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "FRUTA DISPONIBLE: ANAZNAM" },
 *   { tipo: "texto", contenido: "FRUTA DISPONIBLE: ONATÁLP" }
 * ]
 * ```
 *
 * 🎯 Objetivo:
 * Detectar y ejecutar asignaciones del tipo `{% assign nombre = valor %}` y actualizar el `contexto` con la nueva variable.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función `procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada token `tipo: "directiva"` que comience con `"assign "`:
 *    - Extrae el nombre y el valor con `.split("=")`
 *    - Si el valor está entre comillas (`"Hola"`), guárdalo como texto literal
 *    - Si **no** tiene comillas (`otroNombre`), busca el valor en el `contexto`
 *    - Guarda esa nueva variable en el `contexto`
 *    - El token `assign` no debe producir ningún contenido visible
 *
 * 🔍 Detalles a tener en cuenta:
 * - Los valores pueden ser:
 *   - Texto literal entre comillas: `"Hola"`
 *   - Un número: `42`
 *   - Otro nombre de variable: `otroNombre`
 * - Si detectas comillas (`"` o `'`), quítalas al guardar el valor
 * - Si no hay comillas, interpreta el contenido como el nombre de otra variable
 *
 * ✅ Consejo:
 * - Usa `.trim()` después del `split("=")` para evitar errores con espacios
 * - Este paso debe ejecutarse **antes** de renderizar variables o evaluar condicionales
 * - Las asignaciones no deben dejar rastros visibles en el resultado renderizado
 *
 * ⚠️ Validación:
 * Asegúrate de que tu motor todavía pueda:
 * - Procesar filtros (`upcase`, `reverse`, etc.)
 * - Evaluar condicionales (`if fruta`)
 * - Repetir contenido en bucles (`for fruta in frutas`)
 * - Y ahora también asignar valores (`assign`)
 */
type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

//Aqui colocar los datos que necesito para que las funciones encadenadas trabajen adecuadamente:
let entradaInicial = "{% assign mensaje ='Fruta disponible:'%}{% for fruta in frutas %}{% if fruta %}{{ mensaje | upcase }} {{ fruta | upcase | reverse }}{% endif %}{% endfor %}";
let contexto = {
 frutas: ["manzana", "plátano"]
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
                // 🔥 Nueva corrección: Si el valor es otra variable, pero no existe en el contexto, lo mantenemos intacto.
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
            let nombreItem = partes[1]; // "fruta"
            let nombreLista = partes[3]; // "frutas"

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

            for (let valor of valoresLista) {
                let contextoLocal = { ...contexto, [nombreItem]: valor };

                // Evaluar condicional dentro del bucle
                let bloqueProcesado = procesarCondicionales(bloqueInterno, contextoLocal);

                let tokensFinales = bloqueProcesado.map(token => {
                 if (token.tipo === "variable") {
                 let partes = token.contenido.split('|').map(p => p.trim());
                 let nombreVariable = partes.shift() ?? '';
                  if (nombreVariable === nombreItem) {
                   return { tipo: "variable", contenido: valor + " | " + partes.join(" | ") };
                  }
                }
                 return token;
                });


                resultado.push(...tokensFinales);
            }

            i = j; // Saltar al `{% endfor %}`
        } else {
            resultado.push(token); // Agregar otros tokens que no sean parte del bucle
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
    return tokens.map((token, index) => {
        if (token.tipo === 'variable') {
            let partes = token.contenido.split('|').map(p => p.trim());
            let nombreVariable = partes.shift() ?? '';

            let valor = contexto[nombreVariable] ?? nombreVariable; // 🔥 Aquí aseguramos que el contexto tenga la variable

            for (let filtroCrudo of partes) {
                let [nombreFiltro, args] = parseFiltro(filtroCrudo);

                if (!filtrosRegistrados[nombreFiltro]) {
                    throw new Error(`Error: El filtro '${nombreFiltro}' no está definido.`);
                }

                valor = filtrosRegistrados[nombreFiltro](valor, ...args);
            }

            return valor + "\n"; // Agregar salto de línea
        }

        return token.contenido + "\n";
    }).join('');
}


let entradaRenderizada = renderizarVariables(buclesProcesados, contexto, filtrosRegistrados);
console.log('6.Resultado entrada renderizada:',entradaRenderizada)
