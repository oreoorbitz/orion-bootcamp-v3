import { onThemeUpdate } from "./controller.ts";
import { multiparser } from "https://deno.land/x/multiparser@v2.0.1/mod.ts";
import { decompress } from "https://deno.land/x/zip@v1.2.5/mod.ts";

async function manejarPeticionThemeUpdate(req: Request) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");

    try {
        const form = await multiparser(req);
        const archivoZip = form.files?.theme;

        if (!archivoZip) {
            console.error("❌ No se recibió archivo ZIP.");
            return new Response("No se recibió archivo ZIP", { status: 400 });
        }

        const rutaZip = "themes/dev/temp_theme_upload.zip";
        await Deno.writeFile(rutaZip, await Deno.readFile(archivoZip.filepath));

        console.log("✅ Archivo guardado en el servidor.");

        // Llamamos a la función de procesamiento para actualizar el tema
        return await procesarTema(rutaZip);
    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

async function procesarTema(rutaZip: string) {
    console.log("📦 Desempaquetando el ZIP...");
    await decompress(rutaZip, "themes/dev");

    console.log("✅ Tema actualizado correctamente.");
    await Deno.remove(rutaZip);

    // Enviar la ruta del ZIP al callback de controller.ts
    return await onThemeUpdate();
}

export function iniciarServidor(puerto: number = 3000) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req);
        }

        let path = url.pathname === "/" ? "themes/dev/dist/index.html" : `themes/dev/dist${url.pathname}`;
        console.log(`📂 Intentando servir archivo: ${path}`);

        try {
            if (url.pathname.startsWith("/assets")) {
                path = `themes/dev${url.pathname}`;
            }

            const archivo = await Deno.readTextFile(path);
            return new Response(archivo, {
                headers: {
                    "Content-Type": path.endsWith(".css") ? "text/css" : "text/html"
                }
            });
        } catch {
            return new Response("404 - Página no encontrada", { status: 404 });
        }
    });
}
