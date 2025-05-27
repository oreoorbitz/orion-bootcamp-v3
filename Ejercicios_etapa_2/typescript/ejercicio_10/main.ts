/**
 * MÓDULO 10: FILTROS EN VARIABLES DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), una variable se puede transformar antes de renderizarse usando *filtros*.
 * Estos filtros permiten aplicar funciones como mayúsculas, formateo de moneda, inversión de texto, etc.
 *
 * Los filtros se escriben después de la variable, separados por `|`, y se aplican en orden como una *tubería* (pipeline):
 * También podemos tener texto en lugar de una variable, tu función debe ser capaz de aplicar los filtros a ambos.
 * Ejemplo:
 *   - `{{ nombre | upcase }}` → convierte a mayúsculas
 *   - `{{ nombre | upcase | reverse }}` → mayúsculas y luego invertir el texto
 *
 * En este módulo extenderás tu motor para aplicar esos filtros antes de mostrar el valor.
 *
 * ✅ Ejemplo de plantilla completa (con loop, condición y filtros combinados):
 * ```liquid
 * {{ "nuestra fruta es" | upcase }}
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 *
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "variable", contenido: "nuestra fruta es" | upcase },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
 *   { tipo: "variable", contenido: "fruta | upcase | reverse" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas: ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "NUESTRA FRUTA ES"}
 *   { tipo: "texto", contenido: "ANAZNAM" },
 *   { tipo: "texto", contenido: "ONATÁLP" }
 *   { tipo: "texto", contenido: "AVU" }
 * ]
 * ```
 *
 * Objetivo:
 * Agregar soporte para filtros dentro de `{{ ... }}`, aplicándolos antes de mostrar el valor final.
 *
 * Instrucciones:
 * 1. Crea una función `aplicarFiltros(nombreVariable: string, filtros: string[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string`
 *    - Busca el valor en el contexto
 *    - Aplica cada filtro desde `filtrosRegistrados` en orden
 *    nota: el objeto de 'filtrosRegistrados' esta escrito mas abajo en las instruciones
 *
 *
 * 2. Extiende tu función `renderizarVariables()` para:
 *    - Detectar si el contenido del token `variable` contiene `|`
 *    - Separar el nombre de variable y los filtros con `.split('|')`
 *    - Aplicar `aplicarFiltros(...)` en lugar de acceder directamente al contexto
 *
 * Para probar tu funcion, utiliza:
 * ```ts
 * { tipo: "variable", contenido: "fruta | upcase | reverse" }
 * ```
 *
 * contexto:
 * ```ts
 * { fruta: "plátano" }
 * ```
 *
 * filtrosRegistrados:
 * ```ts
 * {
 *   upcase: (x) => x.toUpperCase(),
 *   reverse: (x) => x.split('').reverse().join('')
 * }
 * ```
 *
 * Resultado esperado:
 * ```ts
 * "ONATÁLP"
 * ```
 *
 * Consejo:
 * - Recorta espacios usando `.trim()` en cada parte del filtro
 * - Puedes lanzar un error si el filtro no está definido
 * - Reutiliza el motor completo: primero bucles, luego condiciones, luego filtros → orden importa
 */

//Este código funciona perfectamente, se coloca en comentarios para poder hacer los opcionales, copiar de aquí si es necesario si rompes algo <3

/* type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

//Aqui colocar los datos que necesito para que las funciones encadenadas trabajen adecuadamente:
let entradaInicial = "{% for fruta in frutas %}{% if fruta %}{{ fruta | upcase | reverse }}{% endif %}{% endfor %}";
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

let entradaProcesada = procesarCondicionales(entradaClasificada,contexto);
console.log('3.Resultado de procesar condicionales:',entradaProcesada);

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
console.log('4.Resultado de procesar bucles',buclesProcesados)

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


function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>, filtrosRegistrados: Record<string, Function>): string {
    return tokens.map((token, index) => {
        if (token.tipo === 'variable') {
            // Separar la variable y los filtros
            let partes = token.contenido.split('|').map(p => p.trim());
            let nombreVariable = partes.shift() ?? '';
            return aplicarFiltros(nombreVariable, partes, contexto, filtrosRegistrados) + "\n"; // Agregar salto de línea
        }

        // Si el token actual es texto y el siguiente es una variable, añadimos espacio al final
        if (token.tipo === "texto" && tokens[index + 1]?.tipo === "variable") {
            return token.contenido + " ";
        }

        return token.contenido + "\n"; // También agregamos salto de línea para separar texto
    }).join('');
}


let entradaRenderizada = renderizarVariables(buclesProcesados, contexto, filtrosRegistrados);
console.log('5.Resultado entrada renderizada:',entradaRenderizada) */


