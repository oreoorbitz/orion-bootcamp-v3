
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

async function onThemeUpdate(req: Request) {
    console.log("📦 Recibiendo nuevo tema...");

    // 📌 1️⃣ Extraer el ZIP desde la solicitud
    const formData = await req.formData();
    const archivoZip = formData.get("archivo");

    if (!archivoZip) {
        console.error("❌ No se recibió un archivo ZIP.");
        return new Response("No se recibió archivo ZIP", { status: 400 });
    }

    // 📌 2️⃣ Guardar el ZIP en el servidor
    const rutaZip = "themes/dev/temp_theme.zip";
    await Deno.writeFile(rutaZip, await archivoZip.arrayBuffer());

    console.log("📦 Archivo ZIP guardado, desempaquetando...");

    // 📌 3️⃣ Limpiar `themes/dev/` antes de extraer
    await Deno.remove("themes/dev", { recursive: true }).catch(() => {});
    await Deno.mkdir("themes/dev");

    // 📌 4️⃣ Descomprimir el ZIP en `themes/dev/`
    await decompress(rutaZip, "themes/dev");

    console.log("🚀 Tema actualizado, generando HTML...");

    // 📌 5️⃣ Generar el HTML y inyectar `hotreload.ts`
    await recargarYGenerarHTML();

    // 📌 6️⃣ Borrar el ZIP para mantener limpio el servidor
    await Deno.remove(rutaZip);

    console.log("✅ Tema actualizado correctamente.");

    return new Response("Tema actualizado con éxito", { status: 200 });
}

// 2️⃣ Activar el servidor para escuchar las solicitudes
iniciarServidor(3000, onThemeUpdate);
