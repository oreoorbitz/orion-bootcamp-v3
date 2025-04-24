/**
 * MÓDULO 18: TRANSFORMAR TYPESCRIPT A JAVASCRIPT PARA EL NAVEGADOR + PILA DE EVENTOS
 *
 * 🧠 Concepto clave:
 * Hasta ahora, tu código se ha ejecutado en **Deno**, que permite correr directamente archivos TypeScript (`.ts`).
 * Pero los navegadores no entienden TypeScript — solo pueden ejecutar JavaScript.
 *
 * Para usar tus scripts en una página HTML real, necesitas primero convertirlos a `.js`.
 * Este proceso se llama **transpilación**.
 *
 * En este módulo vas a:
 * - Crear un flujo de trabajo para convertir tus archivos `.ts` a `.js` automáticamente
 * - Inyectar el contenido `.js` como un `<script>` al final del `<body>`
 * - Registrar cada operación en una **pila de eventos**, que te servirá para rastrear el orden de las tareas ejecutadas
 *
 * 🎯 Objetivo:
 * 1. Transpilar archivos TypeScript a JavaScript usando `Deno.emit()`
 * 2. Inyectar los resultados como scripts inline en tu HTML
 * 3. Registrar cada paso en una pila de eventos para tener trazabilidad de lo que ocurre en el proceso
 *
 * 📦 Estructura sugerida:
 * ```
 * /scripts/
 *   global.ts
 *   ui.ts
 * /dist/
 *   index.html
 * /theme.html
 * main.ts
 * ```
 *
 * ✅ Parte 1: Transpilación
 * 1. Crea una función llamada `transpilarTSADefaultJS(filePath: string): string`
 *    - Usa `Deno.emit(filePath)` para obtener el JS correspondiente
 *    - Devuelve el contenido como string
 *
 * ✅ Parte 2: Inyección
 * 2. Crea una función `inyectarScriptsEnHTML(html: string, scripts: string[], stackEventos: string[]): string`
 *    - Inserta los scripts como `<script>...</script>` justo antes del cierre de `</body>`
 *    - Por cada script inyectado, agrega una entrada en `stackEventos` con el mensaje: `"script inyectado: [nombre archivo]"`
 *    - Al final, agrega `"html con scripts completado"`
 *
 * ✅ Parte 3: Pila de eventos
 * 3. Declara una pila como:
 * ```ts
 * const stackEventos: string[] = [];
 * ```
 *    - Esta pila se va llenando conforme ejecutas cada etapa de tu proceso
 *    - Puedes imprimirla en la consola o escribirla como comentario HTML:
 *    ```html
 *    <!-- stackEventos: ["ts compilado: global.ts", "script inyectado: global.js", ...] -->
 *    ```
 *
 * ✅ Ejemplo de uso:
 * ```ts
 * const htmlBase = await Deno.readTextFile('theme.html');
 * const contenido = generarContenido(); // contenido generado por tu pipeline
 * const htmlFinal = htmlBase.replace('{{ content_for_index }}', contenido);
 *
 * const tsFiles = ['scripts/global.ts', 'scripts/ui.ts'];
 * const scripts = await Promise.all(tsFiles.map(transpilarTSADefaultJS));
 * const finalConScripts = inyectarScriptsEnHTML(htmlFinal, scripts, stackEventos);
 *
 * await Deno.writeTextFile('dist/index.html', finalConScripts);
 * ```
 *
 * ✅ Resultado esperado:
 * - Cada archivo `.ts` en la carpeta `/scripts/` se convierte en JavaScript
 * - El JS se inyecta en tu HTML generado como script inline
 * - Una pila de eventos registra exactamente qué pasos se realizaron
 *
 * Consejo:
 * - Puedes mostrar la pila de eventos como comentario dentro del HTML para depurar
 * - Si en el futuro quieres hacer esto con archivos `.js` externos, solo cambia el tipo de inyección
 *
 * Este módulo cierra el ciclo de build moderno: fuente `.ts` → transformación → inyección en HTML → depuración con pila de eventos.
 */
