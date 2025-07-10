import { zip } from "jsr:@deno-library/compress";
import { notificarReloadCSS } from "./wsServer.ts";
import { router } from "./router.ts";

async function manejarPeticionThemeUpdate(req: Request, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");
    const rutaTema = `./server/themes/dev`;

    try {
        const formulario = await req.formData()
        const archivo = formulario.get("archivo") as File
        const carpetaGuardado = formulario.get("carpeta") as string
        const tipoExtension = formulario.get("tipoExtension") as string
        const templateEspecifico = formulario.get("templateEspecifico") as string
        const templateNombre = formulario.get("templateNombre") as string // ✨ NUEVO

        const buffer = await archivo.arrayBuffer()
        const uint = new Uint8Array(buffer)
        const nombre = archivo.name
        const rutaZip = `${rutaTema}/${nombre}.zip`;
        const rutaDestino = carpetaGuardado === "assets"
            ? `${rutaTema}/dist/${carpetaGuardado}`
            : `${rutaTema}/${carpetaGuardado}`;

        await Deno.writeFile(rutaZip, uint)

        // 📂 Asegurar que la carpeta existe antes de continuar
        try {
            await Deno.stat(rutaDestino);
        } catch {
            console.log(`📂 La carpeta ${rutaDestino} no existe, creándola...`);
            await Deno.mkdir(rutaDestino, { recursive: true });
        }

        // 📦 Descomprimiendo el ZIP en la ruta correcta
        console.log(`📦 Desempaquetando el ZIP en: ${rutaDestino}`);
        await zip.uncompress(rutaZip, rutaDestino);

        // Si el archivo es `.css`, enviamos la señal de recarga de estilos
        if (tipoExtension == "css") {
            notificarReloadCSS();
            console.log("📤 Señal de recarga de CSS enviada a los clientes WebSocket.");
        }

        // 🗑️ Ahora eliminamos zip
        try {
            await Deno.remove(rutaZip, { recursive: true });
            console.log(`La carpeta ${rutaZip} ha sido eliminada correctamente.`);
        } catch {
            console.log(`La carpeta ${rutaZip} no ha podido ser eliminada o no existía`);
        }

        console.log("antes del callback")

        // ✨ NUEVO: Pasar el nombre del template específico al callback
        let changedTemplate: string | undefined;
        if (templateEspecifico === "true" && templateNombre) {
            changedTemplate = templateNombre;
            console.log(`🎯 Template específico detectado: ${changedTemplate}`);
        }

        return await callback(changedTemplate);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: (changedTemplate?: string) => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        // 🎯 Determinar qué archivo servir desde themes/dev/dist/
        let filePath: string;

        if (url.pathname === "/") {
            filePath = "server/themes/dev/dist/content_for_index.html";
        } else if (url.pathname === "/theme.css") {
            filePath = "server/themes/dev/dist/theme.css";
        } else if (url.pathname.startsWith("/assets/")) {
           const assetName = url.pathname.replace("/assets/", "");
           filePath = `server/themes/dev/dist/assets/${assetName}`;
        } else {
            // Usar el router para resolver todas las rutas
            const routeResult = router.resolve(url.pathname);

            if (routeResult) {
                if (routeResult.directory && routeResult.handle) {
                    // Ruta dinámica (product/collection)
                    filePath = `server/themes/dev/dist/${routeResult.directory}/${routeResult.handle}.html`;
                } else {
                    // Ruta estática (content_for_index)
                    filePath = `server/themes/dev/dist/${routeResult.type}.html`;
                }
            } else {
                // Si no se encuentra, servir 404.html directamente
                console.log(`❌ Ruta no encontrada: ${url.pathname}`);

                try {
                    const archivo404 = await Deno.readTextFile("server/themes/dev/dist/404.html");
                    return new Response(archivo404, {
                        status: 404,
                        headers: { "Content-Type": "text/html" }
                    });
                } catch {
                    // Si no existe 404.html, devolver mensaje básico
                    return new Response("404 - Página no encontrada", {
                        status: 404,
                        headers: { "Content-Type": "text/html" }
                    });
                }
            }
        }

        console.log(`📂 Intentando servir archivo: ${filePath}`);

        try {
            const archivo = await Deno.readTextFile(filePath);

            // Determinar el Content-Type
            const contentType = filePath.endsWith(".css") ? "text/css" : "text/html";

            return new Response(archivo, {
                headers: { "Content-Type": contentType }
            });

        } catch (error) {
            console.log(`❌ Archivo no encontrado: ${filePath}`);

            // 🎯 Intentar servir 404.html desde themes/dev/dist/
            try {
                const archivo404 = await Deno.readTextFile("server/themes/dev/dist/404.html");
                return new Response(archivo404, {
                    status: 404,
                    headers: { "Content-Type": "text/html" }
                });
            } catch {
                // Si no existe 404.html, devolver mensaje básico
                return new Response("404 - Página no encontrada", {
                    status: 404,
                    headers: { "Content-Type": "text/html" }
                });
            }
        }
    });
}
