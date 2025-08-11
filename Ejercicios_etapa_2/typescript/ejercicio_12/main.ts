/**
 * MÓDULO 12: CONECTAR MOTOR DE PLANTILLAS CON MOTOR DOM
 *
 * 🧠 Concepto clave:
 * Hasta ahora, has construido dos sistemas importantes por separado:
 * - Un **motor de plantillas Liquid** que transforma texto con variables, condiciones, bucles y filtros.
 * - Un **motor DOM** que convierte HTML plano en un árbol de nodos que puedes recorrer y manipular.

 * En este módulo los vas a combinar:
 * - Primero se procesa la plantilla con Liquid.
 * - Luego se pasa el resultado como HTML a tu parser para construir un árbol DOM.
 *
 * ✅ Ejemplo de plantilla combinada:
 * ```liquid
 * <ul>
 *   {% for fruta in frutas %}
 *     {% if fruta %}
 *       <li>{{ fruta | upcase }}</li>
 *     {% endif %}
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Ejemplo de contexto:
 * ```ts
 * {
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 * ```
 *
 * ✅ Resultado después del render:
 * ```html
 * <ul>
 *   <li>MANZANA</li>
 *   <li>PLÁTANO</li>
 *   <li>UVA</li>
 * </ul>
 * ```
 *
 * ✅ Resultado como árbol DOM (formato abreviado):
 * ```ts
 * {
 *   tipo: 'elemento',
 *   nombre: 'ul',
 *   atributos: {},
 *   hijos: [
 *     { tipo: 'elemento', nombre: 'li', hijos: [{ tipo: 'texto', contenido: 'MANZANA' }] },
 *     ...
 *   ]
 * }
 * ```
 *
 * 🎯 Objetivo:
 * Procesar una plantilla Liquid completa, y luego convertir el resultado en un árbol de nodos usando tu parser DOM.

 * 🛠️ Instrucciones:
 * 1. Usa la función `renderizarPlantilla(...)` para transformar la plantilla con el contexto.
 * 2. Pasa el resultado HTML a tu función `construirArbol(...)` del módulo DOM.
 * 3. Imprime el árbol resultante con `console.log(...)`.

 * ✅ Puedes usar el siguiente HTML + Liquid como punto de partida:
 * ```ts
 * const plantilla = `
 * <section>
 *   <h2>Frutas favoritas</h2>
 *   <ul>
 *     {% for fruta in frutas %}
 *       {% if fruta %}
 *         <li>{{ fruta | upcase }}</li>
 *       {% endif %}
 *     {% endfor %}
 *   </ul>
 * </section>
 * `
 * ```
 *
 * ✅ Contexto de ejemplo:
 * ```ts
 * const contexto = {
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 * ```
 *
 * ✅ Recordatorio: asegúrate de procesar en orden:
 * 1. Asignaciones (`assign`)
 * 2. Bucles (`for`)
 * 3. Condicionales (`if`)
 * 4. Reemplazo de variables (`{{ nombre }}`)
 * 5. Filtros (`| upcase`, etc.)
 *
 * Consejo:
 * - Revisa si necesitas normalizar el string (por ejemplo, `.trim()` o `.replace(/\n/g, '')`)
 * - No necesitas mostrar nada visual todavía — solo asegúrate de que el árbol de nodos se construye correctamente
 * - Este módulo prepara el camino para el renderizado real en pantalla en los siguientes pasos
 */
