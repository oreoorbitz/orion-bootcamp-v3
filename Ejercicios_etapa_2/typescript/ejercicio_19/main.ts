/**
 * MÓDULO 19: AGREGAR HOJAS DE ESTILO (CSS) + INYECCIÓN Y HOT RELOAD DE ASSETS
 *
 * 🧠 Concepto clave:
 * Hasta ahora, tu sitio tiene estructura y funcionalidad, pero no tiene estilo visual.
 * El estilo de una página web se controla con **CSS (Cascading Style Sheets)**.
 * CSS te permite definir cómo se ve cada parte de la página: colores, márgenes, tamaños de texto, fondos, etc.
 *
 * Aunque todavía no has aprendido a escribir CSS en detalle, en este módulo vas a:
 * - Agregar un archivo `.css` a tu proyecto
 * - Usar filtros de Liquid para generar etiquetas `<link>` que lo conecten con tu HTML
 * - Detectar cambios en los estilos y recargar la hoja de estilo en el navegador automáticamente
 *
 * 🎯 Objetivo:
 * 1. Crear un archivo de estilos CSS en una carpeta de assets
 * 2. Usar dos filtros encadenados:
 *    - `asset_url`: convierte `"styles.css"` en `"/assets/styles.css"`
 *    - `stylesheet_tag`: convierte `"/assets/styles.css"` en `<link rel="stylesheet" href="/assets/styles.css">`
 * 3. Inyectar el tag resultante en tu HTML dentro de `<head>`
 * 4. Detectar cambios al editar `styles.css` y recargarlo sin reiniciar la página
 *
 * ✅ Parte 1: Agrega una hoja de estilo
 * - Crea una carpeta llamada `/assets/`
 * - Dentro coloca un archivo `styles.css` con contenido visual básico, por ejemplo:
 * ```css
 * body {
 *   font-family: sans-serif;
 *   background-color: #f8f8f8;
 *   color: #333;
 *   padding: 2rem;
 * }
 * h1 {
 *   color: darkgreen;
 * }
 * ```
 *
 * ✅ Parte 2: Filtros de Liquid
 * Implementa dos filtros en tu sistema Liquid:
 * - `asset_url`: convierte `"styles.css"` → `"/assets/styles.css"`
 * - `stylesheet_tag`: convierte `"/assets/styles.css"` → `<link rel="stylesheet" href="/assets/styles.css">`
 *
 * 📌 Nota importante:
 * Los filtros deben **encadenarse** en orden:
 * ```liquid
 * {{ "styles.css" | asset_url | stylesheet_tag }}
 * ```
 * Así primero se genera la URL, y luego se construye el tag.
 *
 * El resultado esperado es:
 * ```html
 * <link rel="stylesheet" href="/assets/styles.css">
 * ```
 *
 * ✅ Parte 3: Inyección en el HTML generado
 * - Busca la etiqueta `</head>` en tu HTML final
 * - Inserta la etiqueta `<link>` generada justo antes
 * - Solo inyecta una vez
 *
 * ✅ Parte 4: Servidor y hot reload de CSS
 * 1. Modifica tu `server.ts` para servir los archivos de `/assets`:
 *    - Si la URL comienza con `/assets/`, responde con el archivo correspondiente
 *    - Usa el header `Content-Type: text/css` para archivos `.css`
 *
 * 2. Modifica `watcher.ts` para detectar cambios en `assets/styles.css`
 *    - Al detectar cambios, ejecuta de nuevo el generador (`main.ts`)
 *    - Luego, envía un mensaje `"reload"` al WebSocket
 *
 * 3. En el navegador, el cliente WebSocket debe recargar solo las hojas de estilo:
 * ```html
 * <script>
 * const ws = new WebSocket("ws://" + location.host + "/ws");
 * ws.onmessage = () => {
 *   document.querySelectorAll("link[rel=stylesheet]").forEach(link => {
 *     const href = link.getAttribute("href").split("?")[0];
 *     link.setAttribute("href", href + "?t=" + Date.now());
 *   });
 * };
 * </script>
 * ```
 *
 * ✅ Resultado esperado:
 * - Tu HTML incluye una etiqueta `<link>` para `styles.css`
 * - El navegador aplica los estilos automáticamente
 * - Si editas el archivo CSS, el navegador actualiza los estilos en vivo, sin recargar toda la página
 *
 * ✅ Bonus: contenido de prueba
 * En tu plantilla, puedes incluir:
 * ```html
 * <h1>Bienvenido</h1>
 * <p>Este texto será estilizado automáticamente.</p>
 * <button>Presióname</button>
 * ```
 * Y en tu `styles.css`:
 * ```css
 * button {
 *   background: royalblue;
 *   color: white;
 *   padding: 1rem;
 *   border-radius: 6px;
 *   border: none;
 *   font-size: 1rem;
 * }
 * ```
 *
 * Este módulo completa la integración de assets en tu sistema, y demuestra cómo HTML, CSS y JavaScript
 * trabajan juntos en la web moderna.
 */
