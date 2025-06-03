export function iniciarServidor(puerto: number = 3000) {
    Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);
        let path = url.pathname === "/" ? "/index.html" : url.pathname;

        try {
            //  Si la solicitud es para archivos en `assets/`, servirlos directamente
            if (url.pathname.startsWith("/assets")) {
                path = `.${url.pathname}`; // Ajustamos la ruta para que apunte a `assets/`
            } else {
                path = `dist${path}`; // Mantener el comportamiento actual para HTML
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



//Aquí cosas que necesito adaptar
import { iniciarServidor } from "../server/slightlyLate.ts";
import { notificarReloadCSS } from "../server/wsServer.ts";
import { notificarRecargaPagina } from "../server/wsServer.ts";
// **Observar cambios
async function observarCambios() {
    const watcher = Deno.watchFs(["content_for_index.liquid", "theme.liquid", "assets"]);
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

observarCambios(); // Monitorea cambios en archivos
//  **Asegurar que el servidor se inicia correctamente**
iniciarServidor(3000);
