import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { context } from "./contextPlease.ts";

function path(stl: string) {
  return new URL(stl, import.meta.url).pathname
}

// Función para ubicar templates fácilmente
function getTemplatePath(nombre: string): string {
  const templatesDir = path("../server/themes/dev/templates/");
  return `${templatesDir}${nombre}.liquid`;
}

// Función para determinar la carpeta de salida según el tipo de template
function getOutputDirectory(templateType: string): string {
  const baseOutputDir = path("../server/themes/dev/dist/");

  if (templateType === "product") {
    return `${baseOutputDir}products/`;
  } else if (templateType === "collection") {
    return `${baseOutputDir}collections/`;
  } else {
    return baseOutputDir;
  }
}

// Función para generar el nombre del archivo de salida
function getOutputFileName(templateType: string, itemHandle?: string): string {
  if (templateType === "content_for_index") {
    return "content_for_index.html";
  } else if (templateType === "product" && itemHandle) {
    return `${itemHandle}.html`;
  } else if (templateType === "collection" && itemHandle) {
    return `${itemHandle}.html`;
  } else {
    return `${templateType}.html`;
  }
}

const layoutPath = path("../server/themes/dev/layout/theme.liquid");

// 🎯 FUNCIÓN CORREGIDA: Función para generar HTML con template_type en contexto
async function generarHTMLDeTemplate(templateName: string, itemHandle?: string): Promise<string> {
    try {
        console.log(`✅ Generando HTML para template: ${templateName}${itemHandle ? ` (${itemHandle})` : ''}`);

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

        // 🔧 4. Crear el contexto específico para este template CON template_type
        let templateContext = {
            ...context,
            template_type: templateName  // 🎯 Agregar template_type al contexto
        };

        // Si es un template de producto, agregar el producto específico
        if (templateName === "product" && itemHandle) {
            const product = context.products?.find(p => p.handle === itemHandle);
            if (product) {
                templateContext = {
                    ...context,
                    product: product,
                    template_type: 'product'  // 🎯 Especificar que es un template de producto
                };
            }
        }

        // Si es un template de colección, agregar la colección específica
        if (templateName === "collection" && itemHandle) {
            const collection = context.collections?.find(c => c.handle === itemHandle);
            if (collection) {
                templateContext = {
                    ...context,
                    collection: collection,
                    template_type: 'collection'  // 🎯 Especificar que es un template de colección
                };
            }
        }

        // 5. Renderizar la plantilla de contenido con el contexto
        const renderedContent = await liquidEngine(templateContent, templateContext);

        // 6. Crear un nuevo contexto que incluya el contenido renderizado
        const layoutContext = {
            ...templateContext,
            content_for_layout: renderedContent
        };

        // 7. Leer el layout
        const layoutContent = await Deno.readTextFile(layoutPath);

        // 8. Renderizar el layout con el contexto que incluye content_for_layout
        const finalTemplate = await liquidEngine(layoutContent, layoutContext);

        // 9. Procesar el HTML final
        const arbolDOM = htmlParser(finalTemplate);
        const htmlFinal = renderDOM(arbolDOM);

        // 10. Determinar la carpeta y nombre del archivo de salida
        const outputDirectory = getOutputDirectory(templateName);
        const outputFileName = getOutputFileName(templateName, itemHandle);
        const outputPath = `${outputDirectory}${outputFileName}`;

        // 11. Asegurar que la carpeta de salida existe
        try {
            await Deno.stat(outputDirectory);
        } catch {
            console.log(`📂 Creando carpeta: ${outputDirectory}`);
            await Deno.mkdir(outputDirectory, { recursive: true });
        }

        // 12. Escribir el archivo final
        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log(`✅ Archivo ${outputFileName} generado exitosamente en ${outputDirectory}`);

        // 13. Inyectar `hotreload.ts` en el HTML
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputPath);
        console.log(`✅ Hot Reload inyectado correctamente en ${outputFileName}.`);

        return `HTML generado correctamente para ${templateName}${itemHandle ? ` (${itemHandle})` : ''}`;
    } catch (error) {
        console.error(`❌ Error al generar HTML para ${templateName}:`, error);
        return `Error al generar HTML para ${templateName}`;
    }
}

