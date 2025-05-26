/**
 * MÓDULO 24: `asset_url`, `stylesheet_tag` y recarga en caliente de CSS
 *
 * 🧠 Concepto clave:
 * En el desarrollo web, el CSS se usa para definir **cómo se ve** una página:
 * colores, tamaños, márgenes, estilos de texto, etc.
 *
 * Aunque no hemos trabajado directamente con estilos aún, ahora que generamos HTML real,
 * es fundamental poder incluir hojas de estilo de forma organizada y permitir su recarga automática.
 *
 * A partir de este módulo, cada ejercicio tendrá una carpeta `assets/` que contendrá recursos estáticos
 * como archivos `.css`, imágenes o fuentes. Esa carpeta será usada en el navegador.
 * **El código JavaScript para hot reload seguirá viviendo en `server/` como hasta ahora.**
 *
 * 🎯 Objetivo:
 * - Convertir `{{ 'theme.css' | asset_url | stylesheet_tag }}` en:
 *   `<link rel="stylesheet" href="./assets/theme.css" />`
 * - Recargar dinámicamente ese archivo si es editado mientras el servidor está corriendo
 *
 * ✅ Instrucciones:
 *
 * 1. Crea una carpeta `assets/` dentro de tu carpeta de ejercicio.
 *    Dentro, crea un archivo `theme.css` con este contenido:
 *
 * ```css
 * body {
 *   background-color: #f0f0f0;
 *   font-family: sans-serif;
 * }
 *
 * h1 {
 *   color: #333;
 * }
 * ```
 *
 * 2. Agrega el filtro `asset_url` a tu motor de plantillas:
 *
 * ```ts
 * function asset_url(nombreArchivo: string): string {
 *   return `./assets/${nombreArchivo}`;
 * }
 * ```
 *
 * 3. Agrega el filtro `stylesheet_tag`:
 *
 * ```ts
 * function stylesheet_tag(ruta: string): string {
 *   return `<link rel="stylesheet" href="${ruta}" />`;
 * }
 * ```
 *
 * 4. Usa estos filtros combinados en tus plantillas:
 *
 * ```liquid
 * {{ 'theme.css' | asset_url | stylesheet_tag }}
 * ```
 *
 * Esto debe generar:
 *
 * ```html
 * <link rel="stylesheet" href="./assets/theme.css" />
 * ```
 *
 * 5. Crea o edita el archivo `server/hotreload.ts` para agregar soporte a recarga de CSS sin recargar toda la página:
 *
 * ```ts
 * const link = document.querySelector('link[rel="stylesheet"]');
 * const socket = new WebSocket("ws://localhost:3001");
 *
 * socket.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   if (data.type === "reload-css") {
 *     const url = new URL(link.href);
 *     url.searchParams.set("t", Date.now().toString()); // Evita el cache
 *     link.href = url.toString();
 *   }
 * };
 * ```
 *
 * 6. Modifica tu servidor WebSocket (`wsServer.ts`) para enviar `{ type: 'reload-css' }`
 *    cuando detecte cambios en archivos `.css` dentro de la carpeta `assets/`:
 *
 * ```ts
 * if (eventoDetectado.endsWith(".css")) {
 *   notificarClientes({ type: "reload-css" });
 * }
 * ```
 *
 * 7. Usa `injector()` para inyectar el script de `server/hotreload.ts` en tu HTML como hiciste en el módulo anterior.
 *    Recuerda usar la función `transpile()` para obtener el JS como string:
 *
 * ```ts
 * import { transpile } from "https://deno.land/x/emit/mod.ts";
 * import { injector } from "../injector.ts";
 * 
 *...posible otro codigo
 *
 * const url = new URL("../server/hotreload.ts", import.meta.url);
 * const result = await transpile(url);
 * const jsCode = result.get(url.href);
 *
 * if (jsCode) {
 *   await injector(jsCode, "index.html");
 * }
 * 
 * ...posible otro codigo
 * ```
 *
 * ✅ Resultado esperado:
 * - Tu HTML contiene una hoja de estilos enlazada
 * - Si editas `theme.css`, la hoja se vuelve a aplicar automáticamente sin recargar toda la página
 * - Puedes ver cambios visuales como colores o fuentes en tiempo real
 *
 * 📌 Consejo:
 * - El filtro `asset_url` es una convención útil para mantener rutas organizadas
 * - `stylesheet_tag` encapsula la lógica HTML, como hace Shopify
 *
 * 💡 ¿Qué estás aprendiendo aquí?
 * - Cómo funcionan las hojas de estilo en proyectos web
 * - Cómo enlazar archivos estáticos de manera ordenada
 * - Cómo recargar estilos sin refrescar toda la página, usando WebSockets y timestamps
 */
