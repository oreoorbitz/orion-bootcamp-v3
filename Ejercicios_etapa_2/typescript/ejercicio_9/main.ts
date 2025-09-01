/**
 * MÓDULO 9: CONSTRUCCIÓN DE BUCLES EN PLANTILLAS
 *
 * 🧠 Concepto clave:
 * Los motores de plantillas como Liquid permiten generar contenido dinámico a partir de arreglos usando bucles `{% for item in lista %}`.
 * Esto es esencial para mostrar listas como productos, entradas de blog, comentarios, etc.
 *
 * En los módulos anteriores:
 * - Aprendiste a detectar y clasificar tokens (`texto`, `variable`, `directiva`)
 * - Procesaste condicionales `{% if %}` en base al contexto
 * - Reemplazaste variables simples con `{{ nombre }}`
 *
 * Ahora vas a interpretar una nueva directiva: los bucles con `{% for item in lista %}`.
 * Además, dentro del cuerpo del bucle puede haber condicionales — lo cual pondrá a prueba si tu motor (las funciones creadas en orden)
 * procesa los bloques en orden correcto.
 *
 * ✅ Ejemplo de plantilla original:
 * ```liquid
 * Lista:
 * {% for fruta in frutas %}
 *   {% if fruta %}
 *     {{ fruta }}
 *   {% endif %}
 * {% endfor %}
 * ```
 *
 * ✅ Tokens clasificados de entrada:
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "directiva", contenido: "for fruta in frutas" },
 *   { tipo: "directiva", contenido: "if fruta" },
 *   { tipo: "variable", contenido: "fruta" },
 *   { tipo: "texto", contenido: " " },
 *   { tipo: "directiva", contenido: "endif" },
 *   { tipo: "directiva", contenido: "endfor" }
 * ]
 * ```
 *
 * ✅ Resultado esperado (si frutas = ["manzana", "plátano", "uva"]):
 * ```ts
 * [
 *   { tipo: "texto", contenido: "Lista: " },
 *   { tipo: "texto", contenido: "manzana " },
 *   { tipo: "texto", contenido: "plátano " }
 * ]
 * ```
 *
 * Objetivo:
 * Detectar bloques `{% for %}` → `{% endfor %}` y repetir su contenido por cada elemento en el arreglo indicado.
 * Los bloques internos pueden tener condicionales que debes procesar primero.
 *
 * Instrucciones:
 * 1. Crea una función `procesarBucles(tokens: TokenPlantilla[], contexto: Record<string, any>): TokenPlantilla[]`
 * 2. Para cada directiva `{% for item in lista %}`:
 *    - Identifica el bloque hasta el `{% endfor %}`
 *    - Extrae el nombre del item y de la lista (`for fruta in frutas`)
 *    - Por cada valor, renderiza una copia del bloque interno Reemplaza `{{ item }}` con el valor actual
 * 3. El resultado debe ser un nuevo arreglo con los bloques repetidos y procesados
 *
 * Consejo:
 * - Haz un bucle externo para recorrer los tokens y detectar el inicio y fin del `for`
 * - Asegúrate de mantener el orden de ejecución: primero condicionales, luego variables
 *
 */
