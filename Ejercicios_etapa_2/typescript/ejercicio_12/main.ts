/**
 * MÓDULO 12: ASIGNACIÓN DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En Liquid (y otros motores de plantillas), se pueden definir nuevas variables directamente desde la plantilla usando `assign`.
 * Esto permite guardar temporalmente un valor para usarlo más adelante.
 *
 * Ejemplo:
 * ```liquid
 * {% assign saludo = "Hola" %}
 * {{ saludo }}
 * ```
 *
 * Esto genera una variable llamada `saludo` con el valor `"Hola"`, que puede mostrarse luego con `{{ saludo }}`.
 * Esta funcionalidad te permite preparar valores intermedios, igual que en programación real.
 *
 * ✅ Tokens de entrada:
 * ```ts
 * [
 *   { tipo: "directiva", contenido: "assign saludo = \"Hola\"" },
 *   { tipo: "variable", contenido: "saludo" }
 * ]
 * ```
 *
 * ✅ Resultado esperado:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Hola" }
 * ]
 * ```
 *
 * Objetivo:
 * Detectar y ejecutar asignaciones del tipo `{% assign nombre = valor %}` y actualizar el `contexto` con la nueva variable.
 *
 * Instrucciones:
 * 1. Crea una función `procesarAsignaciones(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada token `tipo: "directiva"` que comience con `"assign "`:
 *    - Extrae el nombre y el valor con un `.split("=")`
 *    - Si el valor está entre comillas (`"Hola"`), guárdalo como texto literal
 *    - Si **no** tiene comillas (`Hola`), intenta buscar el valor en el `contexto` original
 *    - Guarda esa nueva variable en el `contexto`
 *    - El token `assign` no debe producir ningún contenido visible
 *
 * Detalles:
 * - Los valores pueden ser:
 *   - Texto literal entre comillas: `"Hola"`
 *   - Un número: `42`
 *   - Otro nombre de variable: `otroNombre`
 * - Si detectas comillas (`"` o `'`), quítalas al guardar el valor
 * - Si no hay comillas, interpreta el contenido como el nombre de otra variable ya existente en el contexto
 * - Si no existe en el contexto, puedes dejar el valor como `undefined` o lanzar una advertencia
 *
 * Consejo:
 * - Usa `.trim()` después del `split("=")` para evitar errores con espacios
 * - Haz este paso **antes** de renderizar variables o evaluar condicionales
 * - Las asignaciones no deben dejar rastros visibles en el resultado renderizado
 */
