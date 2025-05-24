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
 * {% assign mensaje = \"Fruta disponible:\" %}
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ mensaje | upcase }} {{ fruta | upcase | reverse }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ⚠️ Nota importante sobre las comillas:
 * En nuestros ejercicios, los strings de entrada son escritos dentro de código JavaScript
 * y usamos comillas dobles (`"`) como delimitador externo.
 * Por eso, si el contenido del string también contiene comillas dobles,
 * **debes escaparlas con una barra invertida (`\"`)** para evitar errores de sintaxis.
 *
 * Ejemplo:
 * ```ts
 * const entrada = "{% assign mensaje = \\\"Fruta disponible:\\\" %}";
 * ```
 * Esto es lo que permite que el parser lea el contenido correctamente como parte de la plantilla Liquid.
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
