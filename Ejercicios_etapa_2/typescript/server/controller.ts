import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { caminoExiste, crearDirectorioSiNoExiste } from "./utils/utils.ts";

const plantillaPath = new URL("./themes/dev/content_for_index.liquid", import.meta.url).pathname;
const outputPath = new URL('./themes/dev/dist/', import.meta.url).pathname;

const fileMap: Record<string, string> = {
    [plantillaPath]: `${outputPath}/index.html`,
};

const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" },
};

export async function recargarYGenerarHTML() {
    try {
        if( !(await caminoExiste(plantillaPath))) {
            console.error("❌ Plantilla no encontrada, abortando.");
            return new Response("Plantilla no encontrada", { status: 404 });
        }

        const liquidTemplate = await Deno.readTextFile(plantillaPath);
        if(liquidTemplate?.trim === "") {
            console.error("❌ Plantilla vacía, abortando.");
            return new Response("Plantilla vacía", { status: 400 });
        }
            
        const renderedTemplate =  await liquidEngine(liquidTemplate, contexto);
        
        const domTree = await htmlParser(renderedTemplate);
        const finalHTML = await renderDOM(domTree);

        const outputFilePath = fileMap[plantillaPath];

        await crearDirectorioSiNoExiste(outputPath);

        await Deno.writeTextFile(outputFilePath, finalHTML);

        return new Response("Recargando y generando HTML...", { status: 200 });
    } catch (error) {

    }

    /*
        console.log("✅ Generando HTML desde la plantilla...");

        console.log( await caminoExiste(plantillaPath) ? "✅ Plantilla encontrada." : "❌ Plantilla no encontrada, abortando.");

        const entradaLiquid = await Deno.readTextFile(plantillaPath);
        const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
        const arbolDOM = htmlParser(await plantillaRenderizada);
        const htmlFinal = renderDOM(arbolDOM);

        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

        // Inyectar `hotreload.ts` en el HTML
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputPath);
        console.log("\n✅ Hot Reload inyectado correctamente en index.html.");

        return "HTML generado correctamente";
    */
}

export async function onThemeUpdate(rutaBase: string) {
    console.log("📦 Procesando tema actualizado desde:", rutaBase);

    // 🎨 Generar HTML sin volver a tocar el ZIP o eliminar la carpeta
    console.log("🎨 Generando HTML desde la plantilla...");
    const resultado = await recargarYGenerarHTML();

    console.log("✅ Tema actualizado correctamente.");
    return new Response(resultado, { status: 200 });
}

// 2️⃣ Activar el servidor para escuchar las solicitudes
iniciarServidor(3002, onThemeUpdate);


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
