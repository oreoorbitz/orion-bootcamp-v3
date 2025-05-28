const clients = new Set<WebSocket>();

Deno.serve({ port: 3001 }, (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.onopen = () => {
        clients.add(socket);
        console.log("✅ Cliente WebSocket conectado.");
    };

    socket.onclose = () => {
        clients.delete(socket);
        console.log("🔴 Cliente WebSocket desconectado.");
    };

    socket.onerror = (err) => {
        console.error("❌ Error en WebSocket:", err);
    };

    return response;
});

//  Notificar recarga específica para CSS
export function notificarReloadCSS() {
    console.log(" Enviando señal de recarga de CSS a los clientes WebSocket...");

    if (clients.size === 0) {
        console.warn(" No hay clientes conectados al WebSocket.");
        return;
    }

    for (const client of clients) {
        try {
            const mensaje = JSON.stringify({ type: "reload-css" });
            client.send(mensaje);
            console.log(`📤 Señal enviada a un cliente WebSocket: ${mensaje}`);
        } catch (error) {
            console.error("❌ Error al enviar mensaje de recarga CSS:", error);
        }
    }
}
