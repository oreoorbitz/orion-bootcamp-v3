import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { context } from "./contextPlease.ts";

<<<<<<< HEAD

const plantillaPath = new URL("./themes/dev/templates/content_for_index.liquid", import.meta.url).pathname;
const layoutPath = new URL("./themes/dev/layout/theme.liquid", import.meta.url).pathname;
const outputPath = new URL("./themes/dev/dist/index.html", import.meta.url).pathname;
=======
function path(stl: string) {
  return new URL(stl, import.meta.url).pathname

}

const templatePath = path("../server/themes/dev/templates/content_for_index.liquid");
const layoutPath = path("../server/themes/dev/layout/theme.liquid");
const outputPath = path("../server/themes/dev/dist/index.html");
>>>>>>> Paola

export async function recargarYGenerarHTML() {
    try {
        console.log("✅ Generando HTML desde la plantilla...");
        // 1. Leer la plantilla de contenido
        const templateContent = await Deno.readTextFile(templatePath);

<<<<<<< HEAD
        // 🔁 Aquí podemos cambiar dinámicamente la ruta del template
        const rutaTemplate = new URL("./themes/dev/templates/content_for_index.liquid", import.meta.url).pathname;
        const entradaLiquid = await Deno.readTextFile(rutaTemplate);

        // 👇 Renderizamos sin layout (solo el contenido de la página)
        const contenidoRenderizado = await liquidEngine(entradaLiquid, context, false);

        // 👇 Lo pasamos al layout usando la nueva variable estándar
        const htmlFinal = await liquidEngine(contenidoRenderizado, { ...context, content_for_layout: contenidoRenderizado }, true);

        const arbolDOM = htmlParser(htmlFinal);
        const htmlRenderizado = renderDOM(arbolDOM);

        await Deno.writeTextFile(outputPath, htmlRenderizado);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

=======
        // 2. Renderizar la plantilla de contenido con el contexto actual
        const renderedContent = await liquidEngine(templateContent, context); // false = no aplicar layout todavía

        // 3. Crear un nuevo contexto que incluya el contenido renderizado
        const layoutContext = {
            ...context,
            content_for_layout: renderedContent
        };

        // 4. Leer el layout
        const layoutContent = await Deno.readTextFile(layoutPath);

        // 5. Renderizar el layout con el contexto que incluye content_for_layout
        const finalTemplate = await liquidEngine(layoutContent, layoutContext);

        // 6. Procesar el HTML final
        const arbolDOM = htmlParser(finalTemplate);
        const htmlFinal = renderDOM(arbolDOM);

        // 7. Escribir el archivo final
        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

        // 8. Inyectar `hotreload.ts` en el HTML antes de recargar
>>>>>>> Paola
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputPath);
        console.log("\n✅ Hot Reload inyectado correctamente en index.html.");

<<<<<<< HEAD
=======
        // 9. Notificar a los clientes WebSocket que deben recargar la página
>>>>>>> Paola
        notificarRecargaPagina();
        console.log(" Señal de recarga enviada a los clientes WebSocket.");

        return "HTML generado correctamente";
    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
        return "Error al generar HTML";
    }
}

export async function onThemeUpdate() {
    // 🎨 Generar HTML combinando template + layout
    console.log("🎨 Generando HTML combinando template + layout...");
    const resultado = await recargarYGenerarHTML();

    console.log("✅ Tema actualizado correctamente.");
    return new Response(resultado, { status: 200 });
}

// 2️⃣ Activar el servidor para escuchar las solicitudes
iniciarServidor(3000, onThemeUpdate);


/* LO DEJO AKI POR SI RROMPO ALGO ESTO HACE RECARGAS
export async function observarCambios() {
    const watcher = Deno.watchFs([
        "typescript/ejercicio_26/content_for_index.liquid",
        "typescript/ejercicio_26/theme.liquid",
        "typescript/ejercicio_26/assets"
    ]);

    for await (const event of watcher) {
        console.log(`🔄 Archivo(s) modificado(s): ${event.paths.join(", ")}`);

        if (event.paths.some((path) => path.endsWith(".css"))) {
            console.log("🔄 Cambios en CSS detectados, recargando estilos...");
            notificarReloadCSS();
        } else {
            console.log("🔄 Cambio en la plantilla detectado, recargando página...");
            await recargarYGenerarHTML();
            notificarRecargaPagina();
        }
    }
} */
