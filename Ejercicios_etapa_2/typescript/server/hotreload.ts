const link = document.querySelector('link[rel="stylesheet"]') as HTMLLinkElement;
   if (!link) {
    console.error("Error: No se encontró un elemento <link rel='stylesheet'> en el HTML.");
    } else {
    const socket = new WebSocket("ws://localhost:3001");

        socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // 🔄 Si el servidor envía "reload-css", actualizamos estilos sin recargar la página
        if (data.type === "reload-css") {
            console.log("🔄 Recargando estilos CSS...");
            const url = new URL(link.href);
            url.searchParams.set("t", Date.now().toString()); // Fuerza actualización de CSS
            link.href = url.toString();
        }

        // 🔄 Si el servidor envía "reload", recargamos toda la página
        if (data.type === "reload") {
            console.log("🔄 Recargando página por cambios en `.liquid`...");
            location.reload();
        }
    };
}
