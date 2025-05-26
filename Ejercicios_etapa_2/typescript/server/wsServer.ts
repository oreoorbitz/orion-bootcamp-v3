const clients = new Set<WebSocket>();

Deno.serve({ port: 3001 }, (req) => {
    const { socket, response } = Deno.upgradeWebSocket(req);
    socket.onopen = () => clients.add(socket);
    socket.onclose = () => clients.delete(socket);
    return response;
});

export function notificarReload() {
    console.log("🔄 Enviando señal de recarga a los clientes WebSocket...");
    for (const client of clients) {
        client.send(JSON.stringify({ type: "reload" }));
    }
}
