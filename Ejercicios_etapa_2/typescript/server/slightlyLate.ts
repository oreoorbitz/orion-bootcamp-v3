import { recargarYGenerarHTML } from "./controller.ts";
export function iniciarServidor(puerto: number = 3000) {
  console.log(`✅ Servidor iniciado en http://localhost:${puerto}/ `);

  Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);

        if (req.method === "POST" && url.pathname === "/theme-update") {
            console.log("✅ Petición recibida en `/theme-update`, generando HTML...");
            const resultado = await recargarYGenerarHTML();
            return new Response(resultado, { status: 200 });
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