/**
 * 🧪 Tarea opcional: Soporte para filtros con parámetros
 *
 * Hasta ahora, tus filtros no aceptan parámetros. Pero en Liquid real, muchos filtros permiten pasar argumentos.
 *
 * Ejemplo:
 *   - `{{ nombre | replace: "a", "*" }}` → reemplaza todas las "a" por "*"
 *   - `{{ precio | times: 1.16 }}` → multiplica el valor por 1.16 (por ejemplo, para IVA)
 *
 * ✅ Sintaxis esperada:
 * - Los argumentos del filtro se separan por comas: `filtro: arg1, arg2`
 * - Los filtros siguen separados por `|`
 *
 * ✅ Ejemplo de token:
 * ```ts
 * { tipo: "variable", contenido: "nombre | replace: 'a', '*' | upcase" }
 * ```
 *
 * ✅ Resultado esperado si nombre = "carlos":
 * ```ts
 * "CRLOS"
 * ```
 *
 * ✅ Filtro de ejemplo que puedes registrar:
 * ```ts
 * {
 *   replace: (input: string, from: string, to: string) => input.split(from).join(to),
 *   upcase: (input: string) => input.toUpperCase()
 * }
 * ```
 *
 * ✅ Sugerencia de implementación:
 * - En `renderizarVariables()`, al detectar `|`, divide cada segmento
 * - Si el filtro contiene `:`, separa el nombre y los argumentos
 * - Divide los argumentos por `,`, elimina comillas, y pásalos al filtro como parámetros
 *
 * ✅ Ejemplo de parsing:
 * ```ts
 * // De "replace: 'a', '*'" → ['replace', "'a'", "'*'"]
 * ```
 *
 * Puedes escribir una función auxiliar:
 * ```ts
 * function parseFiltro(crudo: string): [nombre: string, argumentos: string[]]
 * ```
 *
 * Esto no se usará en módulos futuros,
 * pero te ayudará a familiarizarte con cómo Shopify y Liquid manejan funciones con argumentos.
 */

//Cosa de prueba, funciona perfectamente, usar cualquiera de los dos códigos.

type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

//Aqui colocar los datos que necesito para que las funciones encadenadas trabajen adecuadamente:
let entradaInicial = "{{ nombre | replace: 'a', '*' | upcase }} cuesta {{ precio | times: 1.16 }} con IVA.";
let contexto = {
  nombre: "carlos",
  precio: 100
};


let filtrosRegistrados = {
    replace: (input: string, from: string, to: string) => input.split(from).join(to),
    upcase: (input: string) => input.toUpperCase(),
    times: (input: number, factor: number) => input * parseFloat(factor)
};


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

let entradaProcesada = procesarCondicionales(entradaClasificada,contexto);
console.log('3.Resultado de procesar condicionales:',entradaProcesada);

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
console.log('4.Resultado de procesar bucles',buclesProcesados)

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

            let valor = contexto[nombreVariable] ?? nombreVariable;

            for (let filtroCrudo of partes) {
                let [nombreFiltro, args] = parseFiltro(filtroCrudo);

                if (!filtrosRegistrados[nombreFiltro]) {
                    throw new Error(`Error: El filtro '${nombreFiltro}' no está definido.`);
                }

                valor = filtrosRegistrados[nombreFiltro](valor, ...args);
            }

            return valor + "\n"; // Agregar salto de línea
        }

        if (token.tipo === "texto" && tokens[index + 1]?.tipo === "variable") {
            return token.contenido + " ";
        }

        return token.contenido + "\n";
    }).join('');
}

let entradaRenderizada = renderizarVariables(buclesProcesados, contexto, filtrosRegistrados);
console.log('5.Resultado entrada renderizada:',entradaRenderizada)
