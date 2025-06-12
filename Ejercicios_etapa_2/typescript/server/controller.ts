import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { notificarRecargaPagina } from "./wsServer.ts";
import { context } from "./contextPlease.ts";

const plantillaPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/templates/content_for_index.liquid";
const outputPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/dist/index.html";

//  Contexto para la plantilla
const contexto = {
    settings: { titulo: "Mi tiendota" },
    producto: { titulo: "Kewpie", descripcion: "De algodón" },
};

export async function recargarYGenerarHTML() {
    try {
        //console.clear();
        console.log("✅ Generando HTML desde la plantilla...");

        const entradaLiquid = await Deno.readTextFile(plantillaPath);
        const plantillaRenderizada = liquidEngine(entradaLiquid, contexto);
        const arbolDOM = htmlParser(await plantillaRenderizada);
        const htmlFinal = renderDOM(arbolDOM);

        await Deno.writeTextFile(outputPath, htmlFinal);
        console.log("\n✅ Archivo `dist/index.html` generado exitosamente.");

        // 🛠️ Inyectar `hotreload.ts` en el HTML antes de recargar
        const tsPath = new URL("./hotreload.ts", import.meta.url).pathname;
        await injector(tsPath, outputPath);
        console.log("\n✅ Hot Reload inyectado correctamente en index.html.");

        // Notificamos a los clientes WebSocket que deben recargar la página
        notificarRecargaPagina();
        console.log(" Señal de recarga enviada a los clientes WebSocket.");

        return "HTML generado correctamente";
    } catch (error) {
        console.error("\n❌ Error al generar el archivo HTML:", error);
        return "Error al generar HTML";
    }
}

export async function onThemeUpdate() {
    // 🎨 Generar HTML sin volver a tocar el ZIP o eliminar la carpeta
    console.log("🎨 Generando HTML desde la plantilla...");
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
