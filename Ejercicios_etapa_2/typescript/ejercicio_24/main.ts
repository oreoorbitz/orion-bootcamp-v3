/**
 * MÓDULO 24: `asset_url`, `stylesheet_tag` y recarga en caliente de CSS

 * 🧠 Concepto clave:
 * En el desarrollo web, el CSS se usa para definir **cómo se ve** una página:
 * colores, tamaños, márgenes, estilos de texto, etc.

 * Aunque aún no trabajamos directamente con estilos en este curso, ahora que estamos generando páginas HTML
 * reales, es importante poder incluir hojas de estilo (CSS) de forma organizada.

 * En este módulo vas a:
 * - Crear dos filtros de Liquid:
 *    1. `asset_url`: genera una ruta a un archivo dentro de `/assets/`
 *    2. `stylesheet_tag`: convierte esa ruta en una etiqueta `<link>` para incluir estilos CSS
 * - Implementar hot reload de CSS: cuando un archivo `.css` en `assets/` cambie, se actualizará sin recargar la página.

 *
 * 🎯 Objetivo:
 * - Convertir `{{ 'theme.css' | asset_url | stylesheet_tag }}` en:
 *   `<link rel="stylesheet" href="./assets/theme.css" />`
 * - Recargar dinámicamente ese archivo si es editado mientras el servidor está corriendo

 *
 * ✅ Instrucciones:

 * 1. Crea un archivo `assets/theme.css` con este contenido (puedes modificarlo):
 * ```css
 * body {
 *   background-color: #f0f0f0;
 *   font-family: sans-serif;
 * }

 * h1 {
 *   color: #333;
 * }
 * ```

 * 2. Agrega el filtro `asset_url` a tu motor de plantillas:
 * ```ts
 * function asset_url(nombreArchivo: string): string {
 *   return `./assets/${nombreArchivo}`;
 * }
 * ```

 * 3. Agrega el filtro `stylesheet_tag`:
 * ```ts
 * function stylesheet_tag(ruta: string): string {
 *   return `<link rel="stylesheet" href="${ruta}" />`;
 * }
 * ```

 * 4. Usa estos filtros combinados en tus plantillas:
 * ```liquid
 * {{ 'theme.css' | asset_url | stylesheet_tag }}
 * ```

 * Esto debe generar:
 * ```html
 * <link rel="stylesheet" href="./assets/theme.css" />
 * ```

 *
 * 5. Crea en `assets/hotreload.css.ts` un script que observe cambios en los estilos y recargue la hoja de estilos **sin recargar la página**:

 * ```ts
 * const link = document.querySelector('link[rel="stylesheet"]');
 * const socket = new WebSocket("ws://localhost:3001");

 * socket.onmessage = (event) => {
 *   const data = JSON.parse(event.data);
 *   if (data.type === "reload-css") {
 *     const url = new URL(link.href);
 *     url.searchParams.set("t", Date.now().toString()); // Evita el cache
 *     link.href = url.toString();
 *   }
 * };
 * ```

 * 6. Modifica tu servidor WebSocket para enviar `{ type: 'reload-css' }` cuando se edite un `.css` en la carpeta `assets/`.

 * 7. Inyecta este script con tu helper `injectInlineScript` o transpílalo como `.js` y enlázalo.

 *
 * ✅ Resultado esperado:
 * - Tu HTML tiene una hoja de estilos enlazada
 * - Si editas `theme.css`, la hoja se vuelve a aplicar automáticamente sin recargar la página
 * - Puedes ver cambios visuales como colores o fuentes

 *
 * 📌 Consejo:
 * - El filtro `asset_url` es una convención en motores como Liquid y ayuda a mantener rutas organizadas
 * - El filtro `stylesheet_tag` encapsula la lógica HTML, igual que en Shopify

 *
 * 💡 ¿Qué estás aprendiendo aquí?
 * - Cómo funcionan las hojas de estilo (aunque no escribas CSS directamente)
 * - Cómo se enlazan recursos estáticos en HTML
 * - Cómo hacer que tu proyecto detecte y reaccione a cambios en archivos sin recargar

 */
