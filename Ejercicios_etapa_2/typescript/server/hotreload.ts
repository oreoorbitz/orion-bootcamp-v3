const socket = new WebSocket("ws://localhost:3001");
console.log("✅ WebSocket conectado.");

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("🔄 Recibido mensaje de recarga:", data);

    if (data.type === "reload") {
        console.log("🚀 Recargando página automáticamente...");
        window.location.reload();
    }
};
