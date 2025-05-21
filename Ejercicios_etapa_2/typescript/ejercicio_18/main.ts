/**
 * MÓDULO 18: INTRODUCCIÓN A ESTRUCTURA HTML REAL + SERVIDOR LOCAL
 *
 * 🧠 Concepto clave:
 * Hasta ahora, tus plantillas generaban fragmentos sueltos de HTML.
 * Pero un navegador espera un documento con esta estructura general:
 *
 * ```html
 * <html>
 *   <head>
 *     <title>...</title>
 *   </head>
 *   <body>
 *     ...contenido visual de la página...
 *   </body>
 * </html>
 * ```
 *
 * En este módulo, vas a generar un archivo HTML **completo** y vas a crear un **servidor local**
 * para verlo en tu navegador en lugar de solo imprimirlo en consola.
 *
 * 🎯 Objetivo:
 * Generar una página HTML estructurada correctamente y servirla en un navegador usando Deno.
 *
 * ✅ Estructura sugerida:
 * ```
 * Ejercicios_etapa_2/
 * ├── plantilla_motor/
 * ├── ejercicio_18/
 * │   ├── main.ts               ← ejecuta la renderización y guarda el archivo
 * │   ├── template.liquid       ← incluye html, head, title, body, etc.
 * │   ├── data.ts               ← exporta el objeto `contexto`
 * |   ├── server.ts             ← servidor que sirve el archivo generado
 * │   └── dist/
 * │       └── index.html       ← se genera automáticamente
 *
 * ```
 *
 * ✅ Instrucciones:
 * 1. Escribe una plantilla `plantilla.liquid` que represente una página HTML completa.
 *    - Incluye etiquetas `<html>`, `<head>`, `<title>`, y `<body>`
 *    - Usa variables dentro del body como `{{ nombre }}` o `{{ descripcion }}`
 *
 * 2. Usa tu función de renderizado para procesar la plantilla con el `contexto` definido en `data.ts`
 *    - Por ejemplo:
 *      ```ts
 *      import { contexto } from "./data.ts";
 *      const html = renderizarArchivoLiquid("plantilla.liquid", contexto);
 *      await Deno.writeTextFile("dist/index.html", html);
 *      ```

 * 3. Crea un archivo `server.ts` con un servidor local básico:
 *    ```ts
 *    Deno.serve({ port: 3000 }, async (req) => {
 *      try {
 *        const html = await Deno.readTextFile("dist/index.html");
 *        return new Response(html, {
 *          headers: { "Content-Type": "text/html" }
 *        });
 *      } catch {
 *        return new Response("404 - Página no encontrada", { status: 404 });
 *      }
 *    });
 *    ```

 * 4. Ejecuta tu servidor con:
 *    ```bash
 *    deno run --allow-net --allow-read server.ts
 *    ```

 * 5. Abre tu navegador y visita: `http://localhost:3000`

 *
 * ✅ Resultado esperado:
 * Una página HTML bien estructurada que se muestra en el navegador.
 * Puedes modificar el `contexto` y volver a ejecutar el generador para ver los cambios.
 *
 * ✅ Consejo:
 * - Este módulo conecta el mundo de **plantillas estáticas** con el del **servido de contenido real**.
 * - A partir de ahora puedes ir simulando sitios completos con múltiples rutas.
 */
