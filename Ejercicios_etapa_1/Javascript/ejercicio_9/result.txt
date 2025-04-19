// @ts-check

/**
 * Simula una Promesa que representa la llegada de un paquete.
 * Esta promesa puede resolverse (llegó bien) o rechazarse (se perdió o fue dañada).
 */
export const paquete = new Promise((resolve, reject) => {
    const tiempoDeEntrega = Math.floor(Math.random() * 3000) + 1000;

    setTimeout(() => {
        const exitoso = Math.random() > 0.2; // 80% de probabilidad de éxito
        if (exitoso) {
            resolve({ contenido: "libro", estado: "en tránsito" });
        } else {
            reject(new Error("El paquete se perdió en tránsito"));
        }
    }, tiempoDeEntrega);
});

/**
 * Función que representa al destinatario final recibiendo el paquete.
 * Simula una mutación, como marcarlo como "entregado".
 * @param {{ contenido: string, estado: string }} paquete
 */
export const entregarAlDestinatario = (paquete) => {
    paquete.estado = "entregado";
    console.log(`📦 El destinatario recibió el paquete: ${paquete.contenido}. Estado: ${paquete.estado}`);
};

/**
 * procesarEnvio
 *
 * Esta función encadena pasos de manejo del paquete usando .then(), .catch() y .finally().
 * Cada paso simula una persona que realiza una acción sobre el paquete antes de pasarlo al siguiente.
 * En caso de error, se muestra un mensaje con .catch().
 */
export const procesarEnvio = () => {
    paquete
        .then((paquete) => {
            console.log("📍 En la bodega central: revisando el paquete...");
            paquete.revisado = true;
            return paquete;
        })
        .then((paquete) => {
            console.log("🚚 En camino al centro de distribución...");
            paquete.ubicacion = "centro de distribución";
            return paquete;
        })
        .then((paquete) => {
            console.log("📬 Entregando al destinatario...");
            entregarAlDestinatario(paquete);
        })
        .catch((error) => {
            console.error("❌ Error en la entrega:", error.message);
        })
        .finally(() => {
            console.log("🔁 Fin del proceso logístico.");
        });
};

// Ejemplo de ejecución
procesarEnvio();
