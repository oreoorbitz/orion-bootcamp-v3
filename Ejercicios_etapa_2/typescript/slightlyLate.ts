export function iniciarServidor(puerto: number = 3000) {
      Deno.serve({ port: puerto }, async (req) => {
        const url = new URL(req.url);
        const path = url.pathname === "/" ? "/index.html" : url.pathname;
        try {
          const archivo = await Deno.readTextFile(`dist${path}`);
          return new Response(archivo, {
            headers: { "Content-Type": "text/html" }
          });
        } catch {
          return new Response("404 - Página no encontrada", { status: 404 });
          }
      });
}
