/**
 * MÓDULO 21: SOPORTE PARA LAYOUTS Y `content_for_index`

 * 🧠 Concepto clave:
 * En sistemas como Shopify, cada página se construye a partir de una **plantilla principal (layout)**,
 * que define la estructura global del documento HTML (`<html>`, `<head>`, `<body>`, etc.).

 * El contenido dinámico de cada página se "inyecta" en un espacio reservado llamado `{{ content_for_index }}`.
 * Esto permite separar el diseño general (header, footer, scripts) del contenido específico de cada plantilla.

 *
 * 🎯 Objetivo:
 * Agregar soporte para layouts y la variable `content_for_index` en tu compilador Liquid.

 *
 * ✅ Instrucciones:

 * 1. En cada ejercicio vas a crear un archivo `theme.liquid`, con estructura básica:
 * ```liquid
 * <html>
 *   <head>
 *     <meta charset="UTF-8"></meta>
 *     <title> {{ settings.titulo }} </title>
 *   </head>
 *   <body>
 *     {{ content_for_index }}
 *   </body>
 * </html>
 * ```

 * 2. Modifica tu función `renderizarArchivoLiquid` o crea una nueva que:
 *    - Primero vamos a renderizar el archivo content_for_index.liquid.
 *      el mismo objecto de contexto que será declarado en main(no es necesario hacer data.ts por el momento) a todo los archivos.
 *    - Luego lea el layout (`theme.liquid`)
 *    - Reemplace `{{ content_for_index }}` con el HTML generado de el archivo content_for_index.liquid
 *    - Renderice el layout final con el mismo contexto (por si usa variables como `settings`)

 * 3. Asegúrate de que el contenido insertado ya esté procesado (con variables, condicionales, bucles, etc.)

 *
 * ✅ Resultado esperado:
 * Una estructura como esta:
 * - content_for_index.liquid → contiene el contenido para tu pagina principal
 * - theme.liquid` → contiene la estructural global de tu pagina
 * - Resultado final en `dist/index.html` combina ambos, usando el placeholder `{{ content_for_index }}`

 *
 * 🧪 Ejemplo:
 * content_for_index.liquid
 * ```liquid
 * <h1>{{ producto.titulo }}</h1>
 * <p>{{ producto.descripcion }}</p>
 * ```

 * theme.liquid
 * ```liquid
 * <html>
 *   <head> <meta charset="UTF-8"></meta>
 *    <title>{{ settings.titulo }}</title>
 *   </head>
 *   <body>
 *     {{ content_for_index }}
 *   </body>
 * </html>
 * ```

 * // contexto:
 * {
 *   producto: { titulo: "Camisa", descripcion: "De algodón" },
 *   settings: { titulo: "Mi tienda" }
 * }

 * // resultado final esperado:
 * ```html
 * <html>
 *   <head><title>Mi tienda</title></head>
 *   <body>
 *     <h1>Camisa</h1>
 *     <p>De algodón</p>
 *   </body>
 * </html>
 * ```

 *
 * ✅ Consejo:
 * - Si quieres mantener tu función limpia, considera:
 *    - `renderizarContenido()` → solo para la plantilla
 *    - `inyectarEnLayout(layout: string, content: string, contexto: Record<string, any>)`

 * Este patrón te prepara para proyectos grandes, donde muchas vistas comparten un diseño base común.
 */

import { iniciarServidor } from "../server/slightlyLate.ts";
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";

const plantillaPath = "./content_for_index.liquid"; //
const outputPath = "./dist/index.html";

//  Contexto declarado directamente en `main.ts`
const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" }
};

// **Observar cambios en `content_for_index.liquid`**
async function observarCambios() {
    console.log(" Observando cambios en `content_for_index.liquid`...");

    for await (const evento of Deno.watchFs("./")) {
        if (evento.paths.some((path) => path.endsWith("content_for_index.liquid"))) {
            console.log("\n🔄 Cambio detectado en `content_for_index.liquid`, regenerando HTML...");
            await recargarYGenerarHTML();
        }
    }
}

// **Generar el HTML**
async function recargarYGenerarHTML() {
    try {
        console.clear();

        //  Leer `template.liquid`
        const entradaLiquid = await Deno.readTextFile(plantillaPath);

        //  Procesar la plantilla con el contexto declarado en `main.ts`
        const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
        const arbolDOM = htmlParser(await plantillaRenderizada);
        const htmlFinal = renderDOM(arbolDOM);

        //  Guardar el HTML en `dist/index.html`
        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");
    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
    }
}

// **Ejecutamos el watcher**
await recargarYGenerarHTML(); // Render inicial
observarCambios(); // Monitorea cambios en `template.liquid`

//  Iniciar el servidor una sola vez
iniciarServidor(3000);
