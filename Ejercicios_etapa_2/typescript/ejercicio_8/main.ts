/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En motores como Liquid, las directivas controlan el flujo de una plantilla.
 * Una de las directivas más comunes es `{% if %}`, que permite mostrar contenido **solo si se cumple una condición**.
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
 * Hola {% if admin %}Administrador{% endif %}!
 * ```
 *
 * ✅ Ejemplo de tokens clasificados:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Administrador" },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (cuando `contexto.admin === true`):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "texto", contenido: "Administrador" },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (cuando `contexto.admin === false`):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola " },
 *   { tipo: "texto", contenido: "!" }
 * ]
 * ```
 *
 * Objetivo:
 * Eliminar o conservar bloques `{% if %} ... {% endif %}` dependiendo de si la variable evaluada es verdadera.
 *
 * Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Busca los pares `{% if variable %}` y `{% endif %}`
 * 3. Evalúa el valor de la variable en `contexto`
 *    - Si es `true`, deja los tokens del bloque interno
 *    - Si es `false`, elimina esos tokens
 * 4. Solo implementa un nivel de condición (no anidado)
 *
 * Consejo:
 * - Recorre el arreglo con un bucle `for`, y cuando encuentres un `if`, busca su cierre con otro bucle
 * - Extrae el nombre de la variable con `.split(' ')` sobre `contenido`
 * - Usa `.slice()` para recortar los tokens que quieras conservar
 */


const LIQUID_HTML = `Hola, {{ nombre }}. Bienvenido a {{ ciudad }}.`
const regex = /({{.*?}}|{%.*?%})/g
enum delimiters {
    VARIABLE_START = '{{',
    VARIABLE_END = '}}',
    DIRECTIVE_START = '{%',
    DIRECTIVE_END = '%}'
}

enum contexto {
    nombre = 'Carlos',
    ciudad = 'Madrid'
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

const renderizarVariables = (tokens: TokenPlantilla[], contexto: Record<string, string>): string => {
    const resultado = tokens.map((token) => {
        if (token.tipo == 'variable') {
            const contextoVariable = contexto[token.contenido]
            if (contextoVariable) {
                return contextoVariable
            }
            return ''
        } else {
            return token.contenido
        }
    })
    return resultado.join('')
}

const tokens = detectarTokensPlantilla(LIQUID_HTML)
const tokensClasificados = clasificarTokensPlantilla(tokens)
const tokensRenderizados = renderizarVariables(tokensClasificados, contexto)
console.log(tokensRenderizados)
