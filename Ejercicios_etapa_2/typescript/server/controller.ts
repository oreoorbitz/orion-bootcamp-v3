import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { context } from "./contextPlease.ts";
import { router } from "./router.ts";

function path(stl: string) {
  return new URL(stl, import.meta.url).pathname
}

// Función para ubicar templates fácilmente
function getTemplatePath(nombre: string): string {
  const templatesDir = path("../server/themes/dev/templates/");
  return `${templatesDir}${nombre}.liquid`;
}

const templatesDir = path("../server/themes/dev/templates/");
const layoutPath = path("../server/themes/dev/layout/theme.liquid");
const outputDir = path("../server/themes/dev/dist/");

// Función para generar HTML de un template específico
async function generarHTMLDeTemplate(templateName: string): Promise<string> {
    try {
        console.log(`✅ Generando HTML para template: ${templateName}`);

        // 1. Obtener la ruta del template
        const templatePath = getTemplatePath(templateName);

        // 2. Verificar que el template existe
        try {
            await Deno.stat(templatePath);
        } catch {
            if (templateName === "404") {
                console.log(`❌ Template 404 no encontrado`);
                return "Template 404 no encontrado";
            }
            console.log(`❌ Template ${templateName} no encontrado, usando 404`);
            return await generarHTMLDeTemplate("404");
        }

        // 3. Leer la plantilla de contenido
        const templateContent = await Deno.readTextFile(templatePath);

        // 4. Renderizar la plantilla de contenido con el contexto actual
        const renderedContent = await liquidEngine(templateContent, context);

        // 5. Crear un nuevo contexto que incluya el contenido renderizado
        const layoutContext = {
            ...context,
            content_for_layout: renderedContent
        };

        // 6. Leer el layout
        const layoutContent = await Deno.readTextFile(layoutPath);

        // 7. Renderizar el layout con el contexto que incluye content_for_layout
        const finalTemplate = await liquidEngine(layoutContent, layoutContext);

        // 8. Procesar el HTML final
        const arbolDOM = htmlParser(finalTemplate);
        const htmlFinal = renderDOM(arbolDOM);

        // 9. Determinar el nombre del archivo de salida
        const outputFileName = templateName === "content_for_index" ? "content_for_index.html" : `${templateName}.html`;
        const outputPath = `${outputDir}${outputFileName}`;

        // 10. Escribir el archivo final
        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log(`✅ Archivo ${outputFileName} generado exitosamente.`);

        // 11. Inyectar `hotreload.ts` en el HTML
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputPath);
        console.log(`✅ Hot Reload inyectado correctamente en ${outputFileName}.`);

        return `HTML generado correctamente para ${templateName}`;
    } catch (error) {
        console.error(`❌ Error al generar HTML para ${templateName}:`, error);
        return `Error al generar HTML para ${templateName}`;
    }
}

// 🎯 Función para regenerar los templates básicos (content_for_index y 404)
async function regenerarTodosLosTemplates(): Promise<string> {
    try {
        console.log("🔄 Regenerando templates básicos...");

        // 1. Regenerar content_for_index (template principal)
        const resultados = [];
        console.log("📋 Regenerando content_for_index...");
        const resultadoIndex = await generarHTMLDeTemplate("content_for_index");
        resultados.push(resultadoIndex);

        // 2. Regenerar 404 si existe
        try {
            const template404Path = getTemplatePath("404");
            await Deno.stat(template404Path);
            console.log("📄 Regenerando template 404...");
            const resultado404 = await generarHTMLDeTemplate("404");
            resultados.push(resultado404);
        } catch {
            console.log("⚠️ No se encontró template 404.liquid");
        }

        // 3. Notificar recarga de página
        notificarRecargaPagina();
        console.log("📤 Señal de recarga enviada a los clientes WebSocket.");

        return `Templates regenerados: content_for_index, 404`;
    } catch (error) {
        console.error("❌ Error al regenerar templates:", error);
        return "Error al regenerar templates";
    }
}

//  Función legacy para mantener compatibilidad
export async function recargarYGenerarHTML() {
    // Usar el router para obtener el template de la ruta raíz
    const templateName = router.resolve("/") || "content_for_index";
    return await generarHTMLDeTemplate(templateName);
}

export async function onThemeUpdate(changedTemplate?: string) {
    let resultado: string;

    if (changedTemplate) {
        // 🎯 Se cambió un template específico, regenerar solo ese
        const templateName = changedTemplate.replace('.liquid', '');

        // Solo procesamos content_for_index o 404
        if (templateName === "content_for_index" || templateName === "404") {
            console.log(`🎨 Regenerando template específico: ${templateName}`);
            resultado = await generarHTMLDeTemplate(templateName);
        } else {
            console.log(`⚠️ Template ${templateName} no reconocido, regenerando todos`);
            resultado = await regenerarTodosLosTemplates();
        }
    } else {
        // 🎯 Cambios generales (layout, assets, etc), regenerar todos
        console.log("🎨 Regenerando todos los templates...");
        resultado = await regenerarTodosLosTemplates();
    }

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
