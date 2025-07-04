import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { context } from "./contextPlease.ts";
import { router } from "./router.ts";
import { ThemeUpdateData } from "./types.ts";

function path(stl: string) {
  return new URL(stl, import.meta.url).pathname

}

function getTemplatePath(templateName: string) {
    const templatePath = path(`../server/themes/dev/templates/${templateName}.liquid`);
    return templatePath;
}

function liquidToHtmlPath(templateName: string) {
    const templatePath = path(`../server/themes/dev/dist/${templateName}.html`);
    return templatePath;
}

const layoutPath = path("../server/themes/dev/layout/theme.liquid");

export async function recargarYGenerarHTML(data: ThemeUpdateData) {
    try {
        const { carpetaGuardado, tipoExtension, nombre } = data;

        const templatePath = getTemplatePath(nombre);


        console.log("✅ Generando HTML desde la plantilla...");
        // 1. Leer la plantilla de contenido
        const templateContent = await Deno.readTextFile(templatePath);

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

        const outputHtmlPath = liquidToHtmlPath(nombre);

        // 7. Escribir el archivo final
        await Deno.writeTextFile(outputHtmlPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

        // 8. Inyectar `hotreload.ts` en el HTML antes de recargar
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputHtmlPath);
        console.log("\n✅ Hot Reload inyectado correctamente en index.html.");

        // 9. Notificar a los clientes WebSocket que deben recargar la página
        notificarRecargaPagina();
        console.log(" Señal de recarga enviada a los clientes WebSocket.");

        return "HTML generado correctamente";
    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
        return "Error al generar HTML";
    }
}

export async function onThemeUpdate(data: ThemeUpdateData) {
    // 🎨 Generar HTML combinando template + layout
    console.log("🎨 Generando HTML combinando template + layout...");
    const resultado = await recargarYGenerarHTML(data);

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