// Función para generar páginas de productos
async function generarPaginasDeProductos(): Promise<string[]> {
    const resultados: string[] = [];

    // Verificar si existe el template product.liquid
    try {
        const productTemplatePath = getTemplatePath("product");
        await Deno.stat(productTemplatePath);

        if (context.products && Array.isArray(context.products)) {
            console.log(`🛍️ Generando ${context.products.length} páginas de productos...`);

            for (const product of context.products) {
                console.log(`🔄 Generando página para producto: ${product.handle}`);
                const resultado = await generarHTMLDeTemplate("product", product.handle);
                resultados.push(resultado);
            }
        } else {
            console.log("⚠️ No se encontraron productos en el contexto");
        }
    } catch {
        console.log("⚠️ No se encontró template product.liquid");
    }

    return resultados;
}

// Función para generar páginas de colecciones
async function generarPaginasDeColecciones(): Promise<string[]> {
    const resultados: string[] = [];

    // Verificar si existe el template collection.liquid
    try {
        const collectionTemplatePath = getTemplatePath("collection");
        await Deno.stat(collectionTemplatePath);

        if (context.collections && Array.isArray(context.collections)) {
            console.log(`📂 Generando ${context.collections.length} páginas de colecciones...`);

            for (const collection of context.collections) {
                console.log(`🔄 Generando página para colección: ${collection.handle}`);
                const resultado = await generarHTMLDeTemplate("collection", collection.handle);
                resultados.push(resultado);
            }
        } else {
            console.log("⚠️ No se encontraron colecciones en el contexto");
        }
    } catch {
        console.log("⚠️ No se encontró template collection.liquid");
    }

    return resultados;
}

// Función para regenerar todos los templates
async function regenerarTodosLosTemplates(): Promise<string> {
    try {
        console.log("🔄 Regenerando todos los templates...");

        const resultados: string[] = [];

        // 1. Regenerar content_for_index (template principal)
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

        // 3. Generar páginas de productos
        console.log("🛍️ Generando páginas de productos...");
        const resultadosProductos = await generarPaginasDeProductos();
        resultados.push(...resultadosProductos);

        // 4. Generar páginas de colecciones
        console.log("📂 Generando páginas de colecciones...");
        const resultadosColecciones = await generarPaginasDeColecciones();
        resultados.push(...resultadosColecciones);

        // 5. Notificar recarga de página
        notificarRecargaPagina();
        console.log("📤 Señal de recarga enviada a los clientes WebSocket.");

        return `Templates regenerados: ${resultados.length} archivos generados`;
    } catch (error) {
        console.error("❌ Error al regenerar templates:", error);
        return "Error al regenerar templates";
    }
}

// Función legacy para mantener compatibilidad
export async function recargarYGenerarHTML() {
    return await generarHTMLDeTemplate("content_for_index");
}

export async function onThemeUpdate(changedTemplate?: string) {
    let resultado: string;

    if (changedTemplate) {
        // Se cambió un template específico, regenerar según el tipo
        const templateName = changedTemplate.replace('.liquid', '');

        if (templateName === "content_for_index" || templateName === "404") {
            console.log(`🎨 Regenerando template específico: ${templateName}`);
            resultado = await generarHTMLDeTemplate(templateName);
        } else if (templateName === "product") {
            console.log(`🛍️ Regenerando todas las páginas de productos...`);
            const resultadosProductos = await generarPaginasDeProductos();
            resultado = `Páginas de productos regeneradas: ${resultadosProductos.length}`;
        } else if (templateName === "collection") {
            console.log(`📂 Regenerando todas las páginas de colecciones...`);
            const resultadosColecciones = await generarPaginasDeColecciones();
            resultado = `Páginas de colecciones regeneradas: ${resultadosColecciones.length}`;
        } else {
            console.log(`⚠️ Template ${templateName} no reconocido, regenerando todos`);
            resultado = await regenerarTodosLosTemplates();
        }
    } else {
        // Cambios generales (layout, assets, etc), regenerar todos
        console.log("🎨 Regenerando todos los templates...");
        resultado = await regenerarTodosLosTemplates();
    }

    console.log("✅ Tema actualizado correctamente.");
    return new Response(resultado, { status: 200 });
}

// Activar el servidor para escuchar las solicitudes
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
