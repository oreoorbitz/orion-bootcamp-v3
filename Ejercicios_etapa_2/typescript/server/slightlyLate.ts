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
