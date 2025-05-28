const link = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
if (!link) {
    console.error("Error: No se encontró un elemento <link rel='stylesheet'> en el HTML.");
} else {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "reload-css") {
            // 🔄 Recarga la hoja de estilos sin recargar toda la página
            const url = new URL(link.href);
            url.searchParams.set("t", Date.now().toString()); // Evita el cache
            link.href = url.toString();
        }
    };
}
