/**
 * MÓDULO 6: CLASIFICACIÓN DE TOKENS DE PLANTILLA
 *
 * 🧠 Concepto clave:
 * Ya separaste la plantilla en partes individuales (texto, variables y directivas), pero todas son solo cadenas.
 * Antes de poder renderizar variables o interpretar directivas, necesitas saber **qué es cada una**.
 *
 * Este módulo es el equivalente al que hiciste en HTML cuando clasificaste etiquetas como apertura, cierre o texto.
 * Aquí harás algo similar: clasificar cada string como tipo `texto`, `variable`, o `directiva`.
 *
 * Objetivo:
 * Convertir un arreglo de strings en un arreglo de objetos con tipo explícito.
 *
 * Instrucciones:
 * 1. Crea una función llamada `clasificarTokensPlantilla(tokens: string[]): TokenPlantilla[]`
 * 2. Devuelve un arreglo donde cada string se convierte en un objeto con esta estructura:
 *
 * ```ts
 * type TipoTokenPlantilla = 'texto' | 'variable' | 'directiva'
 *
 * interface TokenPlantilla {
 *   tipo: TipoTokenPlantilla;
 *   contenido: string;
 * }
 * ```
 *
 * 3. Clasifica según las reglas:
 *   - Si comienza con `{{` y termina con `}}`, es tipo `'variable'`
 *   - Si comienza con `{%` y termina con `%}`, es tipo `'directiva'`
 *   - Si no es ninguno de los dos, es tipo `'texto'`
 *
 * Entrada:
 * [
 *   "Hola, ",
 *   "{{ nombre }}",
 *   ". ",
 *   "{% if admin %}",
 *   "Eres administrador.",
 *   "{% endif %}"
 * ]
 *
 * Resultado esperado:
 * [
 *   { tipo: "texto", contenido: "Hola, " },
 *   { tipo: "variable", contenido: "nombre" },
 *   { tipo: "texto", contenido: ". " },
 *   { tipo: "directiva", contenido: "if admin" },
 *   { tipo: "texto", contenido: "Eres administrador." },
 *   { tipo: "directiva", contenido: "endif" }
 * ]
 *
 * Consejo:
 * - Usa `.startsWith()` y `.endsWith()` para clasificar cada string
 * - Recorta los delimitadores (`{{ }}`, `{% %}`) usando `.slice()` o `.replace()` para extraer solo el contenido
 */

const LIQUID_HTML = `"Hola, {{ nombre }}. {% if admin %}Eres administrador.{% endif %}"`
const regex = /({{.*?}}|{%.*?%})/g
const DIRECTIVE_START = '{%'
const DIRECTIVE_END = '%}'
const VARIABLE_START = '{{'
const VARIABLE_END = '}}'

interface TokenPlantilla {
    tipo: 'texto' | 'variable' | 'directiva';
    contenido: string;
}

const extrearTextoDeVariable = (token: string): string => {
    const variable = token.slice(VARIABLE_START.length, -VARIABLE_END.length)
    return variable
}

const detectarTokensPlantilla = (entrenda: string): string[] => {
    const tokens = entrenda.split(regex)
    return tokens
}

const clasificarTokensPlantilla = (tokens: string[]): TokenPlantilla[] => {
    const result = tokens.map((token) => {
        if(token.startsWith(VARIABLE_START) && token.endsWith(VARIABLE_END)) {
           const contenido = extrearTextoDeVariable(token)
            return {
                tipo: 'variable',
                contenido
            }
        } else if(token.startsWith(DIRECTIVE_START) && token.endsWith(DIRECTIVE_END)) {
            const contenido = token.slice(DIRECTIVE_START.length, -DIRECTIVE_END.length)
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

const tokens = detectarTokensPlantilla(LIQUID_HTML)
const tokensClasificados = clasificarTokensPlantilla(tokens)
console.log(tokensClasificados)