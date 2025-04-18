/**
 * MÓDULO 8: LÓGICA CONDICIONAL EN PLANTILLAS
 *
 * Objetivo: Implementar condiciones usando `{% if variable %}` y `{% endif %}`
 *
 * Instrucciones:
 * 1. Crea una función `procesarCondicionales(tokens: string[], contexto: Record<string, any>): string[]`
 * 2. Evalúa la condición `if` usando `contexto['variable']` como valor booleano.
 * 3. Si la condición es falsa, elimina los tokens entre `{% if %}` y `{% endif %}`
 * 4. Solo implementa un nivel de condición (no anidado)
 *
 * Entrada de ejemplo:
 * tokens:
 * [
 *   "Hola ",
 *   "{% if admin %}",
 *   "Administrador ",
 *   "{% endif %}",
 *   "!"
 * ]
 * contexto:
 * {
 *   admin: true
 * }
 *
 * Salida esperada:
 * [
 *   "Hola ",
 *   "Administrador ",
 *   "!"
 * ]
 *
 * Consejo:
 * - Usa un bucle `for` e índice para detectar los bloques `{% if %}` y su respectivo `{% endif %}`
 * - Puedes construir un nuevo arreglo resultante
 */
