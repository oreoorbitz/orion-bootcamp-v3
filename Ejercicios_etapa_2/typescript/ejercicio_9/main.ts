/**
 * MÓDULO 9: CONSTRUCCIÓN DE BUCLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Los motores de plantillas como Liquid permiten generar listas de contenido usando bucles `{% for item in lista %}`.
 * Esto es útil, por ejemplo, para generar un bloque por cada producto en una tienda.
 *
 * En este módulo, vas a procesar bloques repetibles y a renderizar cada ítem de forma dinámica.
 *
 * Objetivo:
 * Repetir secciones de la plantilla por cada elemento de un arreglo en el contexto.
 *
 * Instrucciones:
 * 1. Crea una función `procesarBucles(tokens: string[], contexto: Record<string, any>): string[]`
 * 2. Detecta los bloques `{% for item in lista %} ... {% endfor %}`
 * 3. Para cada elemento de `contexto['lista']`, repite ese bloque reemplazando `{{ item }}` con el valor actual
 *
 * Entrada:
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
 * Resultado esperado:
 * [
 *   "Lista: ",
 *   "manzana ",
 *   "plátano ",
 *   "uva "
 * ]
 *
 * Consejo:
 * - Este patrón de bucle es uno de los más usados en generación de HTML con datos
 * - Puedes usar `renderizarVariables` dentro del cuerpo del bucle para reemplazar `{{ item }}`
 */
