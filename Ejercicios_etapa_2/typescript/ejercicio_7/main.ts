/**
 * MÓDULO 7: REEMPLAZO DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En los motores de plantillas como Liquid, `{{ nombre }}` se reemplaza por el valor real de una variable del contexto.
 * Esto permite generar contenido dinámico desde datos, como hacer que el título de una página cambie según el usuario.
 *
 * En el módulo anterior, ya clasificaste cada fragmento de una plantilla como:
 * - texto plano
 * - variable (`{{ ... }}`)
 * - o directiva (`{% ... %}`)
 *
 * Ahora, vas a enfocarte **solamente en las variables**.
 *
 * Objetivo:
 * Reemplazar todos los tokens de tipo `variable` por los valores correspondientes en un objeto de contexto.
 *
 * ✅ Ejemplo de plantilla original:
 * ```html
 * Hola, {{ nombre }}. Bienvenido a {{ ciudad }}.
 * ```
 *
 * Puedes reutilizar tu código del módulo 5 y 6 para:
 * 1. Tokenizar esta cadena (`detectarTokensPlantilla`)
 * 2. Clasificar los tokens (`clasificarTokensPlantilla`)
 *
 * Entrada:
 * tokens:
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: ". Bienvenido a " },
 *   { tipo: "variable", contenido: "ciudad" },
 *   { tipo: "texto", contenido: "." }
 * ]
 *
 * contexto:
 * {
 *   nombre: "Carlos",
 *   ciudad: "Madrid"
 * }
 *
 * Resultado esperado:
 * "Hola, Carlos. Bienvenido a Madrid."
 *
 * Instrucciones:
 * 1. Crea una función `renderizarVariables(tokens: TokenPlantilla[], contexto: Record<string, any>): string`
 * 2. Para cada token:
 *    - Si el `tipo` es `"variable"`, busca la clave en `contexto`
 *    - Si no existe, puedes devolver una cadena vacía (`""`) o un valor por defecto
 *    - Si es tipo `"texto"` o `"directiva"`, conserva el texto tal como está
 *
 * Consejo:
 * - Usa `.map()` para transformar los tokens en strings
 * - Recuerda que en esta etapa aún **no debes interpretar las directivas** (`{% %}`)
 * - Concatenar los resultados con `.join('')` al final puede ayudarte a construir la cadena completa
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
