/**
 * MÓDULO 6: DETECCIÓN DE PLACEHOLDERS EN PLANTILLAS
 *
 * Objetivo: Detectar y extraer variables y directivas dentro de una cadena de plantilla.
 *
 * Las plantillas pueden contener:
 * - `{{ variable }}`
 * - `{% directiva %}`
 *
 * Instrucciones:
 * 1. Crea una función llamada `detectarTokensPlantilla(entrada: string): string[]`
 * 2. Esta función debe identificar y extraer los bloques `{{ ... }}` y `{% ... %}`
 *    como elementos separados dentro de un arreglo, incluyendo el texto normal.
 * 3. Puedes usar una expresión regular como:
 *    `/({{.*?}}|{%.*?%})/g`
 *
 * Entrada de ejemplo:
 * "Hola, {{ nombre }}. {% if admin %}Eres administrador.{% endif %}"
 *
 * Salida esperada:
 * [
 *   "Hola, ",
 *   "{{ nombre }}",
 *   ". ",
 *   "{% if admin %}",
 *   "Eres administrador.",
 *   "{% endif %}"
 * ]
 *
 * Consejo:
 * - La salida es un arreglo plano de texto y tokens de plantilla.
 * - No te preocupes aún por interpretar los tokens. Solo extráelos.
 */
