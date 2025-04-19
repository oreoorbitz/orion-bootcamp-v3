/**
 * MÓDULO 7: REEMPLAZO DE VARIABLES EN PLANTILLAS
 *
 * Objetivo: Reemplazar `{{ variable }}` en una plantilla con el valor de un objeto de datos.
 *
 * Instrucciones:
 * 1. Crea una función `renderizarVariables(tokens: string[], contexto: Record<string, any>): string`
 * 2. Por cada token `{{ variable }}`, reemplázalo con `contexto['variable']`
 * 3. Si la variable no existe en el objeto, puedes dejarla vacía o usar un valor por defecto
 *
 * Entrada de ejemplo:
 * tokens:
 * [
 *   "Hola, ",
 *   "{{ nombre }}",
 *   ". Bienvenido a {{ ciudad }}."
 * ]
 *
 * contexto:
 * {
 *   nombre: "Carlos",
 *   ciudad: "Madrid"
 * }
 *
 * Salida esperada:
 * "Hola, Carlos. Bienvenido a Madrid."
 *
 * Consejo:
 * - Recorta los espacios en `{{ nombre }}` usando `.trim()`
 * - Usa expresiones regulares para extraer el nombre de la variable dentro de `{{ ... }}`
 */
