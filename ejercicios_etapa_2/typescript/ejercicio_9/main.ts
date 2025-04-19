/**
 * MÓDULO 9: CONSTRUCCIÓN DE BUCLES EN PLANTILLAS
 *
 * Objetivo: Implementar `{% for item in lista %}` con `{{ item }}`
 *
 * Instrucciones:
 * 1. Crea una función `procesarBucles(tokens: string[], contexto: Record<string, any>): string[]`
 * 2. Detecta `{% for item in lista %}` y `{% endfor %}`
 * 3. Para cada elemento de `contexto['lista']`, duplica los tokens del bloque y reemplaza `{{ item }}` con el valor actual
 *
 * Entrada de ejemplo:
 * tokens:
 * [
 *   "Lista: ",
 *   "{% for item in frutas %}",
 *   "{{ item }} ",
 *   "{% endfor %}"
 * ]
 * contexto:
 * {
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 *
 * Salida esperada:
 * [
 *   "Lista: ",
 *   "manzana ",
 *   "plátano ",
 *   "uva "
 * ]
 *
 * Consejo:
 * - Requiere detectar el rango entre `{% for ... %}` y `{% endfor %}`
 * - Puedes usar `.replace()` o una subfunción `renderizarVariables()` para el interior del bloque
 */
