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
 *    - A esta plantilla agrega <meta charset="UTF-8"> </meta> justo después de la etiqueta <head> para
 *      que tu página pueda verse adecuadamente.
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
// Imports
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";

const plantillaPath = "./template.liquid";
const dataPath = "./data.ts";
const outputPath = "./dist/index.html";


//Observar cambios en `data.ts`
async function observarCambios() {
  for await (const evento of Deno.watchFs("./")) {
    if (evento.paths.some(path => path.endsWith("data.ts"))) {
      console.log("\n🔄 Cambio detectado en `data.ts`, generando nuevo archivo HTML...");
      await recargarYGenerarHTML();
    }
  }
}


//Recargar `data.ts` y procesar la plantilla
//Recargar `data.ts` y generar el HTML
async function recargarYGenerarHTML() {
  try {
    console.clear();

    // 1️ Recargar `data.ts`
    const contextoImportado = await import(`file://${Deno.cwd()}/${dataPath}?version=${Date.now()}`);
    const contexto = contextoImportado.contexto;

    // 2️ Leer `template.liquid`
    const entradaLiquid = await Deno.readTextFile(plantillaPath);

    // 3️ Procesar la plantilla con los datos actualizados
    const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
    const arbolDOM = htmlParser(plantillaRenderizada);
    const htmlFinal = renderDOM(arbolDOM);

    // 4️ Guardar el HTML en `dist/index.html`
    await Deno.writeTextFile(outputPath, htmlFinal);
    console.log("\n Archivo `dist/index.html` generado exitosamente.");
  } catch (error) {
    console.error("\n Error al generar el archivo HTML:", error);
  }
}

//Ejecutamos el watcher
await recargarYGenerarHTML(); // Render inicial
observarCambios(); // Monitorea cambios en `data.ts`
