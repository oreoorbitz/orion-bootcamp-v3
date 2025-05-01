/**
 * MÓDULO 14: CONVERTIR UN ARCHIVO `.liquid` EN HTML COMPLETO
 *
 * 🧠 Concepto clave:
 * Hasta ahora has trabajado con plantillas y datos directamente en strings. Pero en proyectos reales, las plantillas viven en archivos `.liquid`,
 * los datos en objetos o archivos `.json`, y el resultado se transforma en HTML para mostrar en un navegador o guardar como archivo.
 *
 * En este módulo, vas a crear una función que lea un archivo `.liquid`, procese sus directivas, y lo convierta en un HTML completo.
 * Este es el paso final que convierte tu motor de plantillas en una herramienta funcional de compilación.
 *
 * ✅ Herramientas que vas a usar:
 * - `Deno.readTextFile` para leer archivos `.liquid`
 * - Todas tus funciones del motor de plantillas (`tokenizar`, `procesarCondicionales`, `renderizarVariables`, etc.)
 * - Tu parser HTML (`tokenizarHTML`, `clasificarTokens`, `construirArbol`)
 * - Tu renderer final (`renderizarHTML`)
 *
 * 🎯 Objetivo:
 * Implementar una función `renderizarArchivoLiquid(ruta: string, contexto: Record<string, any>): Promise<string>` que:
 * 1. Lea un archivo `.liquid` del disco
 * 2. Procese la plantilla usando tu motor
 * 3. Convierta el contenido a tokens HTML
 * 4. Convierta los tokens en árbol DOM
 * 5. Renderice el árbol como HTML final
 *
 * ✅ Ejemplo de uso:
 * ```ts
 * const contexto = {
 *   titulo: "Hola mundo",
 *   frutas: ["manzana", "uva", "naranja"]
 * };
 *
 * const html = await renderizarArchivoLiquid("./plantillas/bienvenida.liquid", contexto);
 * console.log(html);
 * ```
 *
 * ✅ Resultado esperado (si la plantilla es válida):
 * ```html
 * <h1>Hola mundo</h1>
 * <ul><li>manzana</li><li>uva</li><li>naranja</li></ul>
 * ```
 *
 * Instrucciones:
 * 1. Crea un archivo de plantilla `.liquid` (puede estar en una carpeta como `/plantillas`)
 * 2. Implementa `renderizarArchivoLiquid(ruta, contexto)`
 * 3. Usa tus funciones de los módulos anteriores en orden:
 *    - detectarTokensPlantilla()
 *    - procesarAsignaciones()
 *    - procesarCondicionales()
 *    - procesarBucles()
 *    - renderizarVariables() con filtros
 *    - tokenizarHTML() → clasificarTokens() → construirArbol()
 *    - renderizarHTML()
 * 4. Devuelve el HTML como string
 *
 * Consejo:
 * - Puedes permitir que esta función sirva como el "compilador" principal de tu sistema
 * - Esto simula cómo trabaja un generador de sitios estáticos como Jekyll, Eleventy o Astro
 * - Usa `console.log()` para verificar en qué punto del pipeline algo puede estar fallando
 */
