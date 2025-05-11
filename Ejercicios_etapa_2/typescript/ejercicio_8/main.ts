/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Hasta el momento, hemos clasificado directivas, pero no las hemos implementado.
 * En nuestro contexto, una **directiva** es una instrucción que indica cómo debe procesarse el contenido de la plantilla.
 * En Liquid, las directivas son bloques de código que permiten controlar el flujo de la plantilla.
 * Por ejemplo, puedes usar una directiva `for` para iterar sobre una lista de elementos, o una directiva `if` para mostrar contenido condicionalmente.
 * En este módulo, aprenderás a interpretar una directiva `if`.
 *
 * En los módulos anteriores:
 * - Separaste la plantilla en tokens (`detectarTokensPlantilla`)
 * - Clasificaste cada uno como texto, variable o directiva (`clasificarTokensPlantilla`)
 * - Y reemplazaste variables por valores reales (`renderizarVariables`)
 *
 * Ahora vas a interpretar el significado de una **directiva**, en este caso: `{% if ... %}`.
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
 * ✅ Ejemplo de tokens clasificados (antes de este módulo):
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
 * Eliminar o conservar bloques `{% if %} ... {% endif %}` dependiendo de si la variable evaluada es verdadera.
 *
 * 🛠️ Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Busca los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa el valor de la variable en `contexto`
 *    - Si es `true`, conserva los tokens del bloque interno
 *    - Si es `false`, elimínalos
 * 4. Solo implementa un nivel de condición (no anidado)
 *
 * 💡 Consejo:
 * - Recorre el arreglo con un bucle `for`, y cuando encuentres un `if`, busca su cierre con otro bucle
 * - Extrae el nombre de la variable con `.split(' ')` sobre `contenido`
 * - Usa `.slice()` para conservar los tokens del interior si la condición se cumple
 * - Deja pasar los demás tokens sin cambios
 *
 * Esto es una simulación básica del sistema de condiciones de Liquid. Más adelante podrás anidar condiciones o usar `else`.
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
