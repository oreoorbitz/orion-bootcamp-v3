/**
 * MÓDULO 6: REEMPLAZO DE VARIABLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * En los motores de plantillas como Liquid, `{{ nombre }}` se reemplaza por el valor real de una variable del contexto.
 * Esto permite generar contenido dinámico desde datos, como hacer que el título de una página cambie según el usuario.
 *
 * En este módulo, empezarás a conectar *datos reales* con *plantillas de texto*.
 *
 * Objetivo:
 * Reemplazar todos los bloques `{{ variable }}` por sus valores del objeto `contexto`.
 *
 * Instrucciones:
 * 1. Crea una función `renderizarVariables(tokens: string[], contexto: Record<string, any>): string`
 * 2. Para cada token:
 *    - Si es una variable `{{ ... }}`, busca el valor correspondiente en el `contexto`
 *    - Si no existe, puedes dejarlo vacío (`""`) o usar un valor por defecto
 *    - El resto del texto debe conservarse sin cambios
 *
 * Entrada:
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
 * Resultado esperado:
 * "Hola, Carlos. Bienvenido a Madrid."
 *
 * Consejo:
 * - Recorta los espacios dentro de los `{{ ... }}` antes de buscar la clave
 */
