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
 * - Recorta los delimitadores (`{{ }}`, `{% %}`) usando `.slice()` o `.replace()` para extraer solo el contenido.
 * - Utiliza la función del ejercicio anterior para generar la entrada esperada de esta nueva función.
 */
