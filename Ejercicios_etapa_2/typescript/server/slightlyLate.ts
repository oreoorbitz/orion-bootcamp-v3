import { zip } from "jsr:@deno-library/compress";
import { notificarReloadCSS } from "./wsServer.ts";

async function manejarPeticionThemeUpdate(req: Request, callback:() => Promise<Response>) {
    console.log("✅ Petición recibida en `/theme-update`, procesando ZIP...");
    const rutaTema = `./server/themes/dev`;


    try {
      const formulario = await req.formData()
      const archivo = formulario.get("archivo") as File
      const carpetaGuardado = formulario.get("carpeta") as String
      const buffer = await archivo.arrayBuffer()
      const uint = new Uint8Array(buffer)
      const nombre = archivo.name
      const tipoExtension = formulario.get("tipoExtension")
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

        //Si el archivo es `.css`, enviamos la señal de recarga de estilos
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
        return await callback();

    } catch (error) {
        console.error("❌ Error procesando el tema:", error);
        return new Response("Error procesando el tema", { status: 500 });
    }
}

export function iniciarServidor(puerto: number = 3000, callback: () => Promise<Response>) {
    console.log(`✅ Servidor iniciado en http://localhost:${puerto}/`);

    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            return await manejarPeticionThemeUpdate(req, callback);
        }

        let path = url.pathname === "/" ? "server/themes/dev/dist/index.html" : `server/themes/dev/dist/${url.pathname}`;
        console.log(`📂 Intentando servir archivo: ${path}`);

        try {
            if (url.pathname.startsWith("/assets")) {
              path = `server/themes/dev/dist${url.pathname}`;
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
