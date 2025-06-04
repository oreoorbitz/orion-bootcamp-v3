
import { notificarReloadCSS } from "../server/wsServer.ts";
import { notificarRecargaPagina } from "../server/wsServer.ts";
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";

const plantillaPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/content_for_index.liquid";
const outputPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/dist/index.html";

//  Contexto para la plantilla
const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" },
};

// **Observar cambios
async function observarCambios() {
    const watcher = Deno.watchFs([
    "themes/dev/content_for_index.liquid",
    "themes/dev/theme.liquid",
    "themes/dev/assets"
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
}

export async function recargarYGenerarHTML() {
    try {
        console.clear();
        console.log("✅ Generando HTML desde la plantilla...");

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
    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
        return "Error al generar HTML";
    }
}


await recargarYGenerarHTML(); //Para probar que genera index.html
observarCambios(); // Monitorea cambios en archivos
//  **Asegurar que el servidor se inicia correctamente**
iniciarServidor(3000);
