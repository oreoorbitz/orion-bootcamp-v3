/**
 * MÓDULO 9: CONSTRUCCIÓN DE BUCLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Los motores de plantillas como Liquid permiten generar contenido dinámico a partir de arreglos usando bucles `{% for item in lista %}`.
 * Esto es esencial para mostrar listas como productos, entradas de blog, comentarios, etc.
 *
 * En los módulos anteriores:
 * - Aprendiste a detectar y clasificar tokens (`texto`, `variable`, `directiva`)
 * - Procesaste condicionales `{% if %}` en base al contexto
 * - Reemplazaste variables simples con `{{ nombre }}`
 *
 * Ahora vas a interpretar una nueva directiva: los bucles con `{% for item in lista %}`.
 * Además, dentro del cuerpo del bucle puede haber condicionales — lo cual pondrá a prueba si tu motor procesa los bloques en orden correcto.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Lista:
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ fruta }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
 *   { tipo: "variable", contenido: "fruta" },
 *   { tipo: "texto", contenido: " " },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas: ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "texto", contenido: "manzana " },
 *   { tipo: "texto", contenido: "plátano " },
 *   { tipo: "texto", contenido: "uva" }
 * ]
 * ```
 *
 * Objetivo:
 * Detectar bloques `{% for %}` → `{% endfor %}` y repetir su contenido por cada elemento en el arreglo indicado.
 * Los bloques internos pueden tener condicionales que debes procesar primero.
 *
 * Instrucciones:
 * 1. Crea una función `procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada directiva `{% for item in lista %}`:
 *    - Identifica el bloque hasta el `{% endfor %}`
 *    - Extrae el nombre del item y de la lista (`for fruta in frutas`)
 *    - Por cada valor, renderiza una copia del bloque interno Reemplaza `{{ item }}` con el valor actual
 * 3. El resultado debe ser un nuevo arreglo con los bloques repetidos y procesados
 *
 * Consejo:
 * - Haz un bucle externo para recorrer los tokens y detectar el inicio y fin del `for`
 * - Asegúrate de mantener el orden de ejecución: primero condicionales, luego variables
 */

// Clasificar tipos de directiva
type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor' | 'else' | 'elsif';

interface TokenPlantilla {
  tipo: 'texto' | 'variable' | 'directiva';
  contenido: string;
  directiva?: TipoDirectiva; // Nueva propiedad (opcional -> ?)
}

enum TipoDirectiva {
  If = 'if',
  Endif = 'endif',
  For = 'for',
  EndFor = 'endfor'
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

//Prueba con la entrada
let entradaInicial = "Lista:{% for fruta in frutas %}{% if fruta %}{{ fruta }}{% endif %}{% endfor %}";
let entradaTokenizada = (detectarTokensPlantilla(entradaInicial));


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
console.log('Resultado de clasificar:',entradaClasificada)


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

let contexto = {
 frutas: ["manzana", "plátano", "uva"]
};

let entradaProcesada = procesarCondicionales(entradaClasificada,contexto);
console.log('Resultado de procesar condicionales:',entradaProcesada);

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

                let tokensFinales = bloqueProcesado.map(token =>
                    token.tipo === "variable" && token.contenido === nombreItem
                        ? { tipo: "texto", contenido: valor + " " } // Añadimos el espacio correctamente
                        : token
                );

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
console.log('resultado de procesar bucles',buclesProcesados)

function renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string {
    return tokens.map((token, index) => {
        if (token.tipo === 'variable') {
            return contexto[token.contenido] ?? '';
        }

        // Si el token actual es texto y el siguiente es una variable, añadimos espacio al final
        if (token.tipo === "texto" && tokens[index + 1]?.tipo === "variable") {
            return token.contenido + " ";
        }

        return token.contenido;
    }).join('');
}

let entradaRenderizada = renderizarVariables(buclesProcesados, contexto);
console.log('resultado entrada renderizada:',entradaRenderizada)
