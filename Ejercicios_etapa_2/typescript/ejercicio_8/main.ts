/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Hasta ahora, hemos reconocido bloques de tipo "directiva" pero no les hemos dado significado.
 * En sistemas como Liquid, las directivas controlan el flujo de renderizado.
 * Por ejemplo:
 * - `{% if admin %}` muestra contenido solo si `admin` es verdadero.
 * - Más adelante, usaremos `{% for %}` para bucles.
 *
 * En este módulo, aprenderás a procesar la directiva `if`, evaluando si un bloque debe mostrarse o no.
 *
 * En los módulos anteriores:
 * - `detectarTokensPlantilla()` separó la plantilla en partes
 * - `clasificarTokensPlantilla()` etiquetó los bloques como texto, variables o directivas
 * - `renderizarVariables()` tomó un arreglo de tokens y los transformó en texto final,
 *   reemplazando `{{ variable }}` por valores reales del contexto
 *
 * Pero hay un detalle: `renderizarVariables()` probablemente recorre **todo** el arreglo de tokens.
 * Ahora vamos a introducir una etapa intermedia, donde se filtran los tokens antes de renderizar.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Hola, {{ nombre }}.
 * {% if admin %}
 * Bienvenido, administrador.
 * {% endif %}
 * ```
 *
 * ✅ Ejemplo de `contexto`:
 * ```ts
 * const contexto = {
 *   nombre: "Carlos",
 *   admin: true
 * }
 * ```
 *
 * ✅ Tokens clasificados (resultado previo a este módulo):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." },
 *   { tipo: "directiva", contenido: "endif" }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `true`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." },
 *   { tipo: "texto", contenido: "Bienvenido, administrador." }
 * ]
 * ```
 *
 * ✅ Resultado esperado si `admin` es `false`:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: "." }
 * ]
 * ```
 *
 * 🎯 Objetivo:
 * Implementar una función que interprete y aplique condiciones tipo `if` y filtre los tokens en base al contexto.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función llamada `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Recorre el arreglo y detecta los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa la variable en el `contexto`
 *    - Si es `true`, conserva el bloque de tokens interno
 *    - Si es `false`, elimínalo
 * 4. Devuelve un nuevo arreglo de tokens sin los bloques no permitidos
 * 5. No permitas condiciones anidadas por ahora

 * 💡 Consejo:
 * - Usa un bucle `for` normal y cuando encuentres una directiva `if`, guarda el índice de inicio.
 * - Busca su `endif` correspondiente con otro bucle o `findIndex`.
 * - Extrae la variable con `.split(' ')` sobre el contenido del token
 * - Puedes usar `.slice()` para cortar el arreglo
 *
 * 👇 Flujo sugerido para usar esta función:
 *
 * ```ts
 * const tokensFiltrados = procesarCondicionales(tokensClasificados, contexto);
 * const resultado = renderizarVariables(tokensFiltrados, contexto);
 * console.log(resultado);
 * ```
 *
 * Esto mantiene `renderizarVariables()` enfocada solamente en reemplazar variables.
 * Si tu implementación actual ya hace el recorrido del arreglo, puedes mantenerla así, pero asegúrate de aplicar `procesarCondicionales()` **antes** de llamar a `renderizarVariables()`.
 *
 * Esta estructura modular será útil cuando agreguemos más directivas como `for`, `else`, etc.
*/

//Este código funciona perfectamente, lo bloqueo en comentarios para poder hacer la implementación debajo

/* type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva'

interface TokenPlantilla {
 tipo: TipoTokenPlantilla;
 contenido: string;
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
let entradaInicial = "Hola, {{ nombre }}.{% if admin %} Bienvenido, administrador.{% endif %}";
let entradaTokenizada = (detectarTokensPlantilla(entradaInicial));



function clasificarTokensPlantilla(tokens: string[]): TokenPlantilla[] {
  return tokens.map(token => {
    if (token.startsWith("{{") && token.endsWith("}}")) {
      return { tipo: "variable", contenido: token.slice(2, -2).trim() };
    }
    if (token.startsWith("{%") && token.endsWith("%}")) {
      return { tipo: "directiva", contenido: token.slice(2, -2).trim() };
    }

    return { tipo: "texto", contenido: token.trim() };
  });
}

// esta es la equivalente a tokens, imprimir si es necesario saber que es cada cosa
let entradaClasificada = clasificarTokensPlantilla(entradaTokenizada);

//Según las instrucciones procesar condicionales es una etapa intermedia y debe realizarse antes de renderizar las variables
function procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[] {
    let resultado: TokenPlantilla[] = [];
    let i = 0;

    while (i < tokens.length) {
        let token = tokens[i];

        if (token.tipo === 'directiva' && token.contenido.startsWith('if')) {
            let partes = token.contenido.split(/\s+/);
            let nombreVariable = partes[1] || "";

            // Buscar índice de cierre {% endif %}
            let j = i + 1;
            while (j < tokens.length) {
                if (tokens[j].tipo === 'directiva' && tokens[j].contenido === 'endif') {
                    break;
                }
                j += 1;
            }

            // Validar que {% endif %} existe
            if (j >= tokens.length) {
                throw new Error("Error de sintaxis: {% if %} sin {% endif %}");
            }

            let condicion = contexto[nombreVariable] ?? false;

            // Si la condición es verdadera, agregamos solo el contenido dentro del if
            if (condicion) {
                for (let k = i + 1; k < j; k++) {
                    resultado.push({ ...tokens[k] });
                }
            }

            // Saltamos directamente al token después de {% endif %}
            i = j;
        } else if (token.tipo !== 'directiva') {
            // Solo agregamos texto y variables, eliminamos directivas sueltas
            resultado.push(token);
        }

        i += 1;
    }

    return resultado;
}

let contexto = {
 nombre: "Carlos",
 admin: true
};

let entradaProcesada = procesarCondicionales(entradaClasificada,contexto);


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

let entradaRenderizada = renderizarVariables(entradaProcesada, contexto);
console.log(entradaRenderizada); */






