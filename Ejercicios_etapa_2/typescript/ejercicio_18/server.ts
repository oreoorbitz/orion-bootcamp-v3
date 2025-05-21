Deno.serve({ port: 3000 }, async (req) => {
      try {
        const html = await Deno.readTextFile("dist/index.html");
        return new Response(html, {
          headers: { "Content-Type": "text/html" }
        });
      } catch {
        return new Response("404 - Página no encontrada", { status: 404 });
        }
});
