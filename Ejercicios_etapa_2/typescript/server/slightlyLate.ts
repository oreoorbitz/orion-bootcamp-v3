import { zip } from "jsr:@deno-library/compress";

async function manejarPeticionThemeUpdate(req: Request, callback: (rutaBase: string) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");

    try {
        // 📥 Leer el cuerpo de la solicitud directamente
        const buffer = await req.arrayBuffer();

        if (!buffer.byteLength) {
            console.error("❌ No se recibió archivo ZIP.");
            return new Response("No se recibió archivo ZIP", { status: 400 });
        }

        const rutaBase = "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_2/typescript/server/themes/dev";
        const carpetaEjercicio = `${rutaBase}/ejercicio_26`;
        const rutaZip = `${rutaBase}/temp_theme_upload.zip`;

        // 📂 Asegurar que la carpeta `themes/dev/` existe antes de continuar
        try {
            await Deno.stat(rutaBase);
            console.log('siempre corro yo?')
        } catch {
            console.log("📂 La carpeta 'themes/dev' no existe, creándola...");
            await Deno.mkdir(rutaBase, { recursive: true });
        }

        // 📦 Guardamos el archivo ZIP en la ruta correcta
        await Deno.writeFile(rutaZip, new Uint8Array(buffer));

        console.log("📦 Desempaquetando el ZIP...");
        await zip.uncompress(rutaZip, rutaBase);


        // 🔄 Mover archivos importantes fuera de `ejercicio_26/` antes de eliminarla

        const archivosImportantes = ["content_for_index.liquid", "theme.liquid"];
        const carpetaAssets = "assets";

        for (const archivo of archivosImportantes) {
            const origen = `${carpetaEjercicio}/${archivo}`;
            const destino = `${rutaBase}/${archivo}`;

            try {
                await Deno.rename(origen, destino);
                console.log(`📂 Movido: ${archivo} → ${destino}`);
            } catch {
                console.log(`⚠️ No se encontró ${archivo} dentro de 'ejercicio_26/', omitiendo.`);
            }
        }

        // 🔄 Mover `assets/` fuera de `ejercicio_26/`
        try {
            await Deno.rename(`${carpetaEjercicio}/${carpetaAssets}`, `${rutaBase}/${carpetaAssets}`);
            console.log(`📂 Carpeta 'assets/' movida correctamente.`);
        } catch {
            console.log(`⚠️ No se encontró la carpeta 'assets/' dentro de 'ejercicio_26/', omitiendo.`);
        }

        // 🗑️ Ahora eliminamos `ejercicio_26/`
        try {
            await Deno.remove(carpetaEjercicio, { recursive: true });
            console.log("🗑️ Carpeta 'ejercicio_26' eliminada correctamente.");
        } catch {
            console.log("⚠️ No se pudo eliminar 'ejercicio_26/', tal vez ya no existía.");
        }

        console.log("✅ Tema actualizado correctamente.");

        // 🗑️ Eliminar el ZIP después de descomprimirlo
        try {
        await Deno.remove(carpetaEjercicio, { recursive: true });
        console.log("🗑️ Carpeta 'ejercicio_26' eliminada correctamente.");
        } catch {
        console.log("⚠️ No se pudo eliminar 'ejercicio_26/', tal vez ya no existía o fue movida previamente.");
        }

        // 🔹 Pasamos la ruta base a `onThemeUpdate()` para que solo regenere el HTML
        return await callback(rutaBase);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: (rutaZip: string) => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
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
