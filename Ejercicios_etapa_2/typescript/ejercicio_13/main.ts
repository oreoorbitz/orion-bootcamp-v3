/**
 * MÓDULO 13: INTEGRAR PLANTILLA + ÁRBOL DE NODOS
 *
 * 🧠 Concepto clave:
 * Hasta ahora has construido múltiples piezas por separado: un motor de plantillas,
 * un parser de HTML, y un renderer. En este módulo, vas a **conectarlas todas**.
 *
 * Vas a transformar una plantilla como Liquid en una estructura DOM virtual,
 * renderizarla como HTML seguro, y devolver el resultado como una cadena.
 *
 * ✅ Flujo de pasos que vas a ejecutar:
 * 1. Detectar bloques (`{{ variable }}`, `{% if %}`, `{% assign %}`, `{% for %}`, etc.)
 * 2. Procesar directivas (`assign`, `if`, `for`)
 * 3. Reemplazar variables y aplicar filtros
 * 4. Convertir la plantilla resultante a tokens HTML
 * 5. Clasificar y construir el árbol DOM con tu parser
 * 6. Renderizar el árbol como HTML con `renderizarHTML()`
 *
 * ✅ Ejemplo de plantilla:
 * ```liquid
 * {% assign titulo = "Bienvenidos" %}
 * <h1>{{ titulo | upcase }}</h1>
 * {% if mostrarDescripcion %}
 *   <p>{{ descripcion }}</p>
 * {% endif %}
 * <ul>
 *   {% for fruta in frutas %}
 *     <li>{{ fruta | upcase }}</li>
 *   {% endfor %}
 * </ul>
 * ```
 *
 * ✅ Contexto de ejemplo:
 * ```ts
 * {
 *   mostrarDescripcion: true,
 *   descripcion: "Frutas de temporada",
 *   frutas: ["manzana", "plátano", "uva"]
 * }
 * ```
 *
 * ✅ Resultado esperado:
 * ```html
 * <h1>BIENVENIDOS</h1>
 * <p>Frutas de temporada</p>
 * <ul>
 *   <li>MANZANA</li>
 *   <li>PLÁTANO</li>
 *   <li>UVA</li>
 * </ul>
 * ```
 *
 * 🎯 Objetivo:
 * Implementar una función `generarHTMLDesdePlantilla(template: string, contexto: Record<string, any>): string`
 *
 * Instrucciones:
 * 1. Crea esa función en tu archivo principal.
 * 2. En ella, ejecuta estos pasos en orden:
 *    - `detectarTokensPlantilla()`
 *    - `procesarAsignaciones()`
 *    - `procesarCondicionales()`
 *    - `procesarBucles()`
 *    - `renderizarVariables()` (con filtros)
 *    - `tokenizarHTML()` → `clasificarTokens()` → `construirArbol()`
 *    - `renderizarHTML()` (usando escapeTexto para los nodos tipo texto)
 *
 * Consejo:
 * - No mezcles lógica dentro de una sola función. Haz funciones puras y encadenadas.
 * - Usa funciones auxiliares para manejar contexto, árbol, y filtros de forma separada.
 * - Verifica que todas las transformaciones funcionan en conjunto: bucles, condicionales, filtros, etc.
 *
 * Este módulo demuestra que has implementado un mini sistema de rendering basado en Liquid y DOM. ¡Felicidades!
 */
