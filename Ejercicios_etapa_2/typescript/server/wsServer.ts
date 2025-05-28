const clients = new Set<WebSocket>();

Deno.serve({ port: 3001 }, (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.onopen = () => clients.add(socket);
    socket.onclose = () => clients.delete(socket);
    return response;
});

//Monitoreo de cambios en `assets/`
export async function watchCSSChanges() {
    for await (const eventoDetectado of Deno.watchFs("assets")) {
        for (const cambio of eventoDetectado.paths) {
            if (cambio.endsWith(".css")) {
                console.log(`🔄 Archivo CSS modificado: ${cambio}`);
                notificarReloadCSS(); // Enviar señal de recarga solo para CSS
            }
        }
    }
}

// Notificar recarga específica para CSS
export function notificarReloadCSS() {
    console.log(" Enviando señal de recarga de CSS a los clientes WebSocket...");
    for (const client of clients) {
        client.send(JSON.stringify({ type: "reload-css" }));
    }
}
