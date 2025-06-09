import { zip } from "jsr:@deno-library/compress";

async function manejarPeticionThemeUpdate(req: Request, callback: (rutaBase: string) => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");

    try {
        // 📥 Leer el cuerpo de la solicitud
        const buffer = await req.arrayBuffer();

        if (!buffer.byteLength) {
            console.error("❌ No se recibió archivo ZIP.");
            return new Response("No se recibió archivo ZIP", { status: 400 });
        }

        const rutaBase = Deno.realPathSync("./server/themes/dev");
        const rutaZip = `${rutaBase}/temp_theme_upload.zip`;
        const cleanZip = `${rutaBase}/clean_theme_upload.zip`;

        // 📦 Guardar el archivo ZIP original
        await Deno.writeFile(rutaZip, new Uint8Array(buffer));
        console.log(`📦 ZIP guardado en: ${rutaZip}`);

        // 🛠️ Limpiar los primeros 153 bytes sospechosos antes de descomprimir
        console.log("🛠️ Corrigiendo el ZIP eliminando los primeros 153 bytes...");
        const rawZip = await Deno.readFile(rutaZip);
        const fixedZip = rawZip.slice(153); // Removemos los bytes extra
        await Deno.writeFile(cleanZip, fixedZip);
        console.log(`✅ ZIP limpio guardado en: ${cleanZip}`);

        // 📦 Descomprimir el ZIP limpio
        console.log("📦 Desempaquetando el ZIP limpio...");
        await zip.uncompress(cleanZip, rutaBase);

        const carpetaEjercicio = `${rutaBase}/ejercicio_26`;
        const archivosPermitidos = ["assets/theme.css", "content_for_index.liquid", "theme.liquid"];

        console.log(`📂 Moviendo archivos específicos desde '${carpetaEjercicio}' a '${rutaBase}'...`);

        for (const archivo of archivosPermitidos) {
          const origen = `${carpetaEjercicio}/${archivo}`;
          const destino = `${rutaBase}/${archivo}`;

        try {
          await Deno.rename(origen, destino);
          console.log(`✅ Movido: ${archivo} → ${destino}`);
        } catch (error) {
          console.log(`⚠️ No se pudo mover ${archivo}, puede que no exista:`, error);
        }
        }

        // 🗑️ Eliminamos la carpeta extra después de mover solo los archivos necesarios
        try {
         await Deno.remove(carpetaEjercicio, { recursive: true });
          console.log("🗑️ Carpeta 'ejercicio_26' eliminada correctamente.");
        } catch {
          console.log("⚠️ No se pudo eliminar 'ejercicio_26/', tal vez ya no existía.");
        }


        console.log("✅ Tema actualizado correctamente.");

        // 🗑️ Eliminar los archivos ZIP después de procesarlos
        await Deno.remove(rutaZip);
        await Deno.remove(cleanZip);
        console.log("🗑️ ZIPs eliminados correctamente.");

        // 🔹 Llamar callback para actualizar la plantilla
        return await callback(rutaBase);

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}


export function iniciarServidor(puerto: number = 3000, callback: (rutaBase: string) => Promise<Response>) {
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
