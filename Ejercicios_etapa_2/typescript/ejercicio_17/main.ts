/**
 * MÓDULO 16: SERVIDOR LOCAL + ESTRUCTURA HTML + USO DE TEMA Y `{{ content_for_index }}`
 *
 * 🧠 Concepto clave:
 * Hasta ahora, tu pipeline ha generado contenido HTML aislado (por ejemplo: listas, artículos, productos).
 * En este módulo, aprenderás cómo envolver ese contenido dentro de una plantilla de página completa (un **theme**),
 * y luego servirlo desde un servidor local para visualizarlo en el navegador.
 *
 * Esta es una práctica común en todos los generadores de sitios estáticos:
 * - Se tiene una plantilla base (`theme.html`)
 * - Se define un espacio como `{{ content_for_index }}` donde va el contenido generado
 * - El HTML final resultante combina la plantilla base + contenido dinámico
 *
 * También repasarás cómo funciona la estructura básica de un archivo HTML:
 * - `<!DOCTYPE html>`: declara el tipo de documento
 * - `<html>`: el elemento raíz
 * - `<head>`: incluye título, metadatos, estilos, etc.
 * - `<body>`: contiene el contenido visible generado por tu pipeline
 *
 * 🎯 Objetivo:
 * 1. Crear un archivo de **tema** (`theme.html`) con una estructura HTML válida
 * 2. Inyectar tu contenido generado en el marcador `{{ content_for_index }}`
 * 3. Servir el HTML resultante en un servidor local con Deno
 *
 * 🧱 Estructura de archivos sugerida:
 * ```
 * /dist/
 * /theme.html        ← plantilla base (estructura HTML completa)
 * /index.html        ← archivo final generado usando theme + contenido
 * /server.ts         ← servidor local
 * /main.ts           ← pipeline que genera `index.html`
 * ```
 *
 * 📦 theme.html:
 * ```html
 * <!DOCTYPE html>
 * <html lang="es">
 *   <head>
 *     <meta charset="UTF-8" />
 *     <title>Mi sitio</title>
 *   </head>
 *   <body>
 *     {{ content_for_index }}
 *   </body>
 * </html>
 * ```
 *
 * 🛠 Instrucciones:
 * 1. Crea el archivo `theme.html` como plantilla base. Coloca `{{ content_for_index }}` en el lugar donde quieres insertar el contenido.
 * 2. En tu pipeline (`main.ts`), haz lo siguiente:
 *    - Genera el contenido HTML dinámico como lo hiciste en el Módulo 14
 *    - Carga el archivo `theme.html`
 *    - Reemplaza el marcador `{{ content_for_index }}` por el contenido generado
 *    - Guarda el resultado final como `dist/index.html` usando `Deno.writeTextFile()`
 *
 * 3. Crea un archivo `server.ts`
 *    - Usa `Deno.serve()` para escuchar en `localhost:3000`
 *    - Cuando se acceda a `/`, sirve el archivo `dist/index.html`
 *
 * Ejemplo de servidor mínimo:
 * ```ts
 * Deno.serve({ port: 3000 }, async (req) => {
 *   const url = new URL(req.url);
 *   const path = url.pathname === '/' ? '/index.html' : url.pathname;
 *   try {
 *     const file = await Deno.readTextFile(`./dist${path}`);
 *     return new Response(file, { headers: { 'Content-Type': 'text/html' } });
 *   } catch {
 *     return new Response('404 - No encontrado', { status: 404 });
 *   }
 * });
 * ```
 *
 * 💡 Consejo:
 * - Si quieres cambiar el diseño de todo el sitio, solo editas `theme.html`
 * - Puedes extender la idea a múltiples plantillas y zonas de contenido (como `content_for_header`, `content_for_footer`)
 *
 * ✅ Resultado esperado:
 * - HTML final ubicado en `dist/index.html`, generado combinando `theme.html` con tu contenido
 * - Servidor local disponible en http://localhost:3000
 * - Visualización real del contenido renderizado en navegador
 *
 * Este módulo simula cómo funciona el sistema de themes en herramientas como Jekyll, Shopify, Liquid, y SvelteKit.
 */
