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


const LIQUID_HTML = `hola {{ nombre }}. {% if admin %}Eres administrador.{% endif %}`
const regex = /({{.*?}}|{%.*?%})/g
enum delimiters {
    VARIABLE_START = '{{',
    VARIABLE_END = '}}',
    DIRECTIVE_START = '{%',
    DIRECTIVE_END = '%}'
}

interface Contexto {
    [key: string]: string | boolean | number
}

const contexto: Contexto = {
    nombre: 'Carlos',
    admin: true
}

interface TokenPlantilla {
    tipo: 'texto' | 'variable' | 'directiva';
    contenido: string;
}

const extrearTextoDeVariable = (token: string): string => {
    const variable = token.slice(delimiters.VARIABLE_START.length, -delimiters.VARIABLE_END.length)
    return variable.trim()
}

const detectarTokensPlantilla = (entrenda: string): string[] => {
    const tokens = entrenda.split(regex)
    return tokens
}

const clasificarTokensPlantilla = (tokens: string[]): TokenPlantilla[] => {
    const result = tokens.map((token) => {
        if (token.startsWith(delimiters.VARIABLE_START) && token.endsWith(delimiters.VARIABLE_END)) {
            const contenido = extrearTextoDeVariable(token)
            return {
                tipo: 'variable',
                contenido
            }
        } else if (token.startsWith(delimiters.DIRECTIVE_START) && token.endsWith(delimiters.DIRECTIVE_END)) {
            const contenido = token.slice(delimiters.DIRECTIVE_START.length, -delimiters.DIRECTIVE_END.length)
            return {
                tipo: 'directiva',
                contenido
            }
        }
        return {
            tipo: 'texto',
            contenido: token
        }
    }) as TokenPlantilla[]
    return result
}

const renderizarVariables = (tokens: TokenPlantilla[], contexto: Contexto): string => {
    const resultado = tokens.map((token) => {
        if (token.tipo == 'variable') {
            const contextoVariable = contexto[token.contenido]
            if (contextoVariable) {
                return contextoVariable
            }
            return ''
        } else if (token.tipo == 'directiva') {
            console.log('Directiva:', token.contenido)
            if(token.contenido.startsWith('if')) {
                
            }
        }
        else {
            return token.contenido
        }
    })
    return resultado.join('')
}

const tokens = detectarTokensPlantilla(LIQUID_HTML)
const tokensClasificados = clasificarTokensPlantilla(tokens)
const tokensRenderizados = renderizarVariables(tokensClasificados, contexto)
console.log(tokensRenderizados)
