
import { liquidEngine } from "../plantilla_motor/motorDePlantillas.ts";
import { htmlParser } from "../plantilla_motor/parserDehtml.ts";
import { renderDOM } from "../plantilla_motor/renderizador.ts";
import { injector } from "../injector.ts";
import { iniciarServidor } from "./slightlyLate.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";


const plantillaPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/content_for_index.liquid";
const outputPath = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev/dist/index.html";

//  Contexto para la plantilla
const contexto = {
    settings: { titulo: "Mi tienda" },
    producto: { titulo: "Camisa", descripcion: "De algodón" },
};

/* LO DEJO AKI POR SI RROMPO ALGO ESTO HACE RECARGASexport async function observarCambios() {
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

export async function onThemeUpdate(tema) {
    console.log("📦 Procesando tema actualizado...");

    // 📌 1️⃣ Limpiar `themes/dev/` antes de actualizar
    await Deno.remove("themes/dev", { recursive: true }).catch(() => {});
    await Deno.mkdir("themes/dev");

    console.log("🚀 Generando HTML desde la plantilla...");

    // 📌 2️⃣ Generar el HTML y aplicar hot reload
    await recargarYGenerarHTML();

    console.log("✅ Tema actualizado correctamente.");

    return new Response("Tema actualizado con éxito", { status: 200 });
}

// 2️⃣ Activar el servidor para escuchar las solicitudes
iniciarServidor(3000, onThemeUpdate);
