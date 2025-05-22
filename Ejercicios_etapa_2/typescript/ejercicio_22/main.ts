/**
 * MÓDULO 22: INYECTAR JAVASCRIPT TRANSPILADO A HTML

 * 🧠 Concepto clave:
 * Aunque en este curso hemos estado usando Deno con TypeScript directamente, **los navegadores no entienden TypeScript**.
 * Los navegadores solo ejecutan **JavaScript plano**. Por eso, todo proyecto moderno debe convertir (`transpilar`)
 * los archivos `.ts` a `.js` antes de usarlos en un `<script>` en una página.

 * Este módulo te ayudará a entender ese flujo:
 * - Crear TypeScript → Transpilar a JavaScript → Insertar en una página HTML

 *
 * 🎯 Objetivo:
 * - Crear un módulo que convierta archivos TypeScript a JavaScript
 * - Crear una función que permita insertar JavaScript en un HTML, como script inline
 * - Usar ambas cosas desde tu `main.ts`

 *
 * ✅ Instrucciones:

 * 1. En la carpeta padre del curso (`Ejercicios_etapa_2/typescript`), crea un módulo llamado `transpilar.ts`
 *    que exporte una función:
 *
 * ```ts
 * export async function transpilarTSorThrow(inputPath: string, outputPath: string): Promise<void>
 * ```
 *
 * Esta función debe:
 * - Usar `Deno.emit()` para convertir el archivo `.ts` a `.js`
 * - Escribir el resultado en `outputPath` (solo JavaScript, sin mapas ni módulos externos)
 *
 *
 * 2. En tu módulo `slightlyLate.ts`, agrega una función:
 *
 * ```ts
 * export async function insertarScriptInline(
 *   html: string,
 *   script: string | { path: string }
 * ): Promise<string>
 * ```
 *
 * Esta función debe:
 * - Insertar el `<script>...</script>` justo antes de la etiqueta de cierre `</body>`
 * - Si `script` es un string: úsalo directamente como contenido del tag
 * - Si `script` es un objeto con `path`, lee el archivo y úsalo como contenido del tag
 *
 *
 * 3. En tu `main.ts`, prueba el flujo completo:
 * - Crea un archivo `frontend.ts` con algo como:
 *
 * ```ts
 * console.log("Este JS se ejecuta en el navegador");
 * ```
 *
 * - Usa `transpilarTSorThrow("frontend.ts", "frontend.js")`
 * - Luego lee `index.html` y usa `insertarScriptInline` para insertar el contenido de `frontend.js`
 * - Escribe el resultado final en `dist/index.html`

 *
 * ✅ Resultado esperado:
 * Tu archivo HTML final debe verse así:
 *
 * ```html
 * <html>
 * <head>...</head>
 * <body>
 *   ...contenido HTML...
 *   <script>
 *     // tu JS inline aquí
 *     console.log("Este JS se ejecuta en el navegador");
 *   </script>
 * </body>
 * </html>
 * ```

 *
 * 🧪 Consejo:
 * - Este patrón (TS → JS → HTML) es el mismo que usan frameworks como Vite, Astro, o Next.js internamente
 * - Usar `<script>` inline te permite experimentar sin tener que montar un sistema de rutas de archivos aún
 *
 * ⚠️ Nota:
 * - Este módulo prepara el terreno para el **hot reload** (Módulo 23)
 * - En el siguiente paso necesitarás que el JS ya esté inyectado para poder abrir una conexión WebSocket desde el navegador

 */
