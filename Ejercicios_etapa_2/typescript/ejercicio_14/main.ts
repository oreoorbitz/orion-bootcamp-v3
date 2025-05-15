/**
 * MÓDULO 14: CONVERTIR UN ARCHIVO `.liquid` EN HTML COMPLETO
 *
 * 🧠 Concepto clave:
 * En el módulo anterior combinaste dos piezas esenciales:
 * - Un motor Liquid que interpreta variables, condicionales, bucles, filtros y asignaciones.
 * - Un parser DOM que transforma HTML plano en un árbol de nodos manipulables.
 *
 * Ahora, vas a dar el siguiente paso: tomar una plantilla real almacenada en un archivo `.liquid`, procesarla con tu motor, y renderizarla como HTML final.
 * Este paso es lo que convierte tu sistema en una **herramienta de compilación completa**, similar a los generadores de sitios estáticos como Jekyll o Eleventy.
 *
 * ✅ Este módulo conecta:
 * - 📄 Tu motor Liquid (plantilla + contexto)
 * - 🌳 Tu parser DOM (construcción de árbol)
 * - 🧾 Tu renderer final (HTML como string)
 *
 * ✅ Flujo completo:
 * 1. Leer la plantilla `.liquid` desde disco
 * 2. Ejecutar el motor Liquid con el contexto
 * 3. Pasar el resultado como string HTML a tu parser
 * 4. Construir el árbol de nodos
 * 5. Renderizar el árbol como HTML plano
 *
 * 🎯 Objetivo:
 * Implementar una función `renderizarArchivoLiquid(ruta: string, contexto: Record<string, any>): Promise<string>` que:
 * - Use `Deno.readTextFile` para obtener el contenido
 * - Procese todas las directivas y expresiones de plantilla
 * - Pase el resultado al parser HTML (`construirArbol`)
 * - Devuelva un string HTML final listo para mostrar o guardar
 *
 * ✅ Ejemplo de plantilla `./plantillas/bienvenida.liquid`:
 * ```liquid
 * <section>
 *   <h1>{{ titulo | upcase }}</h1>
 *   <ul>
 *     {% for fruta in frutas %}
 *       {% if fruta %}
 *         <li>{{ fruta | upcase }}</li>
 *       {% endif %}
 *     {% endfor %}
 *   </ul>
 * </section>
 * ```
 *
 * ✅ Contexto de ejemplo:
 * ```ts
 * const contexto = {
 *   titulo: "Frutas favoritas",
 *   frutas: ["manzana", "uva", "naranja"]
 * };
 * ```
 *
 * ✅ Resultado esperado:
 * ```html
 * <section>
 *   <h1>FRUTAS FAVORITAS</h1>
 *   <ul><li>MANZANA</li><li>UVA</li><li>NARANJA</li></ul>
 * </section>
 * ```
 *
 * 🛠️ Instrucciones:
 * 1. Crea una carpeta `/plantillas` con un archivo `.liquid`
 * 2. Implementa la función `renderizarArchivoLiquid(ruta, contexto)`
 * 3. Usa las funciones de módulos anteriores en este orden:
 *    - `detectarTokensPlantilla()`
 *    - `procesarAsignaciones()`
 *    - `procesarCondicionales()`
 *    - `procesarBucles()`
 *    - `renderizarVariables()` con soporte de filtros
 *    - `tokenizarHTML()` → `clasificarTokens()` → `construirArbol()`
 *    - `renderizarHTML()`
 * 4. Devuelve el string HTML renderizado
 *
 * ✅ Uso propuesto:
 * ```ts
 * const html = await renderizarArchivoLiquid("./plantillas/bienvenida.liquid", contexto)
 * console.log(html)
 * ```
 *
 * 🧠 Consejo:
 * - Este módulo no agrega nueva lógica de plantillas, pero **une todos los módulos anteriores en un flujo completo**
 * - Esta función se convertirá en el punto de entrada principal de tu sistema
 * - Verifica cada paso con `console.log()` si algo no se transforma como esperas
 */
