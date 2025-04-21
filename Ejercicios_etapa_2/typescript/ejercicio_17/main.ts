/**
 * MÓDULO 17: SERVIDOR LOCAL PARA MOSTRAR LOS ARCHIVOS HTML
 *
 * 🧠 Concepto clave:
 * Una vez que tu sitio está generado en archivos HTML estáticos, puedes usar un servidor local
 * para visualizarlo en un navegador sin necesidad de abrir cada archivo manualmente.
 *
 * En este módulo, crearás un pequeño servidor con Deno que sirva los archivos desde la carpeta `dist/`.
 * Este es el paso final para tener una experiencia de desarrollo real: modificar → compilar → ver en navegador.
 *
 * Objetivo:
 * Crear un servidor HTTP con Deno que sirva el contenido de la carpeta `dist/`.
 *
 * Instrucciones:
 * 1. Crea un archivo llamado `server.ts` (o agrégalo a tu `main.ts` si prefieres)
 * 2. Usa `Deno.serve()` para escuchar en un puerto, por ejemplo `localhost:3000`
 * 3. Para cada petición:
 *    - Si la ruta es `/`, busca y sirve `dist/index.html`
 *    - Para otras rutas como `/producto1.html`, sirve `dist/producto1.html`
 *    - Si el archivo no existe, responde con `404 - No encontrado`
 *
 * Ejemplo de código base:
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
 * Consejo:
 * - Puedes abrir http://localhost:3000 en tu navegador para ver el resultado
 * - Si haces cambios en tu plantilla o en los datos, recuerda volver a ejecutar el generador de archivos
 *
 * Resultado esperado:
 * Un navegador que muestra tu HTML renderizado desde la carpeta `dist/`, como si estuviera en producción.
 */