/*
 *
 * 📦 Opcional: clasificar tipos de directiva con tipos auxiliares
 *
 * Si deseas organizar mejor el tratamiento de directivas, puedes usar una propiedad adicional para especificar el subtipo:
 *
 * ```ts
 * type TipoDirectiva = 'if' | 'endif' | 'for' | 'endfor'

 * interface TokenPlantilla {
 *   tipo: 'texto' | 'variable' | 'directiva';
 *   contenido: string;
 *   directiva?: TipoDirectiva;
 * }
 * ```
 *
 * O puedes crear una función que detecte el subtipo a partir del contenido:
 *
 * ```ts
 * function clasificarDirectiva(token: TokenPlantilla): TipoDirectiva | null {
 *   if (token.tipo !== 'directiva') return null;
 *   if (token.contenido.startsWith('if')) return 'if';
 *   if (token.contenido === 'endif') return 'endif';
 *   return null;
 * }
 * ```
 *
 * Esto puede ayudarte a:
 * - Evitar errores al interpretar directivas
 * - Preparar tu código para otras directivas como `for`, `endfor`, `else`, etc.
 * - Hacer tu flujo de control más legible y escalable
 *
 * No es obligatorio, pero si tu código empieza a crecer, puede ayudarte a mantenerlo ordenado.
 */

/**
 * 🔁 Tarea opcional (no requerida para los próximos módulos):
 *
 * Si quieres acercarte más a la sintaxis real de Liquid, puedes implementar operadores lógicos simples:
 *
 * - Comparaciones con `==`
 *   Ejemplo: `{% if producto == 'camisa' %}`
 *
 * - Palabras clave `and` / `or`
 *   Ejemplo: `{% if admin and activo %}`
 *
 * ✅ Esto implicaría:
 * - Analizar más de un fragmento en `contenido` del token tipo `if`
 * - Evaluar la condición como una mini expresión lógica
 *
 * No necesitas un parser complejo, puedes empezar con divisiones y verificaciones simples:
 * ```ts
 * if (cond.includes('==')) {
 *   const [clave, valor] = cond.split('==').map(x => x.trim())
 *   return contexto[clave] === valor.replace(/['"]/g, '')
 * }
 * ```
 *
 * Este comportamiento no será usado en los próximos módulos,
 * pero si decides implementarlo, obtendrás más práctica con la lógica real de Shopify.
 */

/**
 * 🧩 Tarea opcional adicional: Soporte para `{% else %}` y `{% elsif %}`
 *
 * En Liquid real puedes escribir:
 * ```liquid
 * {% if admin %}
 *   Bienvenido, administrador
 * {% elsif invitado %}
 *   Bienvenido, invitado
 * {% else %}
 *   Acceso denegado
 * {% endif %}
 * ```
 *
 * Para esto deberías:
 * 1. Detectar bloques `{% if %}`, `{% elsif %}`, `{% else %}`, `{% endif %}`
 * 2. Agruparlos en una estructura lógica
 * 3. Evaluar las condiciones en orden y retornar solo la rama activa
 *
 * Puedes hacer esto con un bucle que, una vez que encuentra un `if`,
 * recopila todos los tokens hasta el `endif`, separando las ramas por sus directivas.
 *
 * Sugerencia de estructura interna para analizar:
 * ```ts
 * {
 *   tipo: 'condicional',
 *   ramas: [
 *     { tipo: 'if', condicion: 'admin', tokens: [...] },
 *     { tipo: 'elsif', condicion: 'invitado', tokens: [...] },
 *     { tipo: 'else', tokens: [...] }
 *   ]
 * }
 * ```
 *
 * Esta implementación no es trivial, pero se alinea con cómo funciona realmente Liquid en Shopify.
 * Si decides implementarlo, tendrás una base mucho más robusta para renderizado dinámico.
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
let entradaInicial = "Hola, {{ nombre }}.{% if admin %} Bienvenido, administrador.{% endif %}";
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

//Según las instrucciones procesar condicionales es una etapa intermedia y debe realizarse antes de renderizar las variables
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
                if (!siguienteToken.directiva) {
                    bloqueActual.push({ ...siguienteToken });
                }

                j++;
            }

            if (mostrarBloque || procesandoElse) {
                resultado.push(...bloqueActual);
            }

            i = j;
        } else if (token.tipo !== 'directiva') {
            resultado.push(token);
        }

        i++;
    }

    return resultado;
}

let contexto = {
 nombre: "Carlos",
 admin: true
};

let entradaProcesada = procesarCondicionales(entradaClasificada,contexto);
console.log(entradaProcesada) // Este es el resultado esperado, un paso antes de renderizar; pero se agrega la función con fines de probar que sirve

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

let entradaRenderizada = renderizarVariables(entradaProcesada, contexto);
console.log(entradaRenderizada);
